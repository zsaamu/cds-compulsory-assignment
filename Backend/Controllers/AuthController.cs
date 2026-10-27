using System.Security.Claims;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IAuthorizationService = Backend.Services.IAuthorizationService;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IAuthorizationService _authService;

    public AuthController(AppDbContext context, IAuthorizationService authService)
    {
        _context = context;
        _authService = authService;
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
        {
            return BadRequest(new { message = "Username is already taken" });
        }
        
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            Fullname = dto.FullName,
            Username = dto.Username,
            PasswordHash = passwordHash,
            Role = "user" 
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User registered successfully", username = user.Username });
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
        
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }
        var token = _authService.GenerateToken(user);

        return Ok(new 
        { 
            message = "Login successful", 
            token = token, 
            name = user.Fullname,
            username = user.Username, 
            role = user.Role 
        });
    }
    
    [HttpGet("users")]
    [Authorize] 
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users.Select(u => new { u.Id, u.Fullname, u.Username, u.Role }).ToListAsync();
        return Ok(users);
    }
    
    [HttpPost("users")]
    [Authorize(Roles = "admin,superuser")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
        {
            return BadRequest(new { message = "Username is already taken" });
        }
        
        var currentRole = User.FindFirstValue(ClaimTypes.Role);
        string targetRole = string.IsNullOrEmpty(dto.Role) ? "user" : dto.Role.ToLower();
        
        if (currentRole == "superuser" && targetRole != "user")
        {
            return BadRequest(new { message = "Superusers can only create users with 'user' role" });
        }
        
        if (targetRole != "user" && targetRole != "superuser" && targetRole != "admin")
        {
            return BadRequest(new { message = "Invalid role specified. Allowed roles: user, superuser, admin" });
        }

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            Fullname = dto.FullName,
            Username = dto.Username,
            PasswordHash = passwordHash,
            Role = targetRole
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User created successfully", id = user.Id, username = user.Username, role = user.Role });
    }
    
    [HttpPut("users/{id}")]
    [Authorize(Roles = "admin,superuser")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
    {
        var targetUser = await _context.Users.FindAsync(id);
        if (targetUser == null)
        {
            return NotFound(new { message = "User not found" });
        }
        
        var currentRole = User.FindFirstValue(ClaimTypes.Role);
        
        if (currentRole == "superuser")
        {
            if (targetUser.Role != "user")
            {
                return BadRequest(new { message = "Superusers can only edit regular users" });
            }
            if (!string.IsNullOrEmpty(dto.Role) && dto.Role.ToLower() != "user")
            {
                return BadRequest(new { message = "Superusers cannot assign superuser or admin roles" });
            }
        }
        
        if (!string.IsNullOrEmpty(dto.FullName))
            targetUser.Fullname = dto.FullName;

        if (!string.IsNullOrEmpty(dto.Username))
        {
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username && u.Id != id))
            {
                return BadRequest(new { message = "Username is already taken" });
            }
            targetUser.Username = dto.Username;
        }

        if (!string.IsNullOrEmpty(dto.Password))
        {
            targetUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        }
        
        if (!string.IsNullOrEmpty(dto.Role) && currentRole == "admin")
        {
            string newRole = dto.Role.ToLower();
            if (newRole == "user" || newRole == "superuser" || newRole == "admin")
            {
                targetUser.Role = newRole;
            }
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "User updated successfully" });
    }
    
    [HttpDelete("users/{id}")]
    [Authorize(Roles = "admin,superuser")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var targetUser = await _context.Users.FindAsync(id);
        if (targetUser == null)
        {
            return NotFound(new { message = "User not found" });
        }
        
        var currentRole = User.FindFirstValue(ClaimTypes.Role);
        if (currentRole == "superuser" && targetUser.Role != "user")
        {
            return BadRequest(new { message = "Superusers can only delete regular users" });
        }

        _context.Users.Remove(targetUser);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User deleted successfully" });
    }
}

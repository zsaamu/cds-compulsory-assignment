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
            username = user.Username, 
            role = user.Role 
        });
    }
    
    [HttpGet("users")]
    [Authorize] 
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users.Select(u => new { u.Id, u.Username, u.Role }).ToListAsync();
        return Ok(users);
    }
}
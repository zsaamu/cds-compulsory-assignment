using System.Security.Claims;
using Backend.Models;

namespace Backend.Services;

public interface ITokenService
{
    string GenerateToken(User user);
    Task<User?> ValidateAndGetUserAsync(ClaimsPrincipal principal);
}
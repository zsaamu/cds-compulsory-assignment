using Backend.Models;

namespace Backend.Services;

public interface IAuthorizationService
{
    string GenerateToken(User user);
}
using UniversityDashBoardProject.Application.DTOs.Auth;

namespace UniversityDashBoardProject.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request);
        Task<bool> RevokeTokenAsync(string username);
    }
}

using UniversityDashBoardProject.Application.DTOs.Auth;

namespace UniversityDashBoardProject.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request);
        Task<bool> RevokeTokenAsync(string username);
        
        // Profil metodları
        Task<UserProfileDto> GetUserProfileAsync(int userId);
        Task<UserSummaryDto> GetUserSummaryAsync(int userId);
    }
}

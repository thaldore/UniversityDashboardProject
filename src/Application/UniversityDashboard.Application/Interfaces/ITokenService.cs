using System.Security.Claims;
using UniversityDashBoardProject.Domain.Entities;

namespace UniversityDashBoardProject.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(ApplicationUser user, IList<string> roles);
        string GenerateRefreshToken();
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    }
}

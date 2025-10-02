using MediatR;
using UniversityDashBoardProject.Application.DTOs.Auth;
using UniversityDashBoardProject.Application.Features.Auth.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Auth.Handlers
{
    public class GetUserProfileHandler : IRequestHandler<GetUserProfileQuery, UserProfileDto>
    {
        private readonly IAuthService _authService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetUserProfileHandler>();

        public GetUserProfileHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<UserProfileDto> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting user profile for user: {UserId}", request.UserId);
            
            try
            {
                var result = await _authService.GetUserProfileAsync(request.UserId);
                _logger.Information("User profile retrieved successfully for user: {UserId}", request.UserId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting user profile for user: {UserId}", request.UserId);
                throw;
            }
        }
    }
}

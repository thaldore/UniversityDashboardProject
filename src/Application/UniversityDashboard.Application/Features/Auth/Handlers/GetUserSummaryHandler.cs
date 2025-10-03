using MediatR;
using UniversityDashBoardProject.Application.Features.Auth.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Auth;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Auth.Handlers
{
    public class GetUserSummaryHandler : IRequestHandler<GetUserSummaryQuery, UserSummaryDto>
    {
        private readonly IAuthService _authService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetUserSummaryHandler>();

        public GetUserSummaryHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<UserSummaryDto> Handle(GetUserSummaryQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting summary profile for user ID: {UserId}", request.UserId);
            
            try
            {
                var result = await _authService.GetUserSummaryAsync(request.UserId);
                _logger.Information("User summary retrieved successfully for user ID: {UserId}", request.UserId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting user summary for user ID: {UserId}", request.UserId);
                throw;
            }
        }
    }
}
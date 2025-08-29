using MediatR;
using UniversityDashBoardProject.Application.DTOs.Auth;
using UniversityDashBoardProject.Application.Features.Auth.Queries;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Auth.Handlers
{
    public class GetUserSummaryHandler : IRequestHandler<GetUserSummaryQuery, UserSummaryDto>
    {
        private readonly IAuthService _authService;

        public GetUserSummaryHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<UserSummaryDto> Handle(GetUserSummaryQuery request, CancellationToken cancellationToken)
        {
            return await _authService.GetUserSummaryAsync(request.UserId);
        }
    }
}

using MediatR;
using UniversityDashBoardProject.Application.DTOs.Auth;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Auth.Commands
{
    public class RefreshTokenCommand : IRequest<AuthResponse>
    {
        public RefreshTokenRequest Request { get; set; } = null!;
    }

    public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResponse>
    {
        private readonly IAuthService _authService;

        public RefreshTokenCommandHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<AuthResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {
            return await _authService.RefreshTokenAsync(request.Request);
        }
    }
}

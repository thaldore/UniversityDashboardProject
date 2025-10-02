using MediatR;
using UniversityDashBoardProject.Application.DTOs.Auth;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Auth.Commands
{
    public class LoginCommand : IRequest<AuthResponse>
    {
        public LoginRequest Request { get; set; } = null!;
    }

    public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse>
    {
        private readonly IAuthService _authService;

        public LoginCommandHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            return await _authService.LoginAsync(request.Request);
        }
    }
}

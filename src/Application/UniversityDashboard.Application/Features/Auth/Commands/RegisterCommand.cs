using MediatR;
using UniversityDashBoardProject.Application.DTOs.Auth;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Auth.Commands
{
    public class RegisterCommand : IRequest<AuthResponse>
    {
        public RegisterRequest Request { get; set; } = null!;
    }

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
    {
        private readonly IAuthService _authService;

        public RegisterCommandHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            return await _authService.RegisterAsync(request.Request);
        }
    }
}

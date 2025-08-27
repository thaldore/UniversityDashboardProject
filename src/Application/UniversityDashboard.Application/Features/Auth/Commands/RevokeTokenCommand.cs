using MediatR;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Auth.Commands
{
    public class RevokeTokenCommand : IRequest<bool>
    {
        public string Username { get; set; } = string.Empty;
    }

    public class RevokeTokenCommandHandler : IRequestHandler<RevokeTokenCommand, bool>
    {
        private readonly IAuthService _authService;

        public RevokeTokenCommandHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<bool> Handle(RevokeTokenCommand request, CancellationToken cancellationToken)
        {
            return await _authService.RevokeTokenAsync(request.Username);
        }
    }
}

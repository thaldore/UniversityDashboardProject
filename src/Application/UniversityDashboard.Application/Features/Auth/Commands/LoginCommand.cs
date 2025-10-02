using MediatR;
using UniversityDashBoardProject.Application.DTOs.Auth;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Auth.Commands
{
    public class LoginCommand : IRequest<AuthResponse>
    {
        public LoginRequest Request { get; set; } = null!;
    }

    public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse>
    {
        private readonly IAuthService _authService;
        private readonly Serilog.ILogger _logger = Log.ForContext<LoginCommandHandler>();

        public LoginCommandHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Processing login request for user: {Username}", request.Request.Username);
            
            try
            {
                var result = await _authService.LoginAsync(request.Request);
                _logger.Information("Login successful for user: {Username}", request.Request.Username);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Login failed for user: {Username}", request.Request.Username);
                throw;
            }
        }
    }
}

using MediatR;
using UniversityDashBoardProject.Application.DTOs.Auth;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Auth.Commands
{
    public class RegisterCommand : IRequest<AuthResponse>
    {
        public RegisterRequest Request { get; set; } = null!;
    }

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
    {
        private readonly IAuthService _authService;
        private readonly Serilog.ILogger _logger = Log.ForContext<RegisterCommandHandler>();

        public RegisterCommandHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Processing registration request for user: {Username}", request.Request.Username);
            
            try
            {
                var result = await _authService.RegisterAsync(request.Request);
                _logger.Information("User registered successfully: {Username}", request.Request.Username);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error registering user: {Username}", request.Request.Username);
                throw;
            }
        }
    }
}

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniversityDashBoardProject.Application.DTOs.Auth;
using UniversityDashBoardProject.Application.Features.Auth.Commands;

namespace UniversityDashBoardProject.Presentation.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var command = new LoginCommand { Request = request };
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var command = new RegisterCommand { Request = request };
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request)
        {
            var command = new RefreshTokenCommand { Request = request };
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [Authorize]
        [HttpPost("revoke")]
        public async Task<IActionResult> Revoke()
        {
            var username = User.Identity!.Name;
            var command = new RevokeTokenCommand { Username = username! };
            var result = await _mediator.Send(command);
            return Ok(new { message = "Token revoked successfully" });
        }
    }
}

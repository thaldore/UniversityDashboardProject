using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniversityDashBoardProject.Application.DTOs.Auth;
using UniversityDashBoardProject.Application.Features.Auth.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;
using System.Security.Claims;

namespace UniversityDashBoardProject.Presentation.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IAuthService _authService;
        private readonly Serilog.ILogger _logger = Log.ForContext<AuthController>();

        public AuthController(IMediator mediator, IAuthService authService)
        {
            _mediator = mediator;
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                _logger.Information("Login request received for user: {Username}", request.Username);
                var command = new LoginCommand { Request = request };
                var result = await _mediator.Send(command);
                _logger.Information("Login successful for user: {Username}", request.Username);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Login failed for user: {Username}", request.Username);
                return Unauthorized(new { message = "Invalid credentials" });
            }
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
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username))
            {
                return BadRequest(new { error = "Username not found in token" });
            }
            
            var command = new RevokeTokenCommand { Username = username };
            var result = await _mediator.Send(command);
            return Ok(new { message = "Token revoked successfully", result });
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return BadRequest(new { error = "User ID not found in token" });
                }

                _logger.Information("Profile request received for user ID: {UserId}", userId);
                var result = await _authService.GetUserProfileAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Failed to get user profile");
                return StatusCode(500, new { message = "Failed to get user profile" });
            }
        }

        [Authorize]
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return BadRequest(new { error = "User ID not found in token" });
                }

                _logger.Information("Summary request received for user ID: {UserId}", userId);
                var result = await _authService.GetUserSummaryAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Failed to get user summary");
                return StatusCode(500, new { message = "Failed to get user summary" });
            }
        }
    }
}

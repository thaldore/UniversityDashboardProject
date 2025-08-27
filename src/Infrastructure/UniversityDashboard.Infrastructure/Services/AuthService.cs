using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using UniversityDashBoardProject.Application.DTOs.Auth;
using Microsoft.Extensions.Configuration;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Domain.Entities;
using UniversityDashBoardProject.Infrastructure.Persistence;

namespace UniversityDashBoardProject.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ITokenService tokenService,
            IConfiguration configuration,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _configuration = configuration;
            _context = context;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userManager.FindByNameAsync(request.Username);
            if (user == null || !user.IsActive)
                throw new UnauthorizedAccessException("Invalid credentials");

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if (!result.Succeeded)
                throw new UnauthorizedAccessException("Invalid credentials");

            var roles = await _userManager.GetRolesAsync(user);
            var token = _tokenService.GenerateToken(user, roles);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration["Jwt:RefreshTokenExpirationInDays"] ?? "7"));
            await _userManager.UpdateAsync(user);

            return new AuthResponse
            {
                Token = token,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["Jwt:TokenExpirationInMinutes"]!)),
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.UserName!,
                    Email = user.Email!,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    DepartmentId = user.DepartmentId,
                    Roles = roles.ToList()
                }
            };
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            var user = new ApplicationUser
            {
                UserName = request.Username,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                DepartmentId = request.DepartmentId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));

            // Default role assignment (örneğin "User") - ensure role exists in migration/seed
            if (!await _userManager.IsInRoleAsync(user, "User"))
                await _userManager.AddToRoleAsync(user, "User");

            var roles = await _userManager.GetRolesAsync(user);
            var token = _tokenService.GenerateToken(user, roles);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration["Jwt:RefreshTokenExpirationInDays"] ?? "7"));
            await _userManager.UpdateAsync(user);

            return new AuthResponse
            {
                Token = token,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["Jwt:TokenExpirationInMinutes"]!)),
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.UserName!,
                    Email = user.Email!,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    DepartmentId = user.DepartmentId,
                    Roles = roles.ToList()
                }
            };
        }

        public async Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request)
        {
            var principal = _tokenService.GetPrincipalFromExpiredToken(request.Token);
            var username = principal.Identity!.Name;

            var user = await _userManager.FindByNameAsync(username!);
            if (user == null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                throw new SecurityTokenException("Invalid refresh token");

            var roles = await _userManager.GetRolesAsync(user);
            var newToken = _tokenService.GenerateToken(user, roles);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration["Jwt:RefreshTokenExpirationInDays"] ?? "7"));
            await _userManager.UpdateAsync(user);

            return new AuthResponse
            {
                Token = newToken,
                RefreshToken = newRefreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["Jwt:TokenExpirationInMinutes"]!)),
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.UserName!,
                    Email = user.Email!,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    DepartmentId = user.DepartmentId,
                    Roles = roles.ToList()
                }
            };
        }

        public async Task<bool> RevokeTokenAsync(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return false;

            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await _userManager.UpdateAsync(user);

            return true;
        }
    }
}

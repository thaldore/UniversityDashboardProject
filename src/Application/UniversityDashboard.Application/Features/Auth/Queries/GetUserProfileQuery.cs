using MediatR;
using UniversityDashBoardProject.Application.DTOs.Auth;

namespace UniversityDashBoardProject.Application.Features.Auth.Queries
{
    public class GetUserProfileQuery : IRequest<UserProfileDto>
    {
        public int UserId { get; set; }
    }
}
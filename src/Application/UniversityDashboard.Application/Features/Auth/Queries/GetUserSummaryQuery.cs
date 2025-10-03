using MediatR;
using UniversityDashBoardProject.Application.DTOs.Auth;

namespace UniversityDashBoardProject.Application.Features.Auth.Queries
{
    public class GetUserSummaryQuery : IRequest<UserSummaryDto>
    {
        public int UserId { get; set; }
    }
}
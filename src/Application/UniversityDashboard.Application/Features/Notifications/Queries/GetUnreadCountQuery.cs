using MediatR;

namespace UniversityDashBoardProject.Application.Features.Notifications.Queries
{
    public class GetUnreadCountQuery : IRequest<int>
    {
        public int UserId { get; set; }
    }
}

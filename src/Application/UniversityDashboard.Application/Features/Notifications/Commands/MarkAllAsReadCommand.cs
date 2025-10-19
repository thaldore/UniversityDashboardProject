using MediatR;

namespace UniversityDashBoardProject.Application.Features.Notifications.Commands
{
    public class MarkAllAsReadCommand : IRequest<int>
    {
        public int UserId { get; set; }
    }
}

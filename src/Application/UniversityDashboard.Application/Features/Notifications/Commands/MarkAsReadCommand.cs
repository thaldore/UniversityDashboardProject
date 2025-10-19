using MediatR;

namespace UniversityDashBoardProject.Application.Features.Notifications.Commands
{
    public class MarkAsReadCommand : IRequest<bool>
    {
        public int NotificationId { get; set; }
        public int UserId { get; set; }
    }
}

using MediatR;
using UniversityDashBoardProject.Application.DTOs.Notification;

namespace UniversityDashBoardProject.Application.Features.Notifications.Queries
{
    public class GetNotificationSummaryQuery : IRequest<NotificationSummaryDto>
    {
        public int UserId { get; set; }
    }
}

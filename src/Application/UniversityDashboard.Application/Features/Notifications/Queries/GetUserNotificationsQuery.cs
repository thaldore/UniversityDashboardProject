using MediatR;
using UniversityDashBoardProject.Application.DTOs.Notification;

namespace UniversityDashBoardProject.Application.Features.Notifications.Queries
{
    public class GetUserNotificationsQuery : IRequest<List<NotificationDto>>
    {
        public int UserId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public bool? OnlyUnread { get; set; }
    }
}

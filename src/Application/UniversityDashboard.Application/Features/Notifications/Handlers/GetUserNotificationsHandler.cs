using MediatR;
using UniversityDashBoardProject.Application.DTOs.Notification;
using UniversityDashBoardProject.Application.Features.Notifications.Queries;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Notifications.Handlers
{
    public class GetUserNotificationsHandler : IRequestHandler<GetUserNotificationsQuery, List<NotificationDto>>
    {
        private readonly INotificationService _notificationService;

        public GetUserNotificationsHandler(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        public async Task<List<NotificationDto>> Handle(GetUserNotificationsQuery request, CancellationToken cancellationToken)
        {
            return await _notificationService.GetUserNotificationsAsync(
                request.UserId, 
                request.PageNumber, 
                request.PageSize, 
                request.OnlyUnread);
        }
    }
}

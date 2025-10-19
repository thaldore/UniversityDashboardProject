using MediatR;
using UniversityDashBoardProject.Application.DTOs.Notification;
using UniversityDashBoardProject.Application.Features.Notifications.Queries;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Notifications.Handlers
{
    public class GetNotificationSummaryHandler : IRequestHandler<GetNotificationSummaryQuery, NotificationSummaryDto>
    {
        private readonly INotificationService _notificationService;

        public GetNotificationSummaryHandler(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        public async Task<NotificationSummaryDto> Handle(GetNotificationSummaryQuery request, CancellationToken cancellationToken)
        {
            return await _notificationService.GetNotificationSummaryAsync(request.UserId);
        }
    }
}

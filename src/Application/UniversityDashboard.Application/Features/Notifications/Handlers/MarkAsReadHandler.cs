using MediatR;
using UniversityDashBoardProject.Application.Features.Notifications.Commands;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Notifications.Handlers
{
    public class MarkAsReadHandler : IRequestHandler<MarkAsReadCommand, bool>
    {
        private readonly INotificationService _notificationService;

        public MarkAsReadHandler(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        public async Task<bool> Handle(MarkAsReadCommand request, CancellationToken cancellationToken)
        {
            return await _notificationService.MarkAsReadAsync(request.NotificationId, request.UserId);
        }
    }
}

using MediatR;
using UniversityDashBoardProject.Application.Features.Notifications.Commands;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Notifications.Handlers
{
    public class DeleteNotificationHandler : IRequestHandler<DeleteNotificationCommand, bool>
    {
        private readonly INotificationService _notificationService;

        public DeleteNotificationHandler(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        public async Task<bool> Handle(DeleteNotificationCommand request, CancellationToken cancellationToken)
        {
            return await _notificationService.DeleteNotificationAsync(request.NotificationId, request.UserId);
        }
    }
}

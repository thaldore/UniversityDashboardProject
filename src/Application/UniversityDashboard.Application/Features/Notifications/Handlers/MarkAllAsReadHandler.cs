using MediatR;
using UniversityDashBoardProject.Application.Features.Notifications.Commands;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Notifications.Handlers
{
    public class MarkAllAsReadHandler : IRequestHandler<MarkAllAsReadCommand, int>
    {
        private readonly INotificationService _notificationService;

        public MarkAllAsReadHandler(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        public async Task<int> Handle(MarkAllAsReadCommand request, CancellationToken cancellationToken)
        {
            return await _notificationService.MarkAllAsReadAsync(request.UserId);
        }
    }
}

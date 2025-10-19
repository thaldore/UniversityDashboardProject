using MediatR;
using UniversityDashBoardProject.Application.Features.Notifications.Queries;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Notifications.Handlers
{
    public class GetUnreadCountHandler : IRequestHandler<GetUnreadCountQuery, int>
    {
        private readonly INotificationService _notificationService;

        public GetUnreadCountHandler(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        public async Task<int> Handle(GetUnreadCountQuery request, CancellationToken cancellationToken)
        {
            return await _notificationService.GetUnreadCountAsync(request.UserId);
        }
    }
}

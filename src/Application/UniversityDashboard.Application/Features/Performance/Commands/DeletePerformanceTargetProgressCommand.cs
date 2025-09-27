using MediatR;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class DeletePerformanceTargetProgressCommand : IRequest<bool>
    {
        public int ProgressId { get; set; }
    }

    public class DeletePerformanceTargetProgressCommandHandler : IRequestHandler<DeletePerformanceTargetProgressCommand, bool>
    {
        private readonly IPerformanceService _performanceService;

        public DeletePerformanceTargetProgressCommandHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(DeletePerformanceTargetProgressCommand request, CancellationToken cancellationToken)
        {
            return await _performanceService.DeletePerformanceTargetProgressAsync(request.ProgressId);
        }
    }
}

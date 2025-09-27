using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class UpdatePerformanceTargetProgressCommand : IRequest<bool>
    {
        public int ProgressId { get; set; }
        public UpdatePerformanceTargetProgressRequest Request { get; set; } = null!;
    }

    public class UpdatePerformanceTargetProgressCommandHandler : IRequestHandler<UpdatePerformanceTargetProgressCommand, bool>
    {
        private readonly IPerformanceService _performanceService;

        public UpdatePerformanceTargetProgressCommandHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(UpdatePerformanceTargetProgressCommand request, CancellationToken cancellationToken)
        {
            return await _performanceService.UpdatePerformanceTargetProgressAsync(request.ProgressId, request.Request);
        }
    }
}

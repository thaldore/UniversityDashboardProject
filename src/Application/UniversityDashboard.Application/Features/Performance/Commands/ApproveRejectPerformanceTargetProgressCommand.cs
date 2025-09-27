using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class ApproveRejectPerformanceTargetProgressCommand : IRequest<bool>
    {
        public int ProgressId { get; set; }
        public ApproveRejectProgressRequest Request { get; set; } = null!;
    }

    public class ApproveRejectPerformanceTargetProgressCommandHandler : IRequestHandler<ApproveRejectPerformanceTargetProgressCommand, bool>
    {
        private readonly IPerformanceService _performanceService;

        public ApproveRejectPerformanceTargetProgressCommandHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(ApproveRejectPerformanceTargetProgressCommand request, CancellationToken cancellationToken)
        {
            return await _performanceService.ApproveRejectPerformanceTargetProgressAsync(request.ProgressId, request.Request);
        }
    }
}

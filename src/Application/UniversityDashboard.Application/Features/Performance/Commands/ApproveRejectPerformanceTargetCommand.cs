using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class ApproveRejectPerformanceTargetCommand : IRequest<bool>
    {
        public int TargetId { get; set; }
        public ApproveRejectTargetRequest Request { get; set; } = null!;
    }

    public class ApproveRejectPerformanceTargetCommandHandler : IRequestHandler<ApproveRejectPerformanceTargetCommand, bool>
    {
        private readonly IPerformanceService _performanceService;

        public ApproveRejectPerformanceTargetCommandHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(ApproveRejectPerformanceTargetCommand request, CancellationToken cancellationToken)
        {
            return await _performanceService.ApproveRejectPerformanceTargetAsync(request.TargetId, request.Request);
        }
    }
}

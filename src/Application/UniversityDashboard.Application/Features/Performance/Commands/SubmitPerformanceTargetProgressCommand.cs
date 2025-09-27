using MediatR;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class SubmitPerformanceTargetProgressCommand : IRequest<bool>
    {
        public int ProgressId { get; set; }
    }

    public class SubmitPerformanceTargetProgressCommandHandler : IRequestHandler<SubmitPerformanceTargetProgressCommand, bool>
    {
        private readonly IPerformanceService _performanceService;

        public SubmitPerformanceTargetProgressCommandHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(SubmitPerformanceTargetProgressCommand request, CancellationToken cancellationToken)
        {
            return await _performanceService.SubmitPerformanceTargetProgressAsync(request.ProgressId);
        }
    }
}

using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class AssignPerformanceTargetCommand : IRequest<bool>
    {
        public AssignPerformanceTargetRequest Request { get; set; } = null!;
    }

    public class AssignPerformanceTargetCommandHandler : IRequestHandler<AssignPerformanceTargetCommand, bool>
    {
        private readonly IPerformanceService _performanceService;

        public AssignPerformanceTargetCommandHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(AssignPerformanceTargetCommand request, CancellationToken cancellationToken)
        {
            return await _performanceService.AssignPerformanceTargetAsync(request.Request);
        }
    }
}

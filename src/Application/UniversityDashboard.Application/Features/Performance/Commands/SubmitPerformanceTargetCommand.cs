using MediatR;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class SubmitPerformanceTargetCommand : IRequest<bool>
    {
        public int TargetId { get; set; }
    }

    public class SubmitPerformanceTargetCommandHandler : IRequestHandler<SubmitPerformanceTargetCommand, bool>
    {
        private readonly IPerformanceService _performanceService;

        public SubmitPerformanceTargetCommandHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(SubmitPerformanceTargetCommand request, CancellationToken cancellationToken)
        {
            return await _performanceService.SubmitPerformanceTargetAsync(request.TargetId);
        }
    }
}

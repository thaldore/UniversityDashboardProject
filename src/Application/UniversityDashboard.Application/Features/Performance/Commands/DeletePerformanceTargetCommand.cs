using MediatR;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class DeletePerformanceTargetCommand : IRequest<bool>
    {
        public int TargetId { get; set; }
    }

    public class DeletePerformanceTargetCommandHandler : IRequestHandler<DeletePerformanceTargetCommand, bool>
    {
        private readonly IPerformanceService _performanceService;

        public DeletePerformanceTargetCommandHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(DeletePerformanceTargetCommand request, CancellationToken cancellationToken)
        {
            return await _performanceService.DeletePerformanceTargetAsync(request.TargetId);
        }
    }
}

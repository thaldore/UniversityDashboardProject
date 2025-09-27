using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class UpdatePerformanceTargetCommand : IRequest<bool>
    {
        public int TargetId { get; set; }
        public UpdatePerformanceTargetRequest Request { get; set; } = null!;
    }

    public class UpdatePerformanceTargetCommandHandler : IRequestHandler<UpdatePerformanceTargetCommand, bool>
    {
        private readonly IPerformanceService _performanceService;

        public UpdatePerformanceTargetCommandHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(UpdatePerformanceTargetCommand request, CancellationToken cancellationToken)
        {
            return await _performanceService.UpdatePerformanceTargetAsync(request.TargetId, request.Request);
        }
    }
}

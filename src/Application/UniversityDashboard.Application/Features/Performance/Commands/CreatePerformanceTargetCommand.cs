using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class CreatePerformanceTargetCommand : IRequest<int>
    {
        public CreatePerformanceTargetRequest Request { get; set; } = null!;
        public int CreatedBy { get; set; }
    }

    public class CreatePerformanceTargetCommandHandler : IRequestHandler<CreatePerformanceTargetCommand, int>
    {
        private readonly IPerformanceService _performanceService;

        public CreatePerformanceTargetCommandHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<int> Handle(CreatePerformanceTargetCommand request, CancellationToken cancellationToken)
        {
            return await _performanceService.CreatePerformanceTargetAsync(request.Request, request.CreatedBy);
        }
    }
}

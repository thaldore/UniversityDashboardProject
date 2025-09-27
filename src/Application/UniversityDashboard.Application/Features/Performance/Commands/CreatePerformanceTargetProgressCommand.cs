using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class CreatePerformanceTargetProgressCommand : IRequest<int>
    {
        public CreatePerformanceTargetProgressRequest Request { get; set; } = null!;
        public int EnteredBy { get; set; }
    }

    public class CreatePerformanceTargetProgressCommandHandler : IRequestHandler<CreatePerformanceTargetProgressCommand, int>
    {
        private readonly IPerformanceService _performanceService;

        public CreatePerformanceTargetProgressCommandHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<int> Handle(CreatePerformanceTargetProgressCommand request, CancellationToken cancellationToken)
        {
            return await _performanceService.CreatePerformanceTargetProgressAsync(request.Request, request.EnteredBy);
        }
    }
}

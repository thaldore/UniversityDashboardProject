using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class CreatePerformancePeriodCommand : IRequest<int>
    {
        public CreatePerformancePeriodRequest Request { get; set; } = null!;
        public int CreatedBy { get; set; }
    }

    public class CreatePerformancePeriodCommandHandler : IRequestHandler<CreatePerformancePeriodCommand, int>
    {
        private readonly IPerformanceService _performanceService;

        public CreatePerformancePeriodCommandHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<int> Handle(CreatePerformancePeriodCommand request, CancellationToken cancellationToken)
        {
            return await _performanceService.CreatePerformancePeriodAsync(request.Request, request.CreatedBy);
        }
    }
}

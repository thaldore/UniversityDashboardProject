using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class UpdatePerformancePeriodCommand : IRequest<bool>
    {
        public int PeriodId { get; set; }
        public UpdatePerformancePeriodRequest Request { get; set; } = null!;
    }

    public class UpdatePerformancePeriodCommandHandler : IRequestHandler<UpdatePerformancePeriodCommand, bool>
    {
        private readonly IPerformanceService _performanceService;

        public UpdatePerformancePeriodCommandHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(UpdatePerformancePeriodCommand request, CancellationToken cancellationToken)
        {
            return await _performanceService.UpdatePerformancePeriodAsync(request.PeriodId, request.Request);
        }
    }
}

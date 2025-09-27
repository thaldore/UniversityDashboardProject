using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformancePeriodByIdHandler : IRequestHandler<GetPerformancePeriodByIdQuery, PerformancePeriodDto?>
    {
        private readonly IPerformanceService _performanceService;

        public GetPerformancePeriodByIdHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<PerformancePeriodDto?> Handle(GetPerformancePeriodByIdQuery request, CancellationToken cancellationToken)
        {
            return await _performanceService.GetPerformancePeriodByIdAsync(request.PeriodId);
        }
    }
}

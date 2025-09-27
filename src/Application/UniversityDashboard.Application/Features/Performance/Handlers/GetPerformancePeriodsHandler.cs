using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformancePeriodsHandler : IRequestHandler<GetPerformancePeriodsQuery, List<PerformancePeriodListDto>>
    {
        private readonly IPerformanceService _performanceService;

        public GetPerformancePeriodsHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<PerformancePeriodListDto>> Handle(GetPerformancePeriodsQuery request, CancellationToken cancellationToken)
        {
            return await _performanceService.GetPerformancePeriodsAsync();
        }
    }
}

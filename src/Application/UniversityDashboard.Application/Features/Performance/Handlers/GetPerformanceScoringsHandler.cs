using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformanceScoringsHandler : IRequestHandler<GetPerformanceScoringsQuery, List<PerformanceScoringDto>>
    {
        private readonly IPerformanceService _performanceService;

        public GetPerformanceScoringsHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<PerformanceScoringDto>> Handle(GetPerformanceScoringsQuery request, CancellationToken cancellationToken)
        {
            return await _performanceService.GetPerformanceScoringsAsync(request.PeriodId);
        }
    }
}

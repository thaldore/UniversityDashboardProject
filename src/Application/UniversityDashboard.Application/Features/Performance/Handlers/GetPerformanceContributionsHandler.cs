using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformanceContributionsHandler : IRequestHandler<GetPerformanceContributionsQuery, List<PerformanceContributionDto>>
    {
        private readonly IPerformanceService _performanceService;

        public GetPerformanceContributionsHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<PerformanceContributionDto>> Handle(GetPerformanceContributionsQuery request, CancellationToken cancellationToken)
        {
            return await _performanceService.GetPerformanceContributionsAsync(request.TargetId);
        }
    }
}

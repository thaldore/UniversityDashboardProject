using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformanceTargetsHandler : IRequestHandler<GetPerformanceTargetsQuery, List<PerformanceTargetListDto>>
    {
        private readonly IPerformanceService _performanceService;

        public GetPerformanceTargetsHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<PerformanceTargetListDto>> Handle(GetPerformanceTargetsQuery request, CancellationToken cancellationToken)
        {
            return await _performanceService.GetPerformanceTargetsAsync(request.PeriodId, request.UserId, request.DepartmentId);
        }
    }
}

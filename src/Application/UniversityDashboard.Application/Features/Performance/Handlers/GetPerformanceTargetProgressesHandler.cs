using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformanceTargetProgressesHandler : IRequestHandler<GetPerformanceTargetProgressesQuery, List<PerformanceTargetProgressDto>>
    {
        private readonly IPerformanceService _performanceService;

        public GetPerformanceTargetProgressesHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<PerformanceTargetProgressDto>> Handle(GetPerformanceTargetProgressesQuery request, CancellationToken cancellationToken)
        {
            return await _performanceService.GetPerformanceTargetProgressesAsync(request.TargetId);
        }
    }
}

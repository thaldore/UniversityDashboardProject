using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformanceTargetProgressByIdHandler : IRequestHandler<GetPerformanceTargetProgressByIdQuery, PerformanceTargetProgressDto?>
    {
        private readonly IPerformanceService _performanceService;

        public GetPerformanceTargetProgressByIdHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<PerformanceTargetProgressDto?> Handle(GetPerformanceTargetProgressByIdQuery request, CancellationToken cancellationToken)
        {
            return await _performanceService.GetPerformanceTargetProgressByIdAsync(request.ProgressId);
        }
    }
}

using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformanceTargetByIdHandler : IRequestHandler<GetPerformanceTargetByIdQuery, PerformanceTargetDto?>
    {
        private readonly IPerformanceService _performanceService;

        public GetPerformanceTargetByIdHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<PerformanceTargetDto?> Handle(GetPerformanceTargetByIdQuery request, CancellationToken cancellationToken)
        {
            return await _performanceService.GetPerformanceTargetByIdAsync(request.TargetId);
        }
    }
}

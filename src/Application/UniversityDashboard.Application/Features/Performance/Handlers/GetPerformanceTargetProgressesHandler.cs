using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformanceTargetProgressesHandler : IRequestHandler<GetPerformanceTargetProgressesQuery, List<PerformanceTargetProgressDto>>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetPerformanceTargetProgressesHandler>();

        public GetPerformanceTargetProgressesHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<PerformanceTargetProgressDto>> Handle(GetPerformanceTargetProgressesQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting performance target progresses for target: {TargetId}", request.TargetId);
            
            try
            {
                var result = await _performanceService.GetPerformanceTargetProgressesAsync(request.TargetId);
                _logger.Information("Performance target progresses retrieved successfully for target: {TargetId}, count: {Count}", request.TargetId, result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting performance target progresses for target: {TargetId}", request.TargetId);
                throw;
            }
        }
    }
}

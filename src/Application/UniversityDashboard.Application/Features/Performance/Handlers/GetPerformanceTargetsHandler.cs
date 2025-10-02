using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformanceTargetsHandler : IRequestHandler<GetPerformanceTargetsQuery, List<PerformanceTargetListDto>>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetPerformanceTargetsHandler>();

        public GetPerformanceTargetsHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<PerformanceTargetListDto>> Handle(GetPerformanceTargetsQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting performance targets for period: {PeriodId}, user: {UserId}, department: {DepartmentId}", 
                request.PeriodId, request.UserId, request.DepartmentId);
            
            try
            {
                var result = await _performanceService.GetPerformanceTargetsAsync(request.PeriodId, request.UserId, request.DepartmentId);
                _logger.Information("Performance targets retrieved successfully for period: {PeriodId}, count: {Count}", request.PeriodId, result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting performance targets for period: {PeriodId}", request.PeriodId);
                throw;
            }
        }
    }
}

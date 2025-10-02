using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformanceAssignmentsHandler : IRequestHandler<GetPerformanceAssignmentsQuery, List<PerformanceAssignmentDto>>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetPerformanceAssignmentsHandler>();

        public GetPerformanceAssignmentsHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<PerformanceAssignmentDto>> Handle(GetPerformanceAssignmentsQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting performance assignments for period: {PeriodId}", request.PeriodId);
            
            try
            {
                var result = await _performanceService.GetPerformanceAssignmentsAsync(request.PeriodId);
                _logger.Information("Performance assignments retrieved successfully for period: {PeriodId}, count: {Count}", request.PeriodId, result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting performance assignments for period: {PeriodId}", request.PeriodId);
                throw;
            }
        }
    }
}

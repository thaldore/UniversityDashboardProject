using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetDepartmentTargetsSummaryHandler : IRequestHandler<GetDepartmentTargetsSummaryQuery, PerformanceSummaryDto>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetDepartmentTargetsSummaryHandler>();

        public GetDepartmentTargetsSummaryHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<PerformanceSummaryDto> Handle(GetDepartmentTargetsSummaryQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting department targets summary for department: {DepartmentId} in period: {PeriodId}", 
                request.DepartmentId, request.PeriodId);
            
            try
            {
                var result = await _performanceService.GetDepartmentTargetsSummaryAsync(request.DepartmentId, request.PeriodId);
                _logger.Information("Department targets summary retrieved successfully for department: {DepartmentId}", request.DepartmentId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting department targets summary for department: {DepartmentId}", request.DepartmentId);
                throw;
            }
        }
    }
}

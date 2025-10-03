using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPersonalTargetsSummaryHandler : IRequestHandler<GetPersonalTargetsSummaryQuery, PerformanceSummaryDto>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetPersonalTargetsSummaryHandler>();

        public GetPersonalTargetsSummaryHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<PerformanceSummaryDto> Handle(GetPersonalTargetsSummaryQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting personal targets summary for user: {UserId} in period: {PeriodId}", 
                request.UserId, request.PeriodId);
            
            try
            {
                var result = await _performanceService.GetPersonalTargetsSummaryAsync(request.UserId, request.PeriodId);
                _logger.Information("Personal targets summary retrieved successfully for user: {UserId}", request.UserId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting personal targets summary for user: {UserId}", request.UserId);
                throw;
            }
        }
    }
}

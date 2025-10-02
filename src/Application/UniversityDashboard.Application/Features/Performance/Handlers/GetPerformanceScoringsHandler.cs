using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformanceScoringsHandler : IRequestHandler<GetPerformanceScoringsQuery, List<PerformanceScoringDto>>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetPerformanceScoringsHandler>();

        public GetPerformanceScoringsHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<PerformanceScoringDto>> Handle(GetPerformanceScoringsQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting performance scorings for period: {PeriodId}", request.PeriodId);
            
            try
            {
                var result = await _performanceService.GetPerformanceScoringsAsync(request.PeriodId);
                _logger.Information("Performance scorings retrieved successfully for period: {PeriodId}, count: {Count}", request.PeriodId, result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting performance scorings for period: {PeriodId}", request.PeriodId);
                throw;
            }
        }
    }
}

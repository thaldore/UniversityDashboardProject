using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformancePeriodsHandler : IRequestHandler<GetPerformancePeriodsQuery, List<PerformancePeriodListDto>>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetPerformancePeriodsHandler>();

        public GetPerformancePeriodsHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<PerformancePeriodListDto>> Handle(GetPerformancePeriodsQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting performance periods");
            
            try
            {
                var result = await _performanceService.GetPerformancePeriodsAsync();
                _logger.Information("Performance periods retrieved successfully, count: {Count}", result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting performance periods");
                throw;
            }
        }
    }
}

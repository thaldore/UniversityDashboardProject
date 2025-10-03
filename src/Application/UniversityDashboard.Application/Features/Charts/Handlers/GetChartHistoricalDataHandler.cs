using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Chart;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class GetChartHistoricalDataHandler : IRequestHandler<GetChartHistoricalDataQuery, List<ChartHistoricalDataDto>>
    {
        private readonly IChartService _chartService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetChartHistoricalDataHandler>();

        public GetChartHistoricalDataHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<List<ChartHistoricalDataDto>> Handle(GetChartHistoricalDataQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting chart historical data for chart: {ChartId}, filter: {FilterId}", request.ChartId, request.FilterId);
            
            try
            {
                var result = await _chartService.GetChartHistoricalDataAsync(request.ChartId, request.FilterId);
                _logger.Information("Chart historical data retrieved successfully for chart: {ChartId}", request.ChartId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting chart historical data for chart: {ChartId}", request.ChartId);
                throw;
            }
        }
    }
}

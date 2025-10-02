using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Chart;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class GetChartDataHandler : IRequestHandler<GetChartDataQuery, ChartDataResponseDto>
    {
        private readonly IChartService _chartService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetChartDataHandler>();

        public GetChartDataHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<ChartDataResponseDto> Handle(GetChartDataQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting chart data for chart: {ChartId}, filter: {FilterId}, year: {Year}, period: {Period}", 
                request.ChartId, request.FilterId, request.Year, request.Period);
            
            try
            {
                var dataRequest = new ChartDataRequest
                {
                    ChartId = request.ChartId,
                    FilterId = request.FilterId,
                    Year = request.Year,
                    Period = request.Period,
                    IncludeHistoricalData = request.IncludeHistoricalData
                };

                var result = await _chartService.GetChartDataAsync(dataRequest);
                _logger.Information("Chart data retrieved successfully for chart: {ChartId}", request.ChartId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting chart data for chart: {ChartId}", request.ChartId);
                throw;
            }
        }
    }
}

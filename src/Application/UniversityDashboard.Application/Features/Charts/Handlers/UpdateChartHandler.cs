using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Chart;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class UpdateChartHandler : IRequestHandler<UpdateChartCommand, bool>
    {
        private readonly IChartService _chartService;
        private readonly Serilog.ILogger _logger = Log.ForContext<UpdateChartHandler>();

        public UpdateChartHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<bool> Handle(UpdateChartCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Updating chart: {ChartId}", request.ChartId);
            
            try
            {
                var updateRequest = new UpdateChartRequest
                {
                    ChartName = request.ChartName,
                    ChartType = request.ChartType,
                    Title = request.Title,
                    Subtitle = request.Subtitle,
                    Description = request.Description,
                    DisplayOrder = request.DisplayOrder,
                    IsActive = request.IsActive,
                    ShowHistoricalData = request.ShowHistoricalData,
                    HistoricalDataDisplayType = request.HistoricalDataDisplayType,
                    ShowHistoricalInChart = request.ShowHistoricalInChart,
                    HistoricalPeriodCount = request.HistoricalPeriodCount,
                    Indicators = request.Indicators,
                    Filters = request.Filters,
                    Groups = request.Groups
                };

                var result = await _chartService.UpdateChartAsync(request.ChartId, updateRequest);
                _logger.Information("Chart updated successfully: {ChartId}", request.ChartId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error updating chart: {ChartId}", request.ChartId);
                throw;
            }
        }
    }
}

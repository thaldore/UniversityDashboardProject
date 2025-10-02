using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Chart;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class CreateChartHandler : IRequestHandler<CreateChartCommand, int>
    {
        private readonly IChartService _chartService;
        private readonly Serilog.ILogger _logger = Log.ForContext<CreateChartHandler>();

        public CreateChartHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<int> Handle(CreateChartCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Creating chart: {ChartName} by user: {CreatedBy}", request.ChartName, request.CreatedBy);
            
            try
            {
                var createRequest = new CreateChartRequest
                {
                    ChartName = request.ChartName,
                    ChartType = request.ChartType,
                    Title = request.Title,
                    Subtitle = request.Subtitle,
                    Description = request.Description,
                    SectionId = request.SectionId,
                    DisplayOrder = request.DisplayOrder,
                    ShowHistoricalData = request.ShowHistoricalData,
                    HistoricalDataDisplayType = request.HistoricalDataDisplayType,
                    ShowHistoricalInChart = request.ShowHistoricalInChart,
                    HistoricalPeriodCount = request.HistoricalPeriodCount,
                    Indicators = request.Indicators,
                    Filters = request.Filters,
                    Groups = request.Groups
                };

                var result = await _chartService.CreateChartAsync(createRequest, request.CreatedBy);
                _logger.Information("Chart created successfully with ID: {ChartId}", result);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error creating chart: {ChartName}", request.ChartName);
                throw;
            }
        }
    }
}

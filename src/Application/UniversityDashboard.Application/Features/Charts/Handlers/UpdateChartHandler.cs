using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Chart;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class UpdateChartHandler : IRequestHandler<UpdateChartCommand, bool>
    {
        private readonly IChartService _chartService;

        public UpdateChartHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<bool> Handle(UpdateChartCommand request, CancellationToken cancellationToken)
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

            return await _chartService.UpdateChartAsync(request.ChartId, updateRequest);
        }
    }
}

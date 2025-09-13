using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Chart;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class CreateChartHandler : IRequestHandler<CreateChartCommand, int>
    {
        private readonly IChartService _chartService;

        public CreateChartHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<int> Handle(CreateChartCommand request, CancellationToken cancellationToken)
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
                Indicators = request.Indicators,
                Filters = request.Filters,
                Groups = request.Groups
            };

            return await _chartService.CreateChartAsync(createRequest, request.CreatedBy);
        }
    }
}

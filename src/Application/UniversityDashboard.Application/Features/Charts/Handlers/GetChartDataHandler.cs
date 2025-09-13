using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Chart;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class GetChartDataHandler : IRequestHandler<GetChartDataQuery, ChartDataResponseDto>
    {
        private readonly IChartService _chartService;

        public GetChartDataHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<ChartDataResponseDto> Handle(GetChartDataQuery request, CancellationToken cancellationToken)
        {
            var dataRequest = new ChartDataRequest
            {
                ChartId = request.ChartId,
                FilterId = request.FilterId,
                Year = request.Year,
                Period = request.Period,
                IncludeHistoricalData = request.IncludeHistoricalData
            };

            return await _chartService.GetChartDataAsync(dataRequest);
        }
    }
}

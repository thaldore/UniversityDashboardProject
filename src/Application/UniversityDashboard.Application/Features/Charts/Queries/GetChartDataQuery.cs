using MediatR;
using UniversityDashBoardProject.Application.DTOs.Chart;

namespace UniversityDashBoardProject.Application.Features.Charts.Queries
{
    public class GetChartDataQuery : IRequest<ChartDataResponseDto>
    {
        public int ChartId { get; set; }
        public int? FilterId { get; set; }
        public int Year { get; set; }
        public int Period { get; set; }
        public bool IncludeHistoricalData { get; set; }
    }

    public class ChartDataResponseDto
    {
        public string ChartTitle { get; set; } = string.Empty;
        public string ChartType { get; set; } = string.Empty;
        public List<ChartDataDto> CurrentData { get; set; } = new();
        public List<ChartHistoricalDataDto> HistoricalData { get; set; } = new();
        public Dictionary<string, object> ChartOptions { get; set; } = new();
    }
}

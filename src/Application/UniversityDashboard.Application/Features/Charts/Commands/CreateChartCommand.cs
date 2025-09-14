using MediatR;
using UniversityDashBoardProject.Application.DTOs.Chart;

namespace UniversityDashBoardProject.Application.Features.Charts.Commands
{
    public class CreateChartCommand : IRequest<int>
    {
        public string ChartName { get; set; } = string.Empty;
        public Domain.Enums.ChartType ChartType { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        public string? Description { get; set; }
        public int SectionId { get; set; }
        public int DisplayOrder { get; set; }
        public bool ShowHistoricalData { get; set; }
        public Domain.Enums.HistoricalDataDisplayType? HistoricalDataDisplayType { get; set; }
        public bool ShowHistoricalInChart { get; set; }
        public int? HistoricalPeriodCount { get; set; }
        public int CreatedBy { get; set; }
        public List<CreateChartIndicatorRequest> Indicators { get; set; } = new();
        public List<CreateChartFilterRequest> Filters { get; set; } = new();
        public List<CreateChartGroupRequest> Groups { get; set; } = new();
    }
}

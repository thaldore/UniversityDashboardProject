using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Application.DTOs.Chart
{
    public class ChartDto
    {
        public int ChartId { get; set; }
        public string ChartName { get; set; } = string.Empty;
        public ChartType ChartType { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        public string? Description { get; set; }
        public int SectionId { get; set; }
        public string SectionName { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public bool ShowHistoricalData { get; set; }
        public HistoricalDataDisplayType? HistoricalDataDisplayType { get; set; }
        public bool ShowHistoricalInChart { get; set; }
        public int? HistoricalPeriodCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<ChartIndicatorDto> Indicators { get; set; } = new();
        public List<ChartFilterDto> Filters { get; set; } = new();
        public List<ChartGroupDto> Groups { get; set; } = new();
    }

    public class ChartListDto
    {
        public int ChartId { get; set; }
        public string ChartName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public ChartType ChartType { get; set; }
        public string ChartTypeName { get; set; } = string.Empty;
        public string SectionName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int IndicatorCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ChartDetailDto
    {
        public int ChartId { get; set; }
        public string ChartName { get; set; } = string.Empty;
        public ChartType ChartType { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        public string? Description { get; set; }
        public int SectionId { get; set; }
        public int DisplayOrder { get; set; }
        public bool ShowHistoricalData { get; set; }
        public HistoricalDataDisplayType? HistoricalDataDisplayType { get; set; }
        public bool ShowHistoricalInChart { get; set; }
        public int? HistoricalPeriodCount { get; set; }
        public List<ChartIndicatorDto> Indicators { get; set; } = new();
        public List<ChartFilterDto> Filters { get; set; } = new();
        public List<ChartGroupDto> Groups { get; set; } = new();
    }
}

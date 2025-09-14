using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Application.DTOs.Chart
{
    public class CreateChartRequest
    {
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
        public List<CreateChartIndicatorRequest> Indicators { get; set; } = new();
        public List<CreateChartFilterRequest> Filters { get; set; } = new();
        public List<CreateChartGroupRequest> Groups { get; set; } = new();
    }

    public class UpdateChartRequest
    {
        public string ChartName { get; set; } = string.Empty;
        public ChartType ChartType { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        public string? Description { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public bool ShowHistoricalData { get; set; }
        public HistoricalDataDisplayType? HistoricalDataDisplayType { get; set; }
        public bool ShowHistoricalInChart { get; set; }
        public int? HistoricalPeriodCount { get; set; }
        public List<CreateChartIndicatorRequest> Indicators { get; set; } = new();
        public List<CreateChartFilterRequest> Filters { get; set; } = new();
        public List<CreateChartGroupRequest> Groups { get; set; } = new();
    }

    public class CreateChartSectionRequest
    {
        public string SectionName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? ParentId { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class UpdateChartSectionRequest
    {
        public string SectionName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateChartIndicatorRequest
    {
        public int IndicatorId { get; set; }
        public int DisplayOrder { get; set; }
        public string? Color { get; set; }
        public string? Label { get; set; }
        public bool IsVisible { get; set; } = true;
    }

    public class CreateChartFilterRequest
    {
        public string FilterName { get; set; } = string.Empty;
        public FilterType FilterType { get; set; }
        public string FilterValue { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
        public int DisplayOrder { get; set; }
        public List<int> IndicatorIds { get; set; } = new();
    }

    public class CreateChartGroupRequest
    {
        public string GroupName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int DisplayOrder { get; set; }
        public string? Color { get; set; }
        public List<int> IndicatorIds { get; set; } = new();
    }

    public class ChartDataRequest
    {
        public int ChartId { get; set; }
        public int? FilterId { get; set; }
        public int Year { get; set; }
        public int Period { get; set; }
        public bool IncludeHistoricalData { get; set; }
    }
}

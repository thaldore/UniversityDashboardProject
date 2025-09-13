using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Application.DTOs.Chart
{
    public class ChartIndicatorDto
    {
        public int IndicatorId { get; set; }
        public string IndicatorCode { get; set; } = string.Empty;
        public string IndicatorName { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
        public string? Color { get; set; }
        public string? Label { get; set; }
        public bool IsVisible { get; set; }
        public decimal? CurrentValue { get; set; }
        public string? Unit { get; set; }
    }

    public class ChartFilterDto
    {
        public int FilterId { get; set; }
        public string FilterName { get; set; } = string.Empty;
        public FilterType FilterType { get; set; }
        public string FilterValue { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
        public int DisplayOrder { get; set; }
        public List<int> IndicatorIds { get; set; } = new();
    }

    public class ChartGroupDto
    {
        public int GroupId { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int DisplayOrder { get; set; }
        public string? Color { get; set; }
        public List<ChartIndicatorDto> Indicators { get; set; } = new();
    }

    public class ChartDataDto
    {
        public string Label { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public decimal? Percentage { get; set; }
        public string? Color { get; set; }
        public string? Unit { get; set; }
        public Dictionary<string, object> AdditionalData { get; set; } = new();
    }

    public class ChartHistoricalDataDto
    {
        public int Year { get; set; }
        public int Period { get; set; }
        public string PeriodLabel { get; set; } = string.Empty;
        public List<ChartDataDto> Data { get; set; } = new();
    }
}

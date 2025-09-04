using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Application.DTOs.Indicator
{
    public class IndicatorListDto
    {
        public int IndicatorId { get; set; }
        public string IndicatorCode { get; set; } = string.Empty;
        public string IndicatorName { get; set; } = string.Empty;
        public string DepartmentName { get; set; } = string.Empty;
        public string DataTypeName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public List<string> RootValues { get; set; } = new();
        public string? AssignedUserName { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class IndicatorDetailDto
    {
        public int IndicatorId { get; set; }
        public string IndicatorCode { get; set; } = string.Empty;
        public string IndicatorName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public IndicatorDataType DataType { get; set; }
        public PeriodType PeriodType { get; set; }
        public DateTime? PeriodStartDate { get; set; }
        public int NotificationPeriod { get; set; }
        public bool IsAutomatic { get; set; }
        public int? AssignedUserId { get; set; }
        public string? AssignedUserName { get; set; }
        public int? NotificationUserId { get; set; }
        public string? NotificationUserName { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<RootValueDto> RootValues { get; set; } = new();
        public List<HistoricalDataDto> HistoricalData { get; set; } = new();
    }

    public class RootValueDto
    {
        public int RootValueId { get; set; }
        public string RootValue { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SortOrder { get; set; }
    }

    public class HistoricalDataDto
    {
        public int HistoricalId { get; set; }
        public string PeriodLabel { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public string? Description { get; set; }
    }
}

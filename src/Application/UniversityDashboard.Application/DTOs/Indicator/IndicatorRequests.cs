using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Application.DTOs.Indicator
{
    public class CreateIndicatorRequest
    {
        public string IndicatorCode { get; set; } = string.Empty;
        public string IndicatorName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int DepartmentId { get; set; }
        public IndicatorDataType DataType { get; set; }
        public PeriodType PeriodType { get; set; }
        public DateTime? PeriodStartDate { get; set; }
        public int NotificationPeriod { get; set; } = 7;
        public bool IsAutomatic { get; set; }
        public int? AssignedUserId { get; set; }
        public int? NotificationUserId { get; set; }
        public bool IsActive { get; set; } = true;
        public List<CreateRootValueRequest> RootValues { get; set; } = new();
        public List<CreateHistoricalDataRequest> HistoricalData { get; set; } = new();
    }
    
    public class CreateRootValueRequest
    {
        public string RootValue { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SortOrder { get; set; } = 1;
    }
    
    public class CreateHistoricalDataRequest
    {
        public string PeriodLabel { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public string? Description { get; set; }
    }

    public class UpdateIndicatorRequest : CreateIndicatorRequest
    {
        // UpdateIndicatorRequest, CreateIndicatorRequest ile aynı alanları kullanıyor
    }
    
    public class ToggleStatusRequest
    {
        public bool IsActive { get; set; }
    }
}

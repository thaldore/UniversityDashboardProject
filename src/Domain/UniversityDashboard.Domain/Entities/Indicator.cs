using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Domain.Entities
{
    public class Indicator
    {
        public int IndicatorId { get; set; }
        public string IndicatorCode { get; set; } = string.Empty;
        public string IndicatorName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int DepartmentId { get; set; }
        public IndicatorDataType DataType { get; set; } = IndicatorDataType.Number;
        public PeriodType PeriodType { get; set; } = PeriodType.Year;
        public DateTime? PeriodStartDate { get; set; }
        public int NotificationPeriod { get; set; } = 7; // Kaç gün önceden bildirim
        public bool IsAutomatic { get; set; } = false;
        public int? AssignedUserId { get; set; }
        public int? NotificationUserId { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }
        
        // Navigation Properties
        public virtual Department Department { get; set; } = null!;
        public virtual ApplicationUser? AssignedUser { get; set; }
        public virtual ApplicationUser? NotificationUser { get; set; }
        public virtual ApplicationUser? Creator { get; set; }
        public virtual ICollection<IndicatorRootValue> RootValues { get; set; } = new List<IndicatorRootValue>();
        public virtual ICollection<IndicatorData> Data { get; set; } = new List<IndicatorData>();
        public virtual ICollection<IndicatorHistoricalData> HistoricalData { get; set; } = new List<IndicatorHistoricalData>();
    }
}

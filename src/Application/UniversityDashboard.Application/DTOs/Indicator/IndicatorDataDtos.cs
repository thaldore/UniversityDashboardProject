using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Application.DTOs.Indicator
{
    public class IndicatorDataEntryDto
    {
        public int IndicatorId { get; set; }
        public string IndicatorCode { get; set; } = string.Empty;
        public string IndicatorName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsAutomatic { get; set; }
        public decimal? CurrentValue { get; set; }
        public List<HistoricalDataDto> HistoricalData { get; set; } = new();
        public DataStatus Status { get; set; }
        public string? Notes { get; set; }
        public int Year { get; set; }
        public int Period { get; set; }
    }

    public class SaveIndicatorDataRequest
    {
        public List<IndicatorDataSaveItem> DataItems { get; set; } = new();
        public string? GeneralNotes { get; set; }
        public bool IsDraft { get; set; } = true;
    }

    public class IndicatorDataSaveItem
    {
        public int IndicatorId { get; set; }
        public int Year { get; set; }
        public int Period { get; set; }
        public decimal? Value { get; set; }
        public DataStatus Status { get; set; }
        public string? Notes { get; set; }
    }

    public class DepartmentDto
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{FirstName} {LastName}";
        public string? Email { get; set; }
        public int? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
    }
}

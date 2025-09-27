using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Application.DTOs.Performance
{
    public class PerformancePeriodDto
    {
        public int PeriodId { get; set; }
        public string PeriodName { get; set; } = string.Empty;
        public DateTime PeriodStartDate { get; set; }
        public DateTime PeriodEndDate { get; set; }
        public DateTime TargetEntryStartDate { get; set; }
        public DateTime TargetEntryEndDate { get; set; }
        public DateTime TargetReviseStartDate { get; set; }
        public DateTime TargetReviseEndDate { get; set; }
        public DateTime ResultEntryStartDate { get; set; }
        public DateTime ResultEntryEndDate { get; set; }
        public bool IsActive { get; set; }
        public bool SendNotification { get; set; }
        public bool SendEmail { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedByUserName { get; set; } = string.Empty;
        public int AssignmentCount { get; set; }
        public int TargetCount { get; set; }
    }

    public class PerformancePeriodListDto
    {
        public int PeriodId { get; set; }
        public string PeriodName { get; set; } = string.Empty;
        public DateTime PeriodStartDate { get; set; }
        public DateTime PeriodEndDate { get; set; }
        public DateTime TargetEntryStartDate { get; set; }
        public DateTime TargetEntryEndDate { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int AssignmentCount { get; set; }
        public int TargetCount { get; set; }
    }

    public class PerformanceTargetDto
    {
        public int TargetId { get; set; }
        public string TargetName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int PeriodId { get; set; }
        public string PeriodName { get; set; } = string.Empty;
        public int? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public int? UserId { get; set; }
        public string? UserName { get; set; }
        public decimal TargetValue { get; set; }
        public decimal? ActualValue { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal Weight { get; set; }
        public TargetDirection Direction { get; set; }
        public string DirectionText { get; set; } = string.Empty;
        public TargetStatus Status { get; set; }
        public string StatusText { get; set; } = string.Empty;
        public string? RejectionReason { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string CreatedByUserName { get; set; } = string.Empty;
        public string? AssignedToUserName { get; set; }
        public string? AssignedToDepartmentName { get; set; }
        public decimal? CompletionRate { get; set; }
        public decimal? Score { get; set; }
        public string? LetterGrade { get; set; }
    }

    public class PerformanceTargetListDto
    {
        public int TargetId { get; set; }
        public string TargetName { get; set; } = string.Empty;
        public string PeriodName { get; set; } = string.Empty;
        public string? DepartmentName { get; set; }
        public string? UserName { get; set; }
        public decimal TargetValue { get; set; }
        public decimal? ActualValue { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal Weight { get; set; }
        public TargetDirection Direction { get; set; }
        public TargetStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal? CompletionRate { get; set; }
    }

    public class PerformanceTargetProgressDto
    {
        public int ProgressId { get; set; }
        public int TargetId { get; set; }
        public string TargetName { get; set; } = string.Empty;
        public decimal ProgressValue { get; set; }
        public DateTime ProgressDate { get; set; }
        public string? Notes { get; set; }
        public ProgressStatus Status { get; set; }
        public string StatusText { get; set; } = string.Empty;
        public string? RejectionReason { get; set; }
        public DateTime CreatedAt { get; set; }
        public string EnteredByUserName { get; set; } = string.Empty;
    }

    public class PerformanceScoringDto
    {
        public int ScoringId { get; set; }
        public int PeriodId { get; set; }
        public decimal MinValue { get; set; }
        public decimal? MaxValue { get; set; }
        public decimal Score { get; set; }
        public string LetterGrade { get; set; } = string.Empty;
        public bool IsForNegativeTarget { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class PerformanceAssignmentDto
    {
        public int AssignmentId { get; set; }
        public int PeriodId { get; set; }
        public int? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public int? UserId { get; set; }
        public string? UserName { get; set; }
        public AssignmentType AssignmentType { get; set; }
        public string AssignmentTypeText { get; set; } = string.Empty;
        public int? TargetEntryUserId { get; set; }
        public string? TargetEntryUserName { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class PerformanceContributionDto
    {
        public string TargetName { get; set; } = string.Empty;
        public decimal TargetValue { get; set; }
        public string Unit { get; set; } = string.Empty;
        public string ContributionCenter { get; set; } = string.Empty;
        public decimal ContributionAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal ContributionPercentage { get; set; }
    }
}

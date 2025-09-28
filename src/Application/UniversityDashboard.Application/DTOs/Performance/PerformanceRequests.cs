using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Application.DTOs.Performance
{
    public class CreatePerformancePeriodRequest
    {
        public string PeriodName { get; set; } = string.Empty;
        public DateTime PeriodStartDate { get; set; }
        public DateTime PeriodEndDate { get; set; }
        public DateTime TargetEntryStartDate { get; set; }
        public DateTime TargetEntryEndDate { get; set; }
        public DateTime TargetReviseStartDate { get; set; }
        public DateTime TargetReviseEndDate { get; set; }
        public DateTime ResultEntryStartDate { get; set; }
        public DateTime ResultEntryEndDate { get; set; }
        public bool IsActive { get; set; } = true;
        public bool SendNotification { get; set; } = true;
        public bool SendEmail { get; set; } = true;
        public List<CreatePerformanceScoringRequest> Scorings { get; set; } = new();
        public List<CreatePerformanceAssignmentRequest> Assignments { get; set; } = new();
    }

    public class UpdatePerformancePeriodRequest
    {
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
        public List<CreatePerformanceScoringRequest> Scorings { get; set; } = new();
    }

    public class CreatePerformanceTargetRequest
    {
        public string TargetName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int PeriodId { get; set; }
        public int? DepartmentId { get; set; }
        public int? UserId { get; set; }
        public decimal TargetValue { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal Weight { get; set; }
        public TargetDirection Direction { get; set; } = TargetDirection.Positive;
        public int? AssignedToUserId { get; set; }
        public int? AssignedToDepartmentId { get; set; }
    }

    public class UpdatePerformanceTargetRequest
    {
        public string TargetName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal TargetValue { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal Weight { get; set; }
        public TargetDirection Direction { get; set; }
        public int? AssignedToUserId { get; set; }
        public int? AssignedToDepartmentId { get; set; }
    }

    public class AssignPerformanceTargetRequest
    {
        public int TargetId { get; set; }
        public List<PerformanceTargetAssignmentItem> DepartmentAssignments { get; set; } = new();
        public List<PerformanceTargetAssignmentItem> UserAssignments { get; set; } = new();
    }

    public class PerformanceTargetAssignmentItem
    {
        public int? DepartmentId { get; set; }
        public int? UserId { get; set; }
        public decimal TargetValue { get; set; }
        public decimal Weight { get; set; }
        public decimal CurrentTotalWeight { get; set; }
    }

    public class CreatePerformanceTargetProgressRequest
    {
        public int TargetId { get; set; }
        public decimal ProgressValue { get; set; }
        public DateTime ProgressDate { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdatePerformanceTargetProgressRequest
    {
        public decimal ProgressValue { get; set; }
        public DateTime ProgressDate { get; set; }
        public string? Notes { get; set; }
    }

    public class CreatePerformanceScoringRequest
    {
        public decimal MinValue { get; set; }
        public decimal? MaxValue { get; set; }
        public decimal Score { get; set; }
        public string LetterGrade { get; set; } = string.Empty;
        public bool IsForNegativeTarget { get; set; } = false;
        public int DisplayOrder { get; set; } = 1;
    }

    public class CreatePerformanceAssignmentRequest
    {
        public AssignmentType AssignmentType { get; set; }
        public int? DepartmentId { get; set; }
        public int? UserId { get; set; }
        public string? TargetEntryRole { get; set; } = "Manager"; // Varsayılan olarak Manager
        public string? ResultEntryRole { get; set; } = "Manager"; // Varsayılan olarak Manager
    }

    public class ApproveRejectTargetRequest
    {
        public bool IsApproved { get; set; }
        public string? Reason { get; set; }
    }

    public class ApproveRejectProgressRequest
    {
        public bool IsApproved { get; set; }
        public string? Reason { get; set; }
    }
}

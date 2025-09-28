using UniversityDashBoardProject.Application.DTOs.Performance;
using UniversityDashBoardProject.Application.DTOs.Indicator;

namespace UniversityDashBoardProject.Application.Interfaces
{
    public interface IPerformanceService
    {
        // Performance Period Methods
        Task<List<PerformancePeriodListDto>> GetPerformancePeriodsAsync();
        Task<PerformancePeriodDto?> GetPerformancePeriodByIdAsync(int periodId);
        Task<int> CreatePerformancePeriodAsync(CreatePerformancePeriodRequest request, int createdBy);
        Task<bool> UpdatePerformancePeriodAsync(int periodId, UpdatePerformancePeriodRequest request);
        Task<bool> DeletePerformancePeriodAsync(int periodId);
        Task<bool> TogglePerformancePeriodStatusAsync(int periodId, bool isActive);

        // Performance Target Methods
        Task<List<PerformanceTargetListDto>> GetPerformanceTargetsAsync(int? periodId = null, int? userId = null, int? departmentId = null);
        Task<PerformanceTargetDto?> GetPerformanceTargetByIdAsync(int targetId);
        Task<int> CreatePerformanceTargetAsync(CreatePerformanceTargetRequest request, int createdBy);
        Task<bool> UpdatePerformanceTargetAsync(int targetId, UpdatePerformanceTargetRequest request);
        Task<bool> DeletePerformanceTargetAsync(int targetId);
        Task<bool> AssignPerformanceTargetAsync(AssignPerformanceTargetRequest request);
        Task<bool> SubmitPerformanceTargetAsync(int targetId);
        Task<bool> ApproveRejectPerformanceTargetAsync(int targetId, ApproveRejectTargetRequest request);

        // Performance Target Progress Methods
        Task<List<PerformanceTargetProgressDto>> GetPerformanceTargetProgressesAsync(int targetId);
        Task<PerformanceTargetProgressDto?> GetPerformanceTargetProgressByIdAsync(int progressId);
        Task<int> CreatePerformanceTargetProgressAsync(CreatePerformanceTargetProgressRequest request, int enteredBy);
        Task<bool> UpdatePerformanceTargetProgressAsync(int progressId, UpdatePerformanceTargetProgressRequest request);
        Task<bool> DeletePerformanceTargetProgressAsync(int progressId);
        Task<bool> SubmitPerformanceTargetProgressAsync(int progressId);
        Task<bool> ApproveRejectPerformanceTargetProgressAsync(int progressId, ApproveRejectProgressRequest request);

        // Performance Scoring Methods
        Task<List<PerformanceScoringDto>> GetPerformanceScoringsAsync(int periodId);
        Task<bool> CreatePerformanceScoringAsync(int periodId, CreatePerformanceScoringRequest request);
        Task<bool> UpdatePerformanceScoringAsync(int scoringId, CreatePerformanceScoringRequest request);
        Task<bool> DeletePerformanceScoringAsync(int scoringId);

        // Performance Assignment Methods
        Task<List<PerformanceAssignmentDto>> GetPerformanceAssignmentsAsync(int periodId);
        Task<bool> CreatePerformanceAssignmentAsync(int periodId, CreatePerformanceAssignmentRequest request);
        Task<bool> DeletePerformanceAssignmentAsync(int assignmentId);

        // Performance Contribution Methods
        Task<List<PerformanceContributionDto>> GetPerformanceContributionsAsync(int targetId);

        // Utility Methods
        Task<List<DepartmentDto>> GetAvailableDepartmentsAsync();
        Task<List<UserDto>> GetAvailableUsersAsync();
        Task<List<UserDto>> GetUsersByDepartmentAsync(int departmentId);
        Task<decimal> CalculateTargetScoreAsync(int targetId, decimal actualValue);
        Task<decimal> CalculateTotalWeightAsync(int? departmentId = null, int? userId = null, int? periodId = null);
        
        // Authorization Methods
        Task<bool> CanUserCreateDepartmentTargetAsync(int userId, int periodId, int departmentId);
        Task<List<DepartmentDto>> GetUserAuthorizedDepartmentsAsync(int userId, int periodId);
    }
}

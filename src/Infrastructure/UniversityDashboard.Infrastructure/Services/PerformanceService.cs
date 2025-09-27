using Microsoft.EntityFrameworkCore;
using UniversityDashBoardProject.Application.DTOs.Performance;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Domain.Entities;
using UniversityDashBoardProject.Domain.Enums;
using UniversityDashBoardProject.Infrastructure.Persistence;

namespace UniversityDashBoardProject.Infrastructure.Services
{
    public class PerformanceService : IPerformanceService
    {
        private readonly ApplicationDbContext _context;

        public PerformanceService(ApplicationDbContext context)
        {
            _context = context;
        }

        #region Performance Period Methods

        public async Task<List<PerformancePeriodListDto>> GetPerformancePeriodsAsync()
        {
            var periods = await _context.PerformancePeriods
                .Include(p => p.CreatedByUser)
                .Include(p => p.PeriodAssignments)
                .Include(p => p.Targets)
                .Select(p => new PerformancePeriodListDto
                {
                    PeriodId = p.PeriodId,
                    PeriodName = p.PeriodName,
                    PeriodStartDate = p.PeriodStartDate,
                    PeriodEndDate = p.PeriodEndDate,
                    TargetEntryStartDate = p.TargetEntryStartDate,
                    TargetEntryEndDate = p.TargetEntryEndDate,
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt,
                    AssignmentCount = p.PeriodAssignments.Count,
                    TargetCount = p.Targets.Count
                })
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return periods;
        }

        public async Task<PerformancePeriodDto?> GetPerformancePeriodByIdAsync(int periodId)
        {
            var period = await _context.PerformancePeriods
                .Include(p => p.CreatedByUser)
                .Include(p => p.PeriodAssignments)
                    .ThenInclude(pa => pa.Department)
                .Include(p => p.PeriodAssignments)
                    .ThenInclude(pa => pa.User)
                .Include(p => p.Targets)
                .Include(p => p.Scorings)
                .FirstOrDefaultAsync(p => p.PeriodId == periodId);

            if (period == null) return null;

            return new PerformancePeriodDto
            {
                PeriodId = period.PeriodId,
                PeriodName = period.PeriodName,
                PeriodStartDate = period.PeriodStartDate,
                PeriodEndDate = period.PeriodEndDate,
                TargetEntryStartDate = period.TargetEntryStartDate,
                TargetEntryEndDate = period.TargetEntryEndDate,
                TargetReviseStartDate = period.TargetReviseStartDate,
                TargetReviseEndDate = period.TargetReviseEndDate,
                ResultEntryStartDate = period.ResultEntryStartDate,
                ResultEntryEndDate = period.ResultEntryEndDate,
                IsActive = period.IsActive,
                SendNotification = period.SendNotification,
                SendEmail = period.SendEmail,
                CreatedAt = period.CreatedAt,
                CreatedByUserName = $"{period.CreatedByUser.FirstName} {period.CreatedByUser.LastName}",
                AssignmentCount = period.PeriodAssignments.Count,
                TargetCount = period.Targets.Count
            };
        }

        public async Task<int> CreatePerformancePeriodAsync(CreatePerformancePeriodRequest request, int createdBy)
        {
            var period = new PerformancePeriod
            {
                PeriodName = request.PeriodName,
                PeriodStartDate = DateTime.SpecifyKind(request.PeriodStartDate, DateTimeKind.Utc),
                PeriodEndDate = DateTime.SpecifyKind(request.PeriodEndDate, DateTimeKind.Utc),
                TargetEntryStartDate = DateTime.SpecifyKind(request.TargetEntryStartDate, DateTimeKind.Utc),
                TargetEntryEndDate = DateTime.SpecifyKind(request.TargetEntryEndDate, DateTimeKind.Utc),
                TargetReviseStartDate = DateTime.SpecifyKind(request.TargetReviseStartDate, DateTimeKind.Utc),
                TargetReviseEndDate = DateTime.SpecifyKind(request.TargetReviseEndDate, DateTimeKind.Utc),
                ResultEntryStartDate = DateTime.SpecifyKind(request.ResultEntryStartDate, DateTimeKind.Utc),
                ResultEntryEndDate = DateTime.SpecifyKind(request.ResultEntryEndDate, DateTimeKind.Utc),
                IsActive = request.IsActive,
                SendNotification = request.SendNotification,
                SendEmail = request.SendEmail,
                CreatedBy = createdBy,
                CreatedAt = DateTime.UtcNow
            };

            _context.PerformancePeriods.Add(period);
            await _context.SaveChangesAsync();

            // Add scorings
            foreach (var scoringRequest in request.Scorings)
            {
                var scoring = new PerformanceScoring
                {
                    PeriodId = period.PeriodId,
                    MinValue = scoringRequest.MinValue,
                    MaxValue = scoringRequest.MaxValue,
                    Score = scoringRequest.Score,
                    LetterGrade = scoringRequest.LetterGrade,
                    IsForNegativeTarget = scoringRequest.IsForNegativeTarget,
                    DisplayOrder = scoringRequest.DisplayOrder,
                    CreatedAt = DateTime.UtcNow
                };
                _context.PerformanceScorings.Add(scoring);
            }

            // Add assignments
            foreach (var assignmentRequest in request.Assignments)
            {
                var assignment = new PerformancePeriodAssignment
                {
                    PeriodId = period.PeriodId,
                    DepartmentId = assignmentRequest.DepartmentId,
                    UserId = assignmentRequest.UserId,
                    AssignmentType = assignmentRequest.AssignmentType,
                    TargetEntryUserId = assignmentRequest.TargetEntryUserId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.PerformancePeriodAssignments.Add(assignment);
            }

            await _context.SaveChangesAsync();
            return period.PeriodId;
        }

        public async Task<bool> UpdatePerformancePeriodAsync(int periodId, UpdatePerformancePeriodRequest request)
        {
            var period = await _context.PerformancePeriods.FindAsync(periodId);
            if (period == null) return false;

            period.PeriodName = request.PeriodName;
            period.PeriodStartDate = DateTime.SpecifyKind(request.PeriodStartDate, DateTimeKind.Utc);
            period.PeriodEndDate = DateTime.SpecifyKind(request.PeriodEndDate, DateTimeKind.Utc);
            period.TargetEntryStartDate = DateTime.SpecifyKind(request.TargetEntryStartDate, DateTimeKind.Utc);
            period.TargetEntryEndDate = DateTime.SpecifyKind(request.TargetEntryEndDate, DateTimeKind.Utc);
            period.TargetReviseStartDate = DateTime.SpecifyKind(request.TargetReviseStartDate, DateTimeKind.Utc);
            period.TargetReviseEndDate = DateTime.SpecifyKind(request.TargetReviseEndDate, DateTimeKind.Utc);
            period.ResultEntryStartDate = DateTime.SpecifyKind(request.ResultEntryStartDate, DateTimeKind.Utc);
            period.ResultEntryEndDate = DateTime.SpecifyKind(request.ResultEntryEndDate, DateTimeKind.Utc);
            period.IsActive = request.IsActive;
            period.SendNotification = request.SendNotification;
            period.SendEmail = request.SendEmail;

            // Update scorings
            var existingScorings = await _context.PerformanceScorings
                .Where(s => s.PeriodId == periodId)
                .ToListAsync();

            _context.PerformanceScorings.RemoveRange(existingScorings);

            foreach (var scoringRequest in request.Scorings)
            {
                var scoring = new PerformanceScoring
                {
                    PeriodId = periodId,
                    MinValue = scoringRequest.MinValue,
                    MaxValue = scoringRequest.MaxValue,
                    Score = scoringRequest.Score,
                    LetterGrade = scoringRequest.LetterGrade,
                    IsForNegativeTarget = scoringRequest.IsForNegativeTarget,
                    DisplayOrder = scoringRequest.DisplayOrder,
                    CreatedAt = DateTime.UtcNow
                };
                _context.PerformanceScorings.Add(scoring);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePerformancePeriodAsync(int periodId)
        {
            var period = await _context.PerformancePeriods
                .Include(p => p.Targets)
                .Include(p => p.PeriodAssignments)
                .Include(p => p.Scorings)
                .FirstOrDefaultAsync(p => p.PeriodId == periodId);

            if (period == null) return false;

            // Check if period has targets
            if (period.Targets.Any())
            {
                throw new InvalidOperationException("Bu performans dönemine ait hedefler bulunduğu için silinemez.");
            }

            _context.PerformanceScorings.RemoveRange(period.Scorings);
            _context.PerformancePeriodAssignments.RemoveRange(period.PeriodAssignments);
            _context.PerformancePeriods.Remove(period);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> TogglePerformancePeriodStatusAsync(int periodId, bool isActive)
        {
            var period = await _context.PerformancePeriods.FindAsync(periodId);
            if (period == null) return false;

            period.IsActive = isActive;
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Performance Target Methods

        public async Task<List<PerformanceTargetListDto>> GetPerformanceTargetsAsync(int? periodId = null, int? userId = null, int? departmentId = null)
        {
            var query = _context.PerformanceTargets
                .Include(t => t.Period)
                .Include(t => t.Department)
                .Include(t => t.User)
                .Include(t => t.CreatedByUser)
                .AsQueryable();

            if (periodId.HasValue)
                query = query.Where(t => t.PeriodId == periodId.Value);

            if (userId.HasValue)
                query = query.Where(t => t.UserId == userId.Value || t.AssignedToUserId == userId.Value);

            if (departmentId.HasValue)
                query = query.Where(t => t.DepartmentId == departmentId.Value || t.AssignedToDepartmentId == departmentId.Value);

            var targets = await query
                .Select(t => new PerformanceTargetListDto
                {
                    TargetId = t.TargetId,
                    TargetName = t.TargetName,
                    PeriodName = t.Period.PeriodName,
                    DepartmentName = t.Department != null ? t.Department.DepartmentName : null,
                    UserName = t.User != null ? $"{t.User.FirstName} {t.User.LastName}" : null,
                    TargetValue = t.TargetValue,
                    ActualValue = t.ActualValue,
                    Unit = t.Unit,
                    Weight = t.Weight,
                    Direction = t.Direction,
                    Status = t.Status,
                    CreatedAt = t.CreatedAt,
                    CompletionRate = t.ActualValue.HasValue && t.TargetValue > 0 
                        ? (t.ActualValue.Value / t.TargetValue) * 100 
                        : null
                })
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return targets;
        }

        public async Task<PerformanceTargetDto?> GetPerformanceTargetByIdAsync(int targetId)
        {
            var target = await _context.PerformanceTargets
                .Include(t => t.Period)
                .Include(t => t.Department)
                .Include(t => t.User)
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .Include(t => t.AssignedToDepartment)
                .FirstOrDefaultAsync(t => t.TargetId == targetId);

            if (target == null) return null;

            var completionRate = target.ActualValue.HasValue && target.TargetValue > 0 
                ? (target.ActualValue.Value / target.TargetValue) * 100 
                : (decimal?)null;

            var score = await CalculateTargetScoreAsync(targetId, target.ActualValue ?? 0);

            return new PerformanceTargetDto
            {
                TargetId = target.TargetId,
                TargetName = target.TargetName,
                Description = target.Description,
                PeriodId = target.PeriodId,
                PeriodName = target.Period.PeriodName,
                DepartmentId = target.DepartmentId,
                DepartmentName = target.Department?.DepartmentName,
                UserId = target.UserId,
                UserName = target.User != null ? $"{target.User.FirstName} {target.User.LastName}" : null,
                TargetValue = target.TargetValue,
                ActualValue = target.ActualValue,
                Unit = target.Unit,
                Weight = target.Weight,
                Direction = target.Direction,
                DirectionText = target.Direction == TargetDirection.Positive ? "Pozitif" : "Negatif",
                Status = target.Status,
                StatusText = GetTargetStatusText(target.Status),
                RejectionReason = target.RejectionReason,
                CreatedAt = target.CreatedAt,
                UpdatedAt = target.UpdatedAt,
                CreatedByUserName = $"{target.CreatedByUser.FirstName} {target.CreatedByUser.LastName}",
                AssignedToUserName = target.AssignedToUser != null ? $"{target.AssignedToUser.FirstName} {target.AssignedToUser.LastName}" : null,
                AssignedToDepartmentName = target.AssignedToDepartment?.DepartmentName,
                CompletionRate = completionRate,
                Score = score,
                LetterGrade = await GetLetterGradeAsync(target.PeriodId, score, target.Direction)
            };
        }

        public async Task<int> CreatePerformanceTargetAsync(CreatePerformanceTargetRequest request, int createdBy)
        {
            var target = new PerformanceTarget
            {
                TargetName = request.TargetName,
                Description = request.Description,
                PeriodId = request.PeriodId,
                DepartmentId = request.DepartmentId,
                UserId = request.UserId,
                TargetValue = request.TargetValue,
                Unit = request.Unit,
                Weight = request.Weight,
                Direction = request.Direction,
                Status = TargetStatus.Draft,
                CreatedBy = createdBy,
                AssignedToUserId = request.AssignedToUserId,
                AssignedToDepartmentId = request.AssignedToDepartmentId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.PerformanceTargets.Add(target);
            await _context.SaveChangesAsync();
            return target.TargetId;
        }

        public async Task<bool> UpdatePerformanceTargetAsync(int targetId, UpdatePerformanceTargetRequest request)
        {
            var target = await _context.PerformanceTargets.FindAsync(targetId);
            if (target == null) return false;

            target.TargetName = request.TargetName;
            target.Description = request.Description;
            target.TargetValue = request.TargetValue;
            target.Unit = request.Unit;
            target.Weight = request.Weight;
            target.Direction = request.Direction;
            target.AssignedToUserId = request.AssignedToUserId;
            target.AssignedToDepartmentId = request.AssignedToDepartmentId;
            target.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePerformanceTargetAsync(int targetId)
        {
            var target = await _context.PerformanceTargets
                .Include(t => t.Progresses)
                .FirstOrDefaultAsync(t => t.TargetId == targetId);

            if (target == null) return false;

            _context.PerformanceTargetProgresses.RemoveRange(target.Progresses);
            _context.PerformanceTargets.Remove(target);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AssignPerformanceTargetAsync(AssignPerformanceTargetRequest request)
        {
            var target = await _context.PerformanceTargets.FindAsync(request.TargetId);
            if (target == null) return false;

            // Remove existing assignments for this target
            var existingAssignments = await _context.PerformanceTargets
                .Where(t => t.TargetId == request.TargetId)
                .ToListAsync();

            foreach (var assignment in existingAssignments)
            {
                assignment.AssignedToUserId = null;
                assignment.AssignedToDepartmentId = null;
            }

            // Create new assignments
            foreach (var deptAssignment in request.DepartmentAssignments)
            {
                var newTarget = new PerformanceTarget
                {
                    TargetName = target.TargetName,
                    Description = target.Description,
                    PeriodId = target.PeriodId,
                    DepartmentId = deptAssignment.DepartmentId,
                    TargetValue = deptAssignment.TargetValue,
                    Unit = target.Unit,
                    Weight = deptAssignment.Weight,
                    Direction = target.Direction,
                    Status = TargetStatus.Draft,
                    CreatedBy = target.CreatedBy,
                    AssignedToDepartmentId = deptAssignment.DepartmentId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.PerformanceTargets.Add(newTarget);
            }

            foreach (var userAssignment in request.UserAssignments)
            {
                var newTarget = new PerformanceTarget
                {
                    TargetName = target.TargetName,
                    Description = target.Description,
                    PeriodId = target.PeriodId,
                    UserId = userAssignment.UserId,
                    TargetValue = userAssignment.TargetValue,
                    Unit = target.Unit,
                    Weight = userAssignment.Weight,
                    Direction = target.Direction,
                    Status = TargetStatus.Draft,
                    CreatedBy = target.CreatedBy,
                    AssignedToUserId = userAssignment.UserId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.PerformanceTargets.Add(newTarget);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SubmitPerformanceTargetAsync(int targetId)
        {
            var target = await _context.PerformanceTargets.FindAsync(targetId);
            if (target == null) return false;

            target.Status = TargetStatus.Submitted;
            target.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ApproveRejectPerformanceTargetAsync(int targetId, ApproveRejectTargetRequest request)
        {
            var target = await _context.PerformanceTargets.FindAsync(targetId);
            if (target == null) return false;

            if (request.IsApproved)
            {
                target.Status = TargetStatus.Approved;
                target.RejectionReason = null;
            }
            else
            {
                target.Status = TargetStatus.Rejected;
                target.RejectionReason = request.Reason;
            }

            target.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Performance Target Progress Methods

        public async Task<List<PerformanceTargetProgressDto>> GetPerformanceTargetProgressesAsync(int targetId)
        {
            var progresses = await _context.PerformanceTargetProgresses
                .Include(p => p.EnteredByUser)
                .Where(p => p.TargetId == targetId)
                .Select(p => new PerformanceTargetProgressDto
                {
                    ProgressId = p.ProgressId,
                    TargetId = p.TargetId,
                    TargetName = p.Target.TargetName,
                    ProgressValue = p.ProgressValue,
                    ProgressDate = p.ProgressDate,
                    Notes = p.Notes,
                    Status = p.Status,
                    StatusText = GetProgressStatusText(p.Status),
                    RejectionReason = p.RejectionReason,
                    CreatedAt = p.CreatedAt,
                    EnteredByUserName = $"{p.EnteredByUser.FirstName} {p.EnteredByUser.LastName}"
                })
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return progresses;
        }

        public async Task<PerformanceTargetProgressDto?> GetPerformanceTargetProgressByIdAsync(int progressId)
        {
            var progress = await _context.PerformanceTargetProgresses
                .Include(p => p.EnteredByUser)
                .Include(p => p.Target)
                .FirstOrDefaultAsync(p => p.ProgressId == progressId);

            if (progress == null) return null;

            return new PerformanceTargetProgressDto
            {
                ProgressId = progress.ProgressId,
                TargetId = progress.TargetId,
                TargetName = progress.Target.TargetName,
                ProgressValue = progress.ProgressValue,
                ProgressDate = progress.ProgressDate,
                Notes = progress.Notes,
                Status = progress.Status,
                StatusText = GetProgressStatusText(progress.Status),
                RejectionReason = progress.RejectionReason,
                CreatedAt = progress.CreatedAt,
                EnteredByUserName = $"{progress.EnteredByUser.FirstName} {progress.EnteredByUser.LastName}"
            };
        }

        public async Task<int> CreatePerformanceTargetProgressAsync(CreatePerformanceTargetProgressRequest request, int enteredBy)
        {
            var progress = new PerformanceTargetProgress
            {
                TargetId = request.TargetId,
                ProgressValue = request.ProgressValue,
                ProgressDate = DateTime.SpecifyKind(request.ProgressDate, DateTimeKind.Utc),
                Notes = request.Notes,
                Status = ProgressStatus.Draft,
                EnteredBy = enteredBy,
                CreatedAt = DateTime.UtcNow
            };

            _context.PerformanceTargetProgresses.Add(progress);
            await _context.SaveChangesAsync();
            return progress.ProgressId;
        }

        public async Task<bool> UpdatePerformanceTargetProgressAsync(int progressId, UpdatePerformanceTargetProgressRequest request)
        {
            var progress = await _context.PerformanceTargetProgresses.FindAsync(progressId);
            if (progress == null) return false;

            progress.ProgressValue = request.ProgressValue;
            progress.ProgressDate = DateTime.SpecifyKind(request.ProgressDate, DateTimeKind.Utc);
            progress.Notes = request.Notes;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePerformanceTargetProgressAsync(int progressId)
        {
            var progress = await _context.PerformanceTargetProgresses.FindAsync(progressId);
            if (progress == null) return false;

            _context.PerformanceTargetProgresses.Remove(progress);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SubmitPerformanceTargetProgressAsync(int progressId)
        {
            var progress = await _context.PerformanceTargetProgresses.FindAsync(progressId);
            if (progress == null) return false;

            progress.Status = ProgressStatus.Submitted;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ApproveRejectPerformanceTargetProgressAsync(int progressId, ApproveRejectProgressRequest request)
        {
            var progress = await _context.PerformanceTargetProgresses.FindAsync(progressId);
            if (progress == null) return false;

            if (request.IsApproved)
            {
                progress.Status = ProgressStatus.Approved;
                progress.RejectionReason = null;
            }
            else
            {
                progress.Status = ProgressStatus.Rejected;
                progress.RejectionReason = request.Reason;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Performance Scoring Methods

        public async Task<List<PerformanceScoringDto>> GetPerformanceScoringsAsync(int periodId)
        {
            var scorings = await _context.PerformanceScorings
                .Where(s => s.PeriodId == periodId)
                .OrderBy(s => s.DisplayOrder)
                .Select(s => new PerformanceScoringDto
                {
                    ScoringId = s.ScoringId,
                    PeriodId = s.PeriodId,
                    MinValue = s.MinValue,
                    MaxValue = s.MaxValue,
                    Score = s.Score,
                    LetterGrade = s.LetterGrade,
                    IsForNegativeTarget = s.IsForNegativeTarget,
                    DisplayOrder = s.DisplayOrder
                })
                .ToListAsync();

            return scorings;
        }

        public async Task<bool> CreatePerformanceScoringAsync(int periodId, CreatePerformanceScoringRequest request)
        {
            var scoring = new PerformanceScoring
            {
                PeriodId = periodId,
                MinValue = request.MinValue,
                MaxValue = request.MaxValue,
                Score = request.Score,
                LetterGrade = request.LetterGrade,
                IsForNegativeTarget = request.IsForNegativeTarget,
                DisplayOrder = request.DisplayOrder,
                CreatedAt = DateTime.UtcNow
            };

            _context.PerformanceScorings.Add(scoring);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdatePerformanceScoringAsync(int scoringId, CreatePerformanceScoringRequest request)
        {
            var scoring = await _context.PerformanceScorings.FindAsync(scoringId);
            if (scoring == null) return false;

            scoring.MinValue = request.MinValue;
            scoring.MaxValue = request.MaxValue;
            scoring.Score = request.Score;
            scoring.LetterGrade = request.LetterGrade;
            scoring.IsForNegativeTarget = request.IsForNegativeTarget;
            scoring.DisplayOrder = request.DisplayOrder;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePerformanceScoringAsync(int scoringId)
        {
            var scoring = await _context.PerformanceScorings.FindAsync(scoringId);
            if (scoring == null) return false;

            _context.PerformanceScorings.Remove(scoring);
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Performance Assignment Methods

        public async Task<List<PerformanceAssignmentDto>> GetPerformanceAssignmentsAsync(int periodId)
        {
            var assignments = await _context.PerformancePeriodAssignments
                .Include(a => a.Department)
                .Include(a => a.User)
                .Include(a => a.TargetEntryUser)
                .Where(a => a.PeriodId == periodId)
                .Select(a => new PerformanceAssignmentDto
                {
                    AssignmentId = a.AssignmentId,
                    PeriodId = a.PeriodId,
                    DepartmentId = a.DepartmentId,
                    DepartmentName = a.Department != null ? a.Department.DepartmentName : null,
                    UserId = a.UserId,
                    UserName = a.User != null ? $"{a.User.FirstName} {a.User.LastName}" : null,
                    AssignmentType = a.AssignmentType,
                    AssignmentTypeText = a.AssignmentType == AssignmentType.Department ? "Departman" : "Kullanıcı",
                    TargetEntryUserId = a.TargetEntryUserId,
                    TargetEntryUserName = a.TargetEntryUser != null ? $"{a.TargetEntryUser.FirstName} {a.TargetEntryUser.LastName}" : null,
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();

            return assignments;
        }

        public async Task<bool> CreatePerformanceAssignmentAsync(int periodId, CreatePerformanceAssignmentRequest request)
        {
            var assignment = new PerformancePeriodAssignment
            {
                PeriodId = periodId,
                DepartmentId = request.DepartmentId,
                UserId = request.UserId,
                AssignmentType = request.AssignmentType,
                TargetEntryUserId = request.TargetEntryUserId,
                CreatedAt = DateTime.UtcNow
            };

            _context.PerformancePeriodAssignments.Add(assignment);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePerformanceAssignmentAsync(int assignmentId)
        {
            var assignment = await _context.PerformancePeriodAssignments.FindAsync(assignmentId);
            if (assignment == null) return false;

            _context.PerformancePeriodAssignments.Remove(assignment);
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Performance Contribution Methods

        public async Task<List<PerformanceContributionDto>> GetPerformanceContributionsAsync(int targetId)
        {
            var contributions = await _context.PerformanceTargets
                .Include(t => t.Department)
                .Include(t => t.User)
                .Where(t => t.TargetName == _context.PerformanceTargets
                    .Where(tt => tt.TargetId == targetId)
                    .Select(tt => tt.TargetName)
                    .FirstOrDefault())
                .Select(t => new PerformanceContributionDto
                {
                    TargetName = t.TargetName,
                    TargetValue = t.TargetValue,
                    Unit = t.Unit,
                    ContributionCenter = t.Department != null ? t.Department.DepartmentName : 
                                      t.User != null ? $"{t.User.FirstName} {t.User.LastName}" : "Bilinmiyor",
                    ContributionAmount = t.ActualValue ?? 0,
                    TotalAmount = 0, // Will be calculated
                    ContributionPercentage = 0 // Will be calculated
                })
                .ToListAsync();

            var totalAmount = contributions.Sum(c => c.ContributionAmount);
            
            foreach (var contribution in contributions)
            {
                contribution.TotalAmount = totalAmount;
                contribution.ContributionPercentage = totalAmount > 0 ? (contribution.ContributionAmount / totalAmount) * 100 : 0;
            }

            return contributions;
        }

        #endregion

        #region Utility Methods

        public async Task<List<DepartmentDto>> GetAvailableDepartmentsAsync()
        {
            var departments = await _context.Departments
                .Where(d => d.IsActive)
                .Select(d => new DepartmentDto
                {
                    DepartmentId = d.DepartmentId,
                    DepartmentName = d.DepartmentName,
                    Description = null,
                    IsActive = d.IsActive
                })
                .ToListAsync();

            return departments;
        }

        public async Task<List<UserDto>> GetAvailableUsersAsync()
        {
            var users = await _context.Users
                .Include(u => u.Department)
                .Where(u => u.IsActive)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    DepartmentId = u.DepartmentId,
                    DepartmentName = u.Department != null ? u.Department.DepartmentName : null
                })
                .ToListAsync();

            return users;
        }

        public async Task<List<UserDto>> GetUsersByDepartmentAsync(int departmentId)
        {
            var users = await _context.Users
                .Include(u => u.Department)
                .Where(u => u.DepartmentId == departmentId && u.IsActive)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    DepartmentId = u.DepartmentId,
                    DepartmentName = u.Department != null ? u.Department.DepartmentName : null
                })
                .ToListAsync();

            return users;
        }

        public async Task<decimal> CalculateTargetScoreAsync(int targetId, decimal actualValue)
        {
            var target = await _context.PerformanceTargets
                .Include(t => t.Period)
                .FirstOrDefaultAsync(t => t.TargetId == targetId);

            if (target == null) return 0;

            var completionRate = target.TargetValue > 0 ? (actualValue / target.TargetValue) * 100 : 0;

            var scoring = await _context.PerformanceScorings
                .Where(s => s.PeriodId == target.PeriodId && s.IsForNegativeTarget == (target.Direction == TargetDirection.Negative))
                .Where(s => completionRate >= s.MinValue && (s.MaxValue == null || completionRate <= s.MaxValue))
                .OrderBy(s => s.DisplayOrder)
                .FirstOrDefaultAsync();

            return scoring?.Score ?? 0;
        }

        public async Task<decimal> CalculateTotalWeightAsync(int? departmentId = null, int? userId = null, int? periodId = null)
        {
            var query = _context.PerformanceTargets.AsQueryable();

            if (departmentId.HasValue)
                query = query.Where(t => t.DepartmentId == departmentId.Value || t.AssignedToDepartmentId == departmentId.Value);

            if (userId.HasValue)
                query = query.Where(t => t.UserId == userId.Value || t.AssignedToUserId == userId.Value);

            if (periodId.HasValue)
                query = query.Where(t => t.PeriodId == periodId.Value);

            return await query.SumAsync(t => t.Weight);
        }

        #endregion

        #region Helper Methods

        private string GetTargetStatusText(TargetStatus status)
        {
            return status switch
            {
                TargetStatus.Draft => "Taslak",
                TargetStatus.Submitted => "Gönderildi",
                TargetStatus.Approved => "Onaylandı",
                TargetStatus.Rejected => "Reddedildi",
                TargetStatus.ProgressDraft => "Gerçekleşme Taslak",
                TargetStatus.ProgressSubmitted => "Gerçekleşme Gönderildi",
                TargetStatus.ProgressApproved => "Gerçekleşme Onaylandı",
                TargetStatus.ProgressRejected => "Gerçekleşme Reddedildi",
                _ => "Bilinmiyor"
            };
        }

        private string GetProgressStatusText(ProgressStatus status)
        {
            return status switch
            {
                ProgressStatus.Draft => "Taslak",
                ProgressStatus.Submitted => "Gönderildi",
                ProgressStatus.Approved => "Onaylandı",
                ProgressStatus.Rejected => "Reddedildi",
                _ => "Bilinmiyor"
            };
        }

        private async Task<string> GetLetterGradeAsync(int periodId, decimal score, TargetDirection direction)
        {
            var scoring = await _context.PerformanceScorings
                .Where(s => s.PeriodId == periodId && s.IsForNegativeTarget == (direction == TargetDirection.Negative))
                .Where(s => score >= s.Score)
                .OrderByDescending(s => s.Score)
                .FirstOrDefaultAsync();

            return scoring?.LetterGrade ?? "";
        }

        #endregion
    }
}

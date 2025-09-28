using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;
using UniversityDashBoardProject.Application.Features.Performance.Commands;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using System.Security.Claims;

namespace UniversityDashBoardProject.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PerformanceController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IPerformanceService _performanceService;

        public PerformanceController(IMediator mediator, IPerformanceService performanceService)
        {
            _mediator = mediator;
            _performanceService = performanceService;
        }

        #region Performance Period Endpoints

        [HttpGet("periods")]
        public async Task<ActionResult<List<PerformancePeriodListDto>>> GetPerformancePeriods()
        {
            try
            {
                var result = await _mediator.Send(new GetPerformancePeriodsQuery());
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans dönemleri getirilirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpGet("periods/{id}")]
        public async Task<ActionResult<PerformancePeriodDto>> GetPerformancePeriod(int id)
        {
            try
            {
                var result = await _mediator.Send(new GetPerformancePeriodByIdQuery { PeriodId = id });
                if (result == null)
                    return NotFound(new { message = "Performans dönemi bulunamadı." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans dönemi getirilirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpPost("periods")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<int>> CreatePerformancePeriod([FromBody] CreatePerformancePeriodRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _mediator.Send(new CreatePerformancePeriodCommand 
                { 
                    Request = request, 
                    CreatedBy = userId 
                });
                return CreatedAtAction(nameof(GetPerformancePeriod), new { id = result }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans dönemi oluşturulurken hata oluştu.", error = ex.Message });
            }
        }

        [HttpPut("periods/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> UpdatePerformancePeriod(int id, [FromBody] UpdatePerformancePeriodRequest request)
        {
            try
            {
                var result = await _mediator.Send(new UpdatePerformancePeriodCommand 
                { 
                    PeriodId = id, 
                    Request = request 
                });
                
                if (!result)
                    return NotFound(new { message = "Performans dönemi bulunamadı." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans dönemi güncellenirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpDelete("periods/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> DeletePerformancePeriod(int id)
        {
            try
            {
                var result = await _mediator.Send(new DeletePerformancePeriodCommand { PeriodId = id });
                
                if (!result)
                    return NotFound(new { message = "Performans dönemi bulunamadı." });

                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans dönemi silinirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpPatch("periods/{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> TogglePerformancePeriodStatus(int id, [FromBody] bool isActive)
        {
            try
            {
                var result = await _performanceService.TogglePerformancePeriodStatusAsync(id, isActive);
                
                if (!result)
                    return NotFound(new { message = "Performans dönemi bulunamadı." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans dönemi durumu güncellenirken hata oluştu.", error = ex.Message });
            }
        }

        #endregion

        #region Performance Target Endpoints

        [HttpGet("targets")]
        public async Task<ActionResult<List<PerformanceTargetListDto>>> GetPerformanceTargets(
            [FromQuery] int? periodId = null,
            [FromQuery] int? userId = null,
            [FromQuery] int? departmentId = null)
        {
            try
            {
                var result = await _mediator.Send(new GetPerformanceTargetsQuery 
                { 
                    PeriodId = periodId, 
                    UserId = userId, 
                    DepartmentId = departmentId 
                });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans hedefleri getirilirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpGet("targets/{id}")]
        public async Task<ActionResult<PerformanceTargetDto>> GetPerformanceTarget(int id)
        {
            try
            {
                var result = await _mediator.Send(new GetPerformanceTargetByIdQuery { TargetId = id });
                if (result == null)
                    return NotFound(new { message = "Performans hedefi bulunamadı." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans hedefi getirilirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpPost("targets")]
        [Authorize] // Tüm yetkili kullanıcılar için
        public async Task<ActionResult<int>> CreatePerformanceTarget([FromBody] CreatePerformanceTargetRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _mediator.Send(new CreatePerformanceTargetCommand 
                { 
                    Request = request, 
                    CreatedBy = userId 
                });
                return CreatedAtAction(nameof(GetPerformanceTarget), new { id = result }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans hedefi oluşturulurken hata oluştu.", error = ex.Message });
            }
        }

        [HttpPut("targets/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> UpdatePerformanceTarget(int id, [FromBody] UpdatePerformanceTargetRequest request)
        {
            try
            {
                var result = await _mediator.Send(new UpdatePerformanceTargetCommand 
                { 
                    TargetId = id, 
                    Request = request 
                });
                
                if (!result)
                    return NotFound(new { message = "Performans hedefi bulunamadı." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans hedefi güncellenirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpDelete("targets/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> DeletePerformanceTarget(int id)
        {
            try
            {
                var result = await _mediator.Send(new DeletePerformanceTargetCommand { TargetId = id });
                
                if (!result)
                    return NotFound(new { message = "Performans hedefi bulunamadı." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans hedefi silinirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpPost("targets/assign")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> AssignPerformanceTarget([FromBody] AssignPerformanceTargetRequest request)
        {
            try
            {
                var result = await _mediator.Send(new AssignPerformanceTargetCommand { Request = request });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans hedefi atanırken hata oluştu.", error = ex.Message });
            }
        }

        [HttpPost("targets/{id}/submit")]
        public async Task<ActionResult<bool>> SubmitPerformanceTarget(int id)
        {
            try
            {
                var result = await _mediator.Send(new SubmitPerformanceTargetCommand { TargetId = id });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans hedefi gönderilirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpPost("targets/{id}/approve-reject")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> ApproveRejectPerformanceTarget(int id, [FromBody] ApproveRejectTargetRequest request)
        {
            try
            {
                var result = await _mediator.Send(new ApproveRejectPerformanceTargetCommand 
                { 
                    TargetId = id, 
                    Request = request 
                });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans hedefi onay/red işlemi sırasında hata oluştu.", error = ex.Message });
            }
        }

        #endregion

        #region Performance Target Progress Endpoints

        [HttpGet("targets/{targetId}/progresses")]
        public async Task<ActionResult<List<PerformanceTargetProgressDto>>> GetPerformanceTargetProgresses(int targetId)
        {
            try
            {
                var result = await _mediator.Send(new GetPerformanceTargetProgressesQuery { TargetId = targetId });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans hedef ilerlemeleri getirilirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpGet("progresses/{id}")]
        public async Task<ActionResult<PerformanceTargetProgressDto>> GetPerformanceTargetProgress(int id)
        {
            try
            {
                var result = await _mediator.Send(new GetPerformanceTargetProgressByIdQuery { ProgressId = id });
                if (result == null)
                    return NotFound(new { message = "Performans hedef ilerlemesi bulunamadı." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans hedef ilerlemesi getirilirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpPost("progresses")]
        public async Task<ActionResult<int>> CreatePerformanceTargetProgress([FromBody] CreatePerformanceTargetProgressRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _mediator.Send(new CreatePerformanceTargetProgressCommand 
                { 
                    Request = request, 
                    EnteredBy = userId 
                });
                return CreatedAtAction(nameof(GetPerformanceTargetProgress), new { id = result }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans hedef ilerlemesi oluşturulurken hata oluştu.", error = ex.Message });
            }
        }

        [HttpPut("progresses/{id}")]
        public async Task<ActionResult<bool>> UpdatePerformanceTargetProgress(int id, [FromBody] UpdatePerformanceTargetProgressRequest request)
        {
            try
            {
                var result = await _mediator.Send(new UpdatePerformanceTargetProgressCommand 
                { 
                    ProgressId = id, 
                    Request = request 
                });
                
                if (!result)
                    return NotFound(new { message = "Performans hedef ilerlemesi bulunamadı." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans hedef ilerlemesi güncellenirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpDelete("progresses/{id}")]
        public async Task<ActionResult<bool>> DeletePerformanceTargetProgress(int id)
        {
            try
            {
                var result = await _mediator.Send(new DeletePerformanceTargetProgressCommand { ProgressId = id });
                
                if (!result)
                    return NotFound(new { message = "Performans hedef ilerlemesi bulunamadı." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans hedef ilerlemesi silinirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpPost("progresses/{id}/submit")]
        public async Task<ActionResult<bool>> SubmitPerformanceTargetProgress(int id)
        {
            try
            {
                var result = await _mediator.Send(new SubmitPerformanceTargetProgressCommand { ProgressId = id });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans hedef ilerlemesi gönderilirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpPost("progresses/{id}/approve-reject")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> ApproveRejectPerformanceTargetProgress(int id, [FromBody] ApproveRejectProgressRequest request)
        {
            try
            {
                var result = await _mediator.Send(new ApproveRejectPerformanceTargetProgressCommand 
                { 
                    ProgressId = id, 
                    Request = request 
                });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans hedef ilerlemesi onay/red işlemi sırasında hata oluştu.", error = ex.Message });
            }
        }

        #endregion

        #region Performance Scoring Endpoints

        [HttpGet("periods/{periodId}/scorings")]
        public async Task<ActionResult<List<PerformanceScoringDto>>> GetPerformanceScorings(int periodId)
        {
            try
            {
                var result = await _mediator.Send(new GetPerformanceScoringsQuery { PeriodId = periodId });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans puanlamaları getirilirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpPost("periods/{periodId}/scorings")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> CreatePerformanceScoring(int periodId, [FromBody] CreatePerformanceScoringRequest request)
        {
            try
            {
                var result = await _performanceService.CreatePerformanceScoringAsync(periodId, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans puanlaması oluşturulurken hata oluştu.", error = ex.Message });
            }
        }

        [HttpPut("scorings/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> UpdatePerformanceScoring(int id, [FromBody] CreatePerformanceScoringRequest request)
        {
            try
            {
                var result = await _performanceService.UpdatePerformanceScoringAsync(id, request);
                
                if (!result)
                    return NotFound(new { message = "Performans puanlaması bulunamadı." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans puanlaması güncellenirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpDelete("scorings/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> DeletePerformanceScoring(int id)
        {
            try
            {
                var result = await _performanceService.DeletePerformanceScoringAsync(id);
                
                if (!result)
                    return NotFound(new { message = "Performans puanlaması bulunamadı." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans puanlaması silinirken hata oluştu.", error = ex.Message });
            }
        }

        #endregion

        #region Performance Assignment Endpoints

        [HttpGet("periods/{periodId}/assignments")]
        public async Task<ActionResult<List<PerformanceAssignmentDto>>> GetPerformanceAssignments(int periodId)
        {
            try
            {
                var result = await _mediator.Send(new GetPerformanceAssignmentsQuery { PeriodId = periodId });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans atamaları getirilirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpPost("periods/{periodId}/assignments")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> CreatePerformanceAssignment(int periodId, [FromBody] CreatePerformanceAssignmentRequest request)
        {
            try
            {
                var result = await _performanceService.CreatePerformanceAssignmentAsync(periodId, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans ataması oluşturulurken hata oluştu.", error = ex.Message });
            }
        }

        [HttpDelete("assignments/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> DeletePerformanceAssignment(int id)
        {
            try
            {
                var result = await _performanceService.DeletePerformanceAssignmentAsync(id);
                
                if (!result)
                    return NotFound(new { message = "Performans ataması bulunamadı." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans ataması silinirken hata oluştu.", error = ex.Message });
            }
        }

        #endregion

        #region Performance Contribution Endpoints

        [HttpGet("targets/{targetId}/contributions")]
        public async Task<ActionResult<List<PerformanceContributionDto>>> GetPerformanceContributions(int targetId)
        {
            try
            {
                var result = await _mediator.Send(new GetPerformanceContributionsQuery { TargetId = targetId });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Performans katkıları getirilirken hata oluştu.", error = ex.Message });
            }
        }

        #endregion

        #region Utility Endpoints

        [HttpGet("departments")]
        public async Task<ActionResult<List<DepartmentDto>>> GetAvailableDepartments()
        {
            try
            {
                var result = await _mediator.Send(new GetAvailableDepartmentsQuery());
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Departmanlar getirilirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpGet("users")]
        public async Task<ActionResult<List<UserDto>>> GetAvailableUsers()
        {
            try
            {
                var result = await _mediator.Send(new GetAvailableUsersQuery());
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kullanıcılar getirilirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpGet("users/department/{departmentId}")]
        public async Task<ActionResult<List<UserDto>>> GetUsersByDepartment(int departmentId)
        {
            try
            {
                var result = await _mediator.Send(new GetUsersByDepartmentQuery { DepartmentId = departmentId });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Departman kullanıcıları getirilirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpGet("targets/{targetId}/score")]
        public async Task<ActionResult<decimal>> CalculateTargetScore(int targetId, [FromQuery] decimal actualValue)
        {
            try
            {
                var result = await _performanceService.CalculateTargetScoreAsync(targetId, actualValue);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hedef puanı hesaplanırken hata oluştu.", error = ex.Message });
            }
        }

        [HttpGet("weight/total")]
        public async Task<ActionResult<decimal>> GetTotalWeight(
            [FromQuery] int? departmentId = null,
            [FromQuery] int? userId = null,
            [FromQuery] int? periodId = null)
        {
            try
            {
                var result = await _performanceService.CalculateTotalWeightAsync(departmentId, userId, periodId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Toplam ağırlık hesaplanırken hata oluştu.", error = ex.Message });
            }
        }

        [HttpGet("user/{userId}/authorized-departments")]
        public async Task<ActionResult<List<DepartmentDto>>> GetUserAuthorizedDepartments(int userId, [FromQuery] int periodId)
        {
            try
            {
                var result = await _performanceService.GetUserAuthorizedDepartmentsAsync(userId, periodId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kullanıcı yetkili departmanları getirilirken hata oluştu.", error = ex.Message });
            }
        }

        [HttpGet("user/{userId}/can-create-department-target")]
        public async Task<ActionResult<bool>> CanUserCreateDepartmentTarget(int userId, [FromQuery] int periodId, [FromQuery] int departmentId)
        {
            try
            {
                var result = await _performanceService.CanUserCreateDepartmentTargetAsync(userId, periodId, departmentId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kullanıcı yetki kontrolü yapılırken hata oluştu.", error = ex.Message });
            }
        }

        #endregion

        #region Helper Methods

        private int GetCurrentUserId()
        {
            // JWT token'da nameid claim'i kullanıcı ID'sini içerir
            var userIdClaim = User.FindFirst("nameid");
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                return userId;
            }
            
            // Alternatif olarak ClaimTypes.NameIdentifier'ı da dene
            var nameIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (nameIdClaim != null && int.TryParse(nameIdClaim.Value, out int nameId))
            {
                return nameId;
            }
            
            // Debug için tüm claim'leri logla
            var allClaims = User.Claims.Select(c => $"{c.Type}: {c.Value}").ToList();
            var claimsString = string.Join(", ", allClaims);
            throw new UnauthorizedAccessException($"Kullanıcı kimliği bulunamadı. Mevcut claim'ler: {claimsString}");
        }

        #endregion
    }
}

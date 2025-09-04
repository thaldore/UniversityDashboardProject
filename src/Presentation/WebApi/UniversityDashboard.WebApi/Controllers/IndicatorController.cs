using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using UniversityDashBoardProject.Application.Features.Indicators.Commands;
using UniversityDashBoardProject.Application.Features.Indicators.Queries;
using System.Security.Claims;

namespace UniversityDashBoardProject.Presentation.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class IndicatorController : ControllerBase
    {
        private readonly IMediator _mediator;

        public IndicatorController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Yeni gösterge oluşturur (Sadece Admin)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateIndicator([FromBody] CreateIndicatorRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var command = new CreateIndicatorCommand 
                { 
                    Request = request,
                    CreatedBy = userId
                };
                var result = await _mediator.Send(command);
                return Ok(new { IndicatorId = result, Message = "Gösterge başarıyla oluşturuldu." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Gösterge oluşturulurken hata oluştu.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Tüm göstergeleri listeler (Sadece Admin)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetIndicatorList()
        {
            try
            {
                var query = new GetIndicatorListQuery();
                var result = await _mediator.Send(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Göstergeler listelenirken hata oluştu.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Belirtilen ID'ye sahip göstergeyi getirir
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetIndicator(int id)
        {
            try
            {
                var query = new GetIndicatorByIdQuery { Id = id };
                var result = await _mediator.Send(query);
                
                if (result == null)
                    return NotFound(new { Message = "Gösterge bulunamadı." });
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Gösterge getirilirken hata oluştu.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Göstergeyi günceller (Sadece Admin)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateIndicator(int id, [FromBody] UpdateIndicatorRequest request)
        {
            try
            {
                var command = new UpdateIndicatorCommand { Id = id, Request = request };
                var result = await _mediator.Send(command);
                
                if (!result)
                    return NotFound(new { Message = "Gösterge bulunamadı." });
                
                return Ok(new { Message = "Gösterge başarıyla güncellendi." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Gösterge güncellenirken hata oluştu.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Göstergeyi siler (pasif yapar) (Sadece Admin)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteIndicator(int id)
        {
            try
            {
                var command = new DeleteIndicatorCommand { Id = id };
                var result = await _mediator.Send(command);
                
                if (!result)
                    return NotFound(new { Message = "Gösterge bulunamadı." });
                
                return Ok(new { Message = "Gösterge başarıyla silindi." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Gösterge silinirken hata oluştu.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Kullanıcının veri giriş formu için göstergelerini getirir
        /// </summary>
        [HttpGet("data-entry")]
        public async Task<IActionResult> GetDataEntryForm([FromQuery] int year, [FromQuery] int period)
        {
            try
            {
                var userId = GetCurrentUserId();
                var query = new GetIndicatorDataEntryQuery 
                { 
                    UserId = userId, 
                    Year = year, 
                    Period = period 
                };
                var result = await _mediator.Send(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Veri giriş formu getirilirken hata oluştu.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Gösterge verilerini kaydeder
        /// </summary>
        [HttpPost("data-entry")]
        public async Task<IActionResult> SaveIndicatorData([FromBody] SaveIndicatorDataRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var command = new SaveIndicatorDataCommand 
                { 
                    Request = request, 
                    UserId = userId 
                };
                var result = await _mediator.Send(command);
                
                var message = request.IsDraft ? "Veriler taslak olarak kaydedildi." : "Veriler başarıyla gönderildi.";
                return Ok(new { Message = message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Veriler kaydedilirken hata oluştu.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Tüm departmanları listeler
        /// </summary>
        [HttpGet("departments")]
        public async Task<IActionResult> GetDepartments()
        {
            try
            {
                var query = new GetDepartmentsQuery();
                var result = await _mediator.Send(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Departmanlar getirilirken hata oluştu.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Belirtilen departmandaki kullanıcıları listeler
        /// </summary>
        [HttpGet("users/department/{departmentId}")]
        public async Task<IActionResult> GetUsersByDepartment(int departmentId)
        {
            try
            {
                var query = new GetUsersByDepartmentQuery { DepartmentId = departmentId };
                var result = await _mediator.Send(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Departman kullanıcıları getirilirken hata oluştu.", Error = ex.Message });
            }
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("id") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                return userId;
            }
            throw new UnauthorizedAccessException("Kullanıcı kimliği bulunamadı.");
        }
    }
}

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using UniversityDashBoardProject.Application.Features.Indicators.Commands;
using UniversityDashBoardProject.Application.Features.Indicators.Queries;
using UniversityDashBoardProject.Domain.Services;
using System.Security.Claims;
using Serilog;

namespace UniversityDashBoardProject.Presentation.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class IndicatorController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IPeriodCalculationService _periodCalculationService;
        private readonly Serilog.ILogger _logger = Log.ForContext<IndicatorController>();

        public IndicatorController(IMediator mediator, IPeriodCalculationService periodCalculationService)
        {
            _mediator = mediator;
            _periodCalculationService = periodCalculationService;
        }

        /// <summary>
        /// Yeni gösterge oluşturur (Sadece Admin)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateIndicator([FromBody] CreateIndicatorRequest request)
        {
            _logger.Information("Creating indicator: {IndicatorName} by user: {UserId}", request.IndicatorName, GetCurrentUserId());
            
            try
            {
                var userId = GetCurrentUserId();
                var command = new CreateIndicatorCommand 
                { 
                    Request = request,
                    CreatedBy = userId
                };
                var result = await _mediator.Send(command);
                _logger.Information("Indicator created successfully with ID: {IndicatorId}", result);
                return Ok(new { IndicatorId = result, Message = "Gösterge başarıyla oluşturuldu." });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error creating indicator: {IndicatorName}", request.IndicatorName);
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
            _logger.Information("Getting indicator list by user: {UserId}", GetCurrentUserId());
            
            try
            {
                var query = new GetIndicatorListQuery();
                var result = await _mediator.Send(query);
                _logger.Information("Indicator list retrieved successfully, count: {Count}", result.Count);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting indicator list");
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
        /// Gösterge durumunu değiştirir (Sadece Admin)
        /// </summary>
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleIndicatorStatus(int id, [FromBody] ToggleStatusRequest request)
        {
            try
            {
                var command = new ToggleIndicatorStatusCommand { Id = id, IsActive = request.IsActive };
                var result = await _mediator.Send(command);
                
                if (!result)
                    return NotFound(new { Message = "Gösterge bulunamadı." });
                
                return Ok(new { Message = "Gösterge durumu başarıyla güncellendi." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Gösterge durumu güncellenirken hata oluştu.", Error = ex.Message });
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
        /// Göstergeyi kalıcı olarak siler (Sadece Admin)
        /// </summary>
        [HttpDelete("{id}/permanent")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PermanentDeleteIndicator(int id)
        {
            try
            {
                var command = new PermanentDeleteIndicatorCommand { Id = id };
                var result = await _mediator.Send(command);
                
                if (!result)
                    return NotFound(new { Message = "Gösterge bulunamadı." });
                
                return Ok(new { Message = "Gösterge kalıcı olarak silindi." });
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
        /// Belirtilen gösterge için mevcut ve sonraki veri giriş periyotlarını getirir
        /// </summary>
        [HttpGet("periods/{indicatorId}")]
        public async Task<IActionResult> GetIndicatorPeriods(int indicatorId)
        {
            try
            {
                var query = new GetIndicatorByIdQuery { Id = indicatorId };
                var indicator = await _mediator.Send(query);
                
                if (indicator == null || !indicator.PeriodStartDate.HasValue)
                    return NotFound(new { Message = "Gösterge bulunamadı veya başlangıç tarihi tanımlı değil." });

                var currentDate = DateTime.UtcNow;
                var currentYear = currentDate.Year;
                var currentPeriod = (currentDate.Month - 1) / 3 + 1; // Çeyrek hesaplama

                // Son veri giriş periyodunu bul
                var lastPeriod = _periodCalculationService.GetLastDataEntryPeriod(
                    indicator.PeriodStartDate.Value, 
                    indicator.PeriodType, 
                    currentDate
                );

                // Sonraki veri giriş periyodunu bul
                var nextPeriod = _periodCalculationService.GetNextDataEntryPeriod(
                    indicator.PeriodStartDate.Value, 
                    indicator.PeriodType, 
                    lastPeriod.year, 
                    lastPeriod.period
                );

                // Mevcut periyotta veri girişi yapılabilir mi kontrol et
                var canEnterCurrentPeriod = _periodCalculationService.IsDataEntryAllowed(
                    indicator.PeriodStartDate.Value, 
                    indicator.PeriodType, 
                    currentYear, 
                    currentPeriod
                );

                return Ok(new
                {
                    IndicatorId = indicatorId,
                    IndicatorCode = indicator.IndicatorCode,
                    IndicatorName = indicator.IndicatorName,
                    PeriodType = indicator.PeriodType.ToString(),
                    PeriodStartDate = indicator.PeriodStartDate,
                    LastDataEntryPeriod = new { Year = lastPeriod.year, Period = lastPeriod.period },
                    NextDataEntryPeriod = new { Year = nextPeriod.year, Period = nextPeriod.period },
                    CanEnterCurrentPeriod = canEnterCurrentPeriod,
                    CurrentPeriod = new { Year = currentYear, Period = currentPeriod }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Periyot bilgileri getirilirken hata oluştu.", Error = ex.Message });
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

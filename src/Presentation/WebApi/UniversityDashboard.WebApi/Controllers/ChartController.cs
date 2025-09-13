using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniversityDashBoardProject.Application.DTOs.Chart;
using UniversityDashBoardProject.Application.Features.Charts.Commands;
using UniversityDashBoardProject.Application.Features.Charts.Queries;
using UniversityDashBoardProject.Application.Features.Indicators.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using System.Security.Claims;

namespace UniversityDashBoardProject.Presentation.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChartController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IChartService _chartService;

        public ChartController(IMediator mediator, IChartService chartService)
        {
            _mediator = mediator;
            _chartService = chartService;
        }

        #region Chart Sections

        /// <summary>
        /// Get all chart sections in hierarchical structure
        /// </summary>
        [HttpGet("sections")]
        public async Task<ActionResult<List<ChartSectionTreeDto>>> GetChartSections()
        {
            var query = new GetChartSectionsQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Create a new chart section (Admin only)
        /// </summary>
        [HttpPost("sections")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<int>> CreateChartSection([FromBody] CreateChartSectionRequest request)
        {
            var command = new CreateChartSectionCommand
            {
                SectionName = request.SectionName,
                Description = request.Description,
                ParentId = request.ParentId,
                DisplayOrder = request.DisplayOrder
            };

            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetChartSections), new { id = result }, result);
        }

        /// <summary>
        /// Update a chart section (Admin only)
        /// </summary>
        [HttpPut("sections/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> UpdateChartSection(int id, [FromBody] UpdateChartSectionRequest request)
        {
            var result = await _chartService.UpdateChartSectionAsync(id, request);
            if (!result)
                return NotFound($"Chart section with ID {id} not found.");

            return Ok(result);
        }

        /// <summary>
        /// Delete a chart section (Admin only)
        /// </summary>
        [HttpDelete("sections/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> DeleteChartSection(int id)
        {
            var result = await _chartService.DeleteChartSectionAsync(id);
            if (!result)
                return NotFound($"Chart section with ID {id} not found.");

            return Ok(result);
        }

        #endregion

        #region Charts

        /// <summary>
        /// Get all charts in a specific section
        /// </summary>
        [HttpGet("section/{sectionId}")]
        public async Task<ActionResult<List<ChartListDto>>> GetChartsBySection(int sectionId)
        {
            var query = new GetChartsBySectionQuery { SectionId = sectionId };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Get chart details by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ChartDetailDto>> GetChartById(int id)
        {
            var query = new GetChartByIdQuery { ChartId = id };
            var result = await _mediator.Send(query);
            
            if (result == null)
                return NotFound($"Chart with ID {id} not found.");

            return Ok(result);
        }

        /// <summary>
        /// Get chart data with optional filtering
        /// </summary>
        [HttpGet("{id}/data")]
        public async Task<ActionResult<ChartDataResponseDto>> GetChartData(
            int id, 
            [FromQuery] int? filterId = null, 
            [FromQuery] int year = 0, 
            [FromQuery] int period = 1, 
            [FromQuery] bool includeHistoricalData = false)
        {
            // If year is not provided, use current year
            if (year == 0)
                year = DateTime.Now.Year;

            var query = new GetChartDataQuery
            {
                ChartId = id,
                FilterId = filterId,
                Year = year,
                Period = period,
                IncludeHistoricalData = includeHistoricalData
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Get historical data for a chart
        /// </summary>
        [HttpGet("{id}/historical-data")]
        public async Task<ActionResult<List<ChartHistoricalDataDto>>> GetChartHistoricalData(
            int id, 
            [FromQuery] int? filterId = null)
        {
            var result = await _chartService.GetChartHistoricalDataAsync(id, filterId);
            return Ok(result);
        }

        /// <summary>
        /// Create a new chart (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<int>> CreateChart([FromBody] CreateChartRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var command = new CreateChartCommand
            {
                ChartName = request.ChartName,
                ChartType = request.ChartType,
                Title = request.Title,
                Subtitle = request.Subtitle,
                Description = request.Description,
                SectionId = request.SectionId,
                DisplayOrder = request.DisplayOrder,
                ShowHistoricalData = request.ShowHistoricalData,
                HistoricalDataDisplayType = request.HistoricalDataDisplayType,
                CreatedBy = userId,
                Indicators = request.Indicators,
                Filters = request.Filters,
                Groups = request.Groups
            };

            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetChartById), new { id = result }, result);
        }

        /// <summary>
        /// Update a chart (Admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> UpdateChart(int id, [FromBody] UpdateChartRequest request)
        {
            var command = new UpdateChartCommand
            {
                ChartId = id,
                ChartName = request.ChartName,
                ChartType = request.ChartType,
                Title = request.Title,
                Subtitle = request.Subtitle,
                Description = request.Description,
                DisplayOrder = request.DisplayOrder,
                IsActive = request.IsActive,
                ShowHistoricalData = request.ShowHistoricalData,
                HistoricalDataDisplayType = request.HistoricalDataDisplayType,
                Indicators = request.Indicators,
                Filters = request.Filters,
                Groups = request.Groups
            };

            var result = await _mediator.Send(command);
            if (!result)
                return NotFound($"Chart with ID {id} not found.");

            return Ok(result);
        }

        /// <summary>
        /// Delete a chart (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> DeleteChart(int id)
        {
            var command = new DeleteChartCommand { ChartId = id };
            var result = await _mediator.Send(command);
            
            if (!result)
                return NotFound($"Chart with ID {id} not found.");

            return Ok(result);
        }

        #endregion

        #region Chart Filters & Groups

        /// <summary>
        /// Get filters for a specific chart
        /// </summary>
        [HttpGet("{id}/filters")]
        public async Task<ActionResult<List<ChartFilterDto>>> GetChartFilters(int id)
        {
            var chart = await _chartService.GetChartByIdAsync(id);
            if (chart == null)
                return NotFound($"Chart with ID {id} not found.");

            return Ok(chart.Filters);
        }

        /// <summary>
        /// Get groups for a specific chart
        /// </summary>
        [HttpGet("{id}/groups")]
        public async Task<ActionResult<List<ChartGroupDto>>> GetChartGroups(int id)
        {
            var chart = await _chartService.GetChartByIdAsync(id);
            if (chart == null)
                return NotFound($"Chart with ID {id} not found.");

            return Ok(chart.Groups);
        }

        #endregion

        #region Utility Endpoints

        /// <summary>
        /// Get all available indicators for chart creation
        /// </summary>
        [HttpGet("indicators")]
        public async Task<ActionResult<List<object>>> GetAvailableIndicators()
        {
            try
            {
                // IndicatorService ile göstergeleri getir
                var query = new GetIndicatorListQuery();
                var indicators = await _mediator.Send(query);
                
                // Sadece gerekli alanları döndür
                var result = indicators.Select(i => new {
                    id = i.IndicatorId,
                    name = i.IndicatorName,
                    description = i.IndicatorCode,
                    indicatorCode = i.IndicatorCode
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to get indicators", error = ex.Message });
            }
        }

        /// <summary>
        /// Get supported chart types
        /// </summary>
        [HttpGet("types")]
        public async Task<ActionResult<List<string>>> GetSupportedChartTypes()
        {
            var result = await _chartService.GetSupportedChartTypesAsync();
            return Ok(result);
        }

        /// <summary>
        /// Validate chart configuration (Admin only)
        /// </summary>
        [HttpGet("{id}/validate")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> ValidateChartConfiguration(int id)
        {
            var result = await _chartService.ValidateChartConfigurationAsync(id);
            return Ok(new { IsValid = result });
        }

        #endregion
    }
}

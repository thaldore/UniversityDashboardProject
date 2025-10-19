using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniversityDashBoardProject.Application.Features.Notifications.Commands;
using UniversityDashBoardProject.Application.Features.Notifications.Queries;
using System.Security.Claims;

namespace UniversityDashBoardProject.Presentation.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly IMediator _mediator;

        public NotificationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) 
                ?? throw new UnauthorizedAccessException("User not authenticated");
            return int.Parse(userIdClaim);
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications(
            [FromQuery] int skip = 0, 
            [FromQuery] int take = 20, 
            [FromQuery] bool? onlyUnread = null)
        {
            try
            {
                var query = new GetUserNotificationsQuery
                {
                    UserId = GetCurrentUserId(),
                    PageNumber = (skip / take) + 1, // Skip/take'i page number'a çevir
                    PageSize = take,
                    OnlyUnread = onlyUnread
                };

                var notifications = await _mediator.Send(query);
                
                return Ok(new 
                { 
                    data = notifications,
                    skip = skip,
                    take = take,
                    count = notifications.Count,
                    hasMore = notifications.Count == take
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            try
            {
                var query = new GetUnreadCountQuery
                {
                    UserId = GetCurrentUserId()
                };

                var count = await _mediator.Send(query);
                return Ok(new { count });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetNotificationSummary()
        {
            try
            {
                var userId = GetCurrentUserId();
                var query = new GetNotificationSummaryQuery
                {
                    UserId = userId
                };

                var summary = await _mediator.Send(query);
                return Ok(summary);
            }
            catch (FormatException ex)
            {
                return BadRequest(new { message = "Invalid user ID format", error = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        [HttpPut("{id}/mark-as-read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            try
            {
                var command = new MarkAsReadCommand
                {
                    NotificationId = id,
                    UserId = GetCurrentUserId()
                };

                var result = await _mediator.Send(command);
                
                if (!result)
                    return NotFound(new { message = "Bildirim bulunamadı" });

                return Ok(new { message = "Bildirim okundu olarak işaretlendi" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("mark-all-as-read")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            try
            {
                var command = new MarkAllAsReadCommand
                {
                    UserId = GetCurrentUserId()
                };

                var count = await _mediator.Send(command);
                return Ok(new { message = $"{count} bildirim okundu olarak işaretlendi", count });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            try
            {
                var command = new DeleteNotificationCommand
                {
                    NotificationId = id,
                    UserId = GetCurrentUserId()
                };

                var result = await _mediator.Send(command);
                
                if (!result)
                    return NotFound(new { message = "Bildirim bulunamadı" });

                return Ok(new { message = "Bildirim silindi" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

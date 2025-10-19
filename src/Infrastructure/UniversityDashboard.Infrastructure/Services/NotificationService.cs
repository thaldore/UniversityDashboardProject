using Microsoft.EntityFrameworkCore;
using UniversityDashBoardProject.Application.DTOs.Notification;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Domain.Entities;
using UniversityDashBoardProject.Domain.Enums;
using UniversityDashBoardProject.Infrastructure.Persistence;

namespace UniversityDashBoardProject.Infrastructure.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;

        public NotificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateNotificationAsync(
            int recipientUserId, 
            string title, 
            string message, 
            NotificationType type, 
            string? actionUrl = null,
            string? relatedEntityType = null,
            int? relatedEntityId = null)
        {
            var notification = new Notification
            {
                RecipientUserId = recipientUserId,
                Title = title,
                Message = message,
                Type = type,
                ActionUrl = actionUrl,
                RelatedEntityType = relatedEntityType,
                RelatedEntityId = relatedEntityId,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task CreateBulkNotificationsAsync(
            List<int> recipientUserIds, 
            string title, 
            string message, 
            NotificationType type, 
            string? actionUrl = null,
            string? relatedEntityType = null,
            int? relatedEntityId = null)
        {
            var notifications = recipientUserIds.Select(userId => new Notification
            {
                RecipientUserId = userId,
                Title = title,
                Message = message,
                Type = type,
                ActionUrl = actionUrl,
                RelatedEntityType = relatedEntityType,
                RelatedEntityId = relatedEntityId,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            _context.Notifications.AddRange(notifications);
            await _context.SaveChangesAsync();
        }

        public async Task<List<NotificationDto>> GetUserNotificationsAsync(
            int userId, 
            int pageNumber = 1, 
            int pageSize = 20, 
            bool? onlyUnread = null)
        {
            var query = _context.Notifications
                .Where(n => n.RecipientUserId == userId);

            if (onlyUnread == true)
                query = query.Where(n => !n.IsRead);

            // Önce database'den verileri al (projection olmadan)
            var notifications = await query
                .OrderByDescending(n => n.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Sonra client-side'da DTO'ya map et
            return notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type.ToString(),
                TypeDisplay = GetTypeDisplay(n.Type),
                IsRead = n.IsRead,
                ActionUrl = n.ActionUrl,
                CreatedAt = n.CreatedAt,
                TimeAgo = GetTimeAgo(n.CreatedAt)
            }).ToList();
        }

        public async Task<int> GetUnreadCountAsync(int userId)
        {
            return await _context.Notifications
                .Where(n => n.RecipientUserId == userId && !n.IsRead)
                .CountAsync();
        }

        public async Task<NotificationSummaryDto> GetNotificationSummaryAsync(int userId)
        {
            return new NotificationSummaryDto
            {
                UnreadCount = await GetUnreadCountAsync(userId),
                RecentNotifications = await GetUserNotificationsAsync(userId, 1, 5)
            };
        }

        public async Task<bool> MarkAsReadAsync(int notificationId, int userId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId && n.RecipientUserId == userId);

            if (notification == null)
                return false;

            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<int> MarkAllAsReadAsync(int userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.RecipientUserId == userId && !n.IsRead)
                .ToListAsync();

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
                notification.ReadAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return notifications.Count;
        }

        public async Task<bool> DeleteNotificationAsync(int notificationId, int userId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId && n.RecipientUserId == userId);

            if (notification == null)
                return false;

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            return true;
        }

        // Gösterge veri girişi bildirimi
        public async Task NotifyIndicatorDataEntryAsync(
            int indicatorId, 
            int dataEntryUserId, 
            int? notificationUserId = null)
        {
            var indicator = await _context.Indicators
                .Include(i => i.Department)
                .FirstOrDefaultAsync(i => i.IndicatorId == indicatorId);

            if (indicator == null)
                return;

            // Veri giriş yapacak kişiye bildirim
            await CreateNotificationAsync(
                dataEntryUserId,
                "Yeni Gösterge Oluşturuldu",
                $"{indicator.IndicatorName} göstergesi için veri girişi yapmanız bekleniyor.",
                NotificationType.IndicatorDataEntryRequired,
                $"/indicators/data-entry/{indicatorId}",
                "Indicator",
                indicatorId
            );

            // Bildirim alacak kişi varsa ona da gönder
            if (notificationUserId.HasValue && notificationUserId.Value != dataEntryUserId)
            {
                await CreateNotificationAsync(
                    notificationUserId.Value,
                    "Yeni Gösterge Oluşturuldu",
                    $"{indicator.IndicatorName} göstergesi oluşturuldu ve veri girişi için atandı.",
                    NotificationType.IndicatorCreated,
                    $"/indicators/{indicatorId}",
                    "Indicator",
                    indicatorId
                );
            }
        }

        // Performans dönemi oluşturulduğunda bildirim
        public async Task NotifyPerformancePeriodCreatedAsync(
            int periodId, 
            List<int> assignedUserIds, 
            List<int> departmentManagerUserIds)
        {
            var period = await _context.PerformancePeriods
                .FirstOrDefaultAsync(p => p.PeriodId == periodId);

            if (period == null)
                return;

            var allRecipients = assignedUserIds.Union(departmentManagerUserIds).Distinct().ToList();

            if (allRecipients.Any())
            {
                await CreateBulkNotificationsAsync(
                    allRecipients,
                    "Yeni Performans Dönemi Açıldı",
                    $"{period.PeriodName} performans dönemi oluşturuldu. Hedeflerinizi belirlemeye başlayabilirsiniz.",
                    NotificationType.PerformancePeriodCreated,
                    "/performance/my-targets", // Kullanıcının hedef oluşturma sayfası
                    "PerformancePeriod",
                    periodId
                );
            }
        }

        // Performans hedef onay bildirimi
        public async Task NotifyPerformanceTargetApprovalAsync(
            int targetId, 
            int targetOwnerUserId, 
            bool isApproved)
        {
            var target = await _context.PerformanceTargets
                .FirstOrDefaultAsync(t => t.TargetId == targetId);

            if (target == null)
                return;

            var title = isApproved ? "Hedef Onaylandı" : "Hedef Reddedildi";
            var message = isApproved 
                ? $"{target.TargetName} hedefiniz onaylandı."
                : $"{target.TargetName} hedefiniz reddedildi. Lütfen tekrar gözden geçirin.";
            
            var type = isApproved 
                ? NotificationType.PerformanceTargetApproved 
                : NotificationType.PerformanceTargetRejected;

            await CreateNotificationAsync(
                targetOwnerUserId,
                title,
                message,
                type,
                "/performance/my-targets", // Kullanıcının hedef listesi
                "PerformanceTarget",
                targetId
            );
        }

        // Performans hedef ilerleme onay bildirimi
        public async Task NotifyPerformanceTargetProgressApprovalAsync(
            int progressId, 
            int targetOwnerUserId, 
            bool isApproved)
        {
            var progress = await _context.PerformanceTargetProgresses
                .Include(p => p.Target)
                .FirstOrDefaultAsync(p => p.ProgressId == progressId);

            if (progress == null)
                return;

            var title = isApproved ? "İlerleme Kaydı Onaylandı" : "İlerleme Kaydı Reddedildi";
            var message = isApproved 
                ? $"{progress.Target.TargetName} hedefi için girdiğiniz ilerleme kaydı onaylandı."
                : $"{progress.Target.TargetName} hedefi için girdiğiniz ilerleme kaydı reddedildi.";
            
            var type = isApproved 
                ? NotificationType.PerformanceTargetProgressApproved 
                : NotificationType.PerformanceTargetProgressRejected;

            await CreateNotificationAsync(
                targetOwnerUserId,
                title,
                message,
                type,
                "/performance/my-targets", // Kullanıcının hedef listesi
                "PerformanceTargetProgress",
                progressId
            );
        }

        private string GetTypeDisplay(NotificationType type)
        {
            return type switch
            {
                NotificationType.PerformancePeriodCreated => "Performans Dönemi",
                NotificationType.PerformanceTargetAssigned => "Hedef Atama",
                NotificationType.PerformanceTargetApproved => "Hedef Onayı",
                NotificationType.PerformanceTargetRejected => "Hedef Reddi",
                NotificationType.PerformanceTargetProgressApproved => "İlerleme Onayı",
                NotificationType.PerformanceTargetProgressRejected => "İlerleme Reddi",
                NotificationType.IndicatorCreated => "Gösterge",
                NotificationType.IndicatorDataEntryRequired => "Veri Girişi",
                NotificationType.IndicatorDataSubmitted => "Veri Gönderildi",
                NotificationType.SystemMaintenance => "Sistem",
                NotificationType.UserRoleChanged => "Yetki Değişikliği",
                NotificationType.GeneralAnnouncement => "Duyuru",
                _ => "Bildirim"
            };
        }

        private string GetTimeAgo(DateTime dateTime)
        {
            var timeSpan = DateTime.UtcNow - dateTime;

            if (timeSpan.TotalMinutes < 1)
                return "Az önce";
            if (timeSpan.TotalMinutes < 60)
                return $"{(int)timeSpan.TotalMinutes} dakika önce";
            if (timeSpan.TotalHours < 24)
                return $"{(int)timeSpan.TotalHours} saat önce";
            if (timeSpan.TotalDays < 7)
                return $"{(int)timeSpan.TotalDays} gün önce";
            
            return dateTime.ToString("dd.MM.yyyy HH:mm");
        }
    }
}

using UniversityDashBoardProject.Application.DTOs.Notification;
using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Application.Interfaces
{
    public interface INotificationService
    {
        // Bildirim oluşturma
        Task CreateNotificationAsync(int recipientUserId, string title, string message, 
            NotificationType type, string? actionUrl = null, string? relatedEntityType = null, int? relatedEntityId = null);
        
        Task CreateBulkNotificationsAsync(List<int> recipientUserIds, string title, string message, 
            NotificationType type, string? actionUrl = null, string? relatedEntityType = null, int? relatedEntityId = null);
        
        // Bildirim okuma
        Task<List<NotificationDto>> GetUserNotificationsAsync(int userId, int pageNumber = 1, int pageSize = 20, bool? onlyUnread = null);
        Task<int> GetUnreadCountAsync(int userId);
        Task<NotificationSummaryDto> GetNotificationSummaryAsync(int userId);
        
        // Bildirim işlemleri
        Task<bool> MarkAsReadAsync(int notificationId, int userId);
        Task<int> MarkAllAsReadAsync(int userId);
        Task<bool> DeleteNotificationAsync(int notificationId, int userId);
        
        // Özel bildirimler
        Task NotifyIndicatorDataEntryAsync(int indicatorId, int dataEntryUserId, int? notificationUserId = null);
        Task NotifyPerformancePeriodCreatedAsync(int periodId, List<int> assignedUserIds, List<int> departmentManagerUserIds);
        Task NotifyPerformanceTargetApprovalAsync(int targetId, int targetOwnerUserId, bool isApproved);
        Task NotifyPerformanceTargetProgressApprovalAsync(int progressId, int targetOwnerUserId, bool isApproved);
    }
}

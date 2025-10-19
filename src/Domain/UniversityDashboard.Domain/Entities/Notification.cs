using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Domain.Entities
{
    public class Notification
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public NotificationType Type { get; set; }
        
        // Alıcı bilgisi
        public int RecipientUserId { get; set; }
        
        // Bildirim durumu
        public bool IsRead { get; set; }
        public DateTime? ReadAt { get; set; }
        
        // İlgili kayıt bilgileri
        public string? RelatedEntityType { get; set; } // "PerformanceTarget", "Indicator", "PerformancePeriod"
        public int? RelatedEntityId { get; set; }
        public string? ActionUrl { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        // Navigation property
        public ApplicationUser RecipientUser { get; set; } = null!;
    }
}

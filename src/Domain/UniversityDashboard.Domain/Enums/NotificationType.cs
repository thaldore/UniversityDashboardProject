namespace UniversityDashBoardProject.Domain.Enums
{
    public enum NotificationType
    {
        // Performans Bildirimleri
        PerformancePeriodCreated = 1,
        PerformanceTargetAssigned = 2,
        PerformanceTargetApproved = 3,
        PerformanceTargetRejected = 4,
        PerformanceTargetProgressApproved = 5,
        PerformanceTargetProgressRejected = 6,
        
        // Gösterge Bildirimleri
        IndicatorCreated = 10,
        IndicatorDataEntryRequired = 11,
        IndicatorDataSubmitted = 12,
        
        // Sistem Bildirimleri
        SystemMaintenance = 20,
        UserRoleChanged = 21,
        
        // Genel Bildirimler
        GeneralAnnouncement = 30
    }
}

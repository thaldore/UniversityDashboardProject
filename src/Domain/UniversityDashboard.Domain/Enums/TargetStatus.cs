namespace UniversityDashBoardProject.Domain.Enums
{
    public enum TargetStatus
    {
        Draft = 1,                    // Taslak
        Submitted = 2,                // Gönderildi
        Approved = 3,                 // Onaylandı
        Rejected = 4,                 // Reddedildi
        ProgressDraft = 5,            // Gerçekleşme Taslak
        ProgressSubmitted = 6,        // Gerçekleşme Gönderildi
        ProgressApproved = 7,         // Gerçekleşme Onaylandı
        ProgressRejected = 8          // Gerçekleşme Reddedildi
    }
}

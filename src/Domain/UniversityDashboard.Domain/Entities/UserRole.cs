using Microsoft.AspNetCore.Identity;

namespace UniversityDashBoardProject.Domain.Entities
{
    public class UserRole : IdentityUserRole<int>
    {
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
        
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual ApplicationRole Role { get; set; } = null!;
    }
}
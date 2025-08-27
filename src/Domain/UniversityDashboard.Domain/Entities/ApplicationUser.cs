using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityDashBoardProject.Domain.Entities
{
    public class ApplicationUser : IdentityUser<int>
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        
        [ForeignKey("Department")]
        public int? DepartmentId { get; set; }
        public virtual Department? Department { get; set; }
        
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
    // Refresh token fields
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
        
        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}
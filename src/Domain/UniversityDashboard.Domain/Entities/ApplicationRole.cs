using Microsoft.AspNetCore.Identity;

namespace UniversityDashBoardProject.Domain.Entities
{
    public class ApplicationRole : IdentityRole<int>
    {
        public string Description { get; set; } = string.Empty;
        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}
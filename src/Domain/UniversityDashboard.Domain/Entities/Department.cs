namespace UniversityDashBoardProject.Domain.Entities
{
    public class Department
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public int? ParentId { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public virtual Department? Parent { get; set; }
        public virtual ICollection<Department> Children { get; set; } = new List<Department>();
        public virtual ICollection<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();
    }
}
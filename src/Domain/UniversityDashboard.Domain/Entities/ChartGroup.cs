using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Domain.Entities
{
    public class ChartGroup
    {
        public int GroupId { get; set; }
        public int ChartId { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public string? Color { get; set; } // HEX color code for group
        
        // Yeni alanlar - Grup içinde gruplandırma için
        public GroupType GroupType { get; set; } = GroupType.ColorGroup;
        public int? ParentGroupId { get; set; }
        
        // Navigation Properties
        public virtual Chart Chart { get; set; } = null!;
        public virtual ICollection<ChartGroupIndicator> ChartGroupIndicators { get; set; } = new List<ChartGroupIndicator>();
        
        // Grup hiyerarşisi için navigation properties
        public virtual ChartGroup? ParentGroup { get; set; }
        public virtual ICollection<ChartGroup> ChildGroups { get; set; } = new List<ChartGroup>();
    }
}

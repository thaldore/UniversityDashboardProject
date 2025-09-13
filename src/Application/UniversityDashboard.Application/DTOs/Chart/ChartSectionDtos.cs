namespace UniversityDashBoardProject.Application.DTOs.Chart
{
    public class ChartSectionDto
    {
        public int SectionId { get; set; }
        public string SectionName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? ParentId { get; set; }
        public string? ParentName { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public List<ChartSectionDto> Children { get; set; } = new();
        public List<ChartListDto> Charts { get; set; } = new();
    }

    public class ChartSectionTreeDto
    {
        public int SectionId { get; set; }
        public string SectionName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int DisplayOrder { get; set; }
        public int ChartCount { get; set; }
        public List<ChartSectionTreeDto> Children { get; set; } = new();
    }
}

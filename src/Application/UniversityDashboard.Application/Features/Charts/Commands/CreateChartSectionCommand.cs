using MediatR;
using UniversityDashBoardProject.Application.DTOs.Chart;

namespace UniversityDashBoardProject.Application.Features.Charts.Commands
{
    public class CreateChartSectionCommand : IRequest<int>
    {
        public string SectionName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? ParentId { get; set; }
        public int DisplayOrder { get; set; }
    }
}

using MediatR;

namespace UniversityDashBoardProject.Application.Features.Charts.Commands
{
    public class DeleteChartSectionCommand : IRequest<bool>
    {
        public int SectionId { get; set; }
    }
}

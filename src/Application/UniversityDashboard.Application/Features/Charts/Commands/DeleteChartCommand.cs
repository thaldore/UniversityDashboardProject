using MediatR;

namespace UniversityDashBoardProject.Application.Features.Charts.Commands
{
    public class DeleteChartCommand : IRequest<bool>
    {
        public int ChartId { get; set; }
    }
}

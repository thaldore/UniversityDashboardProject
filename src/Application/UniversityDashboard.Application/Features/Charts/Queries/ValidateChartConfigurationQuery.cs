using MediatR;

namespace UniversityDashBoardProject.Application.Features.Charts.Queries
{
    public class ValidateChartConfigurationQuery : IRequest<bool>
    {
        public int ChartId { get; set; }
    }
}

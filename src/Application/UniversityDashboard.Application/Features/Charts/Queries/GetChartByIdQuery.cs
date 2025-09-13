using MediatR;
using UniversityDashBoardProject.Application.DTOs.Chart;

namespace UniversityDashBoardProject.Application.Features.Charts.Queries
{
    public class GetChartByIdQuery : IRequest<ChartDetailDto?>
    {
        public int ChartId { get; set; }
    }
}

using MediatR;
using UniversityDashBoardProject.Application.DTOs.Chart;

namespace UniversityDashBoardProject.Application.Features.Charts.Queries
{
    public class GetChartsBySectionQuery : IRequest<List<ChartListDto>>
    {
        public int SectionId { get; set; }
    }
}

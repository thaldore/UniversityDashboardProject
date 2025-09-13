using MediatR;
using UniversityDashBoardProject.Application.DTOs.Chart;

namespace UniversityDashBoardProject.Application.Features.Charts.Queries
{
    public class GetChartSectionsQuery : IRequest<List<ChartSectionTreeDto>>
    {
    }
}

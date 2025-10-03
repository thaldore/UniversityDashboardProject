using MediatR;
using UniversityDashBoardProject.Application.DTOs.Chart;

namespace UniversityDashBoardProject.Application.Features.Charts.Queries
{
    public class GetChartHistoricalDataQuery : IRequest<List<ChartHistoricalDataDto>>
    {
        public int ChartId { get; set; }
        public int? FilterId { get; set; }
    }
}

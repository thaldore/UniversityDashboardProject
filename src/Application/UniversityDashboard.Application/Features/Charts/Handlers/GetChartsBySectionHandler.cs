using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Chart;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class GetChartsBySectionHandler : IRequestHandler<GetChartsBySectionQuery, List<ChartListDto>>
    {
        private readonly IChartService _chartService;

        public GetChartsBySectionHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<List<ChartListDto>> Handle(GetChartsBySectionQuery request, CancellationToken cancellationToken)
        {
            return await _chartService.GetChartsBySectionAsync(request.SectionId);
        }
    }
}

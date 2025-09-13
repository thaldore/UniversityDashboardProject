using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Chart;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class GetChartSectionsHandler : IRequestHandler<GetChartSectionsQuery, List<ChartSectionTreeDto>>
    {
        private readonly IChartService _chartService;

        public GetChartSectionsHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<List<ChartSectionTreeDto>> Handle(GetChartSectionsQuery request, CancellationToken cancellationToken)
        {
            return await _chartService.GetChartSectionsAsync();
        }
    }
}

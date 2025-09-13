using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Chart;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class GetChartByIdHandler : IRequestHandler<GetChartByIdQuery, ChartDetailDto?>
    {
        private readonly IChartService _chartService;

        public GetChartByIdHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<ChartDetailDto?> Handle(GetChartByIdQuery request, CancellationToken cancellationToken)
        {
            return await _chartService.GetChartByIdAsync(request.ChartId);
        }
    }
}

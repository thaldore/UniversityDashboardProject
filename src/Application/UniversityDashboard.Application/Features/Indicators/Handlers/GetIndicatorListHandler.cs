using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Queries;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class GetIndicatorListHandler : IRequestHandler<GetIndicatorListQuery, List<IndicatorListDto>>
    {
        private readonly IIndicatorService _indicatorService;

        public GetIndicatorListHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<List<IndicatorListDto>> Handle(GetIndicatorListQuery request, CancellationToken cancellationToken)
        {
            return await _indicatorService.GetIndicatorListAsync();
        }
    }
}

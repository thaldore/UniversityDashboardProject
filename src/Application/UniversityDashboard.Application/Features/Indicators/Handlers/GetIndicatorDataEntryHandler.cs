using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Queries;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class GetIndicatorDataEntryHandler : IRequestHandler<GetIndicatorDataEntryQuery, List<IndicatorDataEntryDto>>
    {
        private readonly IIndicatorService _indicatorService;

        public GetIndicatorDataEntryHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<List<IndicatorDataEntryDto>> Handle(GetIndicatorDataEntryQuery request, CancellationToken cancellationToken)
        {
            return await _indicatorService.GetUserIndicatorsForDataEntryAsync(request.UserId, request.Year, request.Period);
        }
    }
}

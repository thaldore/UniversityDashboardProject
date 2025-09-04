using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Queries;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class GetIndicatorByIdHandler : IRequestHandler<GetIndicatorByIdQuery, IndicatorDetailDto?>
    {
        private readonly IIndicatorService _indicatorService;

        public GetIndicatorByIdHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<IndicatorDetailDto?> Handle(GetIndicatorByIdQuery request, CancellationToken cancellationToken)
        {
            return await _indicatorService.GetIndicatorByIdAsync(request.Id);
        }
    }
}

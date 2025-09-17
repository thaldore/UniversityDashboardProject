using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Commands;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class ToggleIndicatorStatusHandler : IRequestHandler<ToggleIndicatorStatusCommand, bool>
    {
        private readonly IIndicatorService _indicatorService;

        public ToggleIndicatorStatusHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<bool> Handle(ToggleIndicatorStatusCommand request, CancellationToken cancellationToken)
        {
            return await _indicatorService.ToggleIndicatorStatusAsync(request.Id, request.IsActive);
        }
    }
}
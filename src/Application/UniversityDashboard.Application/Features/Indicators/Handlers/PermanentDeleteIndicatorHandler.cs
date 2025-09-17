using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Commands;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class PermanentDeleteIndicatorHandler : IRequestHandler<PermanentDeleteIndicatorCommand, bool>
    {
        private readonly IIndicatorService _indicatorService;

        public PermanentDeleteIndicatorHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<bool> Handle(PermanentDeleteIndicatorCommand request, CancellationToken cancellationToken)
        {
            return await _indicatorService.PermanentDeleteIndicatorAsync(request.Id);
        }
    }
}
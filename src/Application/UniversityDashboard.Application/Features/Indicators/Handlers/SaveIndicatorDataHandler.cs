using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Commands;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class SaveIndicatorDataHandler : IRequestHandler<SaveIndicatorDataCommand, bool>
    {
        private readonly IIndicatorService _indicatorService;

        public SaveIndicatorDataHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<bool> Handle(SaveIndicatorDataCommand request, CancellationToken cancellationToken)
        {
            return await _indicatorService.SaveIndicatorDataAsync(request.Request, request.UserId);
        }
    }
}

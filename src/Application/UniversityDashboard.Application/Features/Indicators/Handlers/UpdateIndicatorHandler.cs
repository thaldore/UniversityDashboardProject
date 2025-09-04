using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Commands;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class UpdateIndicatorHandler : IRequestHandler<UpdateIndicatorCommand, bool>
    {
        private readonly IIndicatorService _indicatorService;

        public UpdateIndicatorHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<bool> Handle(UpdateIndicatorCommand request, CancellationToken cancellationToken)
        {
            return await _indicatorService.UpdateIndicatorAsync(request.Id, request.Request);
        }
    }
}

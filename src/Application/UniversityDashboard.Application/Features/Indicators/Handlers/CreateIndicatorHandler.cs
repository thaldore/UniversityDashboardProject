using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Commands;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class CreateIndicatorHandler : IRequestHandler<CreateIndicatorCommand, int>
    {
        private readonly IIndicatorService _indicatorService;

        public CreateIndicatorHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<int> Handle(CreateIndicatorCommand request, CancellationToken cancellationToken)
        {
            return await _indicatorService.CreateIndicatorAsync(request.Request, request.CreatedBy);
        }
    }
}

using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Commands;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class DeleteIndicatorHandler : IRequestHandler<DeleteIndicatorCommand, bool>
    {
        private readonly IIndicatorService _indicatorService;

        public DeleteIndicatorHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<bool> Handle(DeleteIndicatorCommand request, CancellationToken cancellationToken)
        {
            return await _indicatorService.DeleteIndicatorAsync(request.Id);
        }
    }
}

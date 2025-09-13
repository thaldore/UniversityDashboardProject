using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Commands;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class DeleteChartHandler : IRequestHandler<DeleteChartCommand, bool>
    {
        private readonly IChartService _chartService;

        public DeleteChartHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<bool> Handle(DeleteChartCommand request, CancellationToken cancellationToken)
        {
            return await _chartService.DeleteChartAsync(request.ChartId);
        }
    }
}

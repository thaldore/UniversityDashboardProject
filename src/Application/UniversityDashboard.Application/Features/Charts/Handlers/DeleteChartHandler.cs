using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class DeleteChartHandler : IRequestHandler<DeleteChartCommand, bool>
    {
        private readonly IChartService _chartService;
        private readonly Serilog.ILogger _logger = Log.ForContext<DeleteChartHandler>();

        public DeleteChartHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<bool> Handle(DeleteChartCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Deleting chart: {ChartId}", request.ChartId);
            
            try
            {
                var result = await _chartService.DeleteChartAsync(request.ChartId);
                _logger.Information("Chart deleted successfully: {ChartId}", request.ChartId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error deleting chart: {ChartId}", request.ChartId);
                throw;
            }
        }
    }
}

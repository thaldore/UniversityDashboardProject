using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class ValidateChartConfigurationHandler : IRequestHandler<ValidateChartConfigurationQuery, bool>
    {
        private readonly IChartService _chartService;
        private readonly Serilog.ILogger _logger = Log.ForContext<ValidateChartConfigurationHandler>();

        public ValidateChartConfigurationHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<bool> Handle(ValidateChartConfigurationQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Validating chart configuration for chart: {ChartId}", request.ChartId);
            
            try
            {
                var result = await _chartService.ValidateChartConfigurationAsync(request.ChartId);
                _logger.Information("Chart configuration validation completed for chart: {ChartId}, result: {Result}", request.ChartId, result);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error validating chart configuration for chart: {ChartId}", request.ChartId);
                throw;
            }
        }
    }
}

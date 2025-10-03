using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class TogglePerformancePeriodStatusHandler : IRequestHandler<TogglePerformancePeriodStatusCommand, bool>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<TogglePerformancePeriodStatusHandler>();

        public TogglePerformancePeriodStatusHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(TogglePerformancePeriodStatusCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Toggling performance period status: {PeriodId} to {IsActive}", request.PeriodId, request.IsActive);
            
            try
            {
                var result = await _performanceService.TogglePerformancePeriodStatusAsync(request.PeriodId, request.IsActive);
                _logger.Information("Performance period status toggled successfully: {PeriodId}", request.PeriodId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error toggling performance period status: {PeriodId}", request.PeriodId);
                throw;
            }
        }
    }
}

using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class ToggleIndicatorStatusHandler : IRequestHandler<ToggleIndicatorStatusCommand, bool>
    {
        private readonly IIndicatorService _indicatorService;
        private readonly Serilog.ILogger _logger = Log.ForContext<ToggleIndicatorStatusHandler>();

        public ToggleIndicatorStatusHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<bool> Handle(ToggleIndicatorStatusCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Toggling indicator status: {IndicatorId} to {IsActive}", request.Id, request.IsActive);
            
            try
            {
                var result = await _indicatorService.ToggleIndicatorStatusAsync(request.Id, request.IsActive);
                _logger.Information("Indicator status toggled successfully: {IndicatorId} to {IsActive}", request.Id, request.IsActive);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error toggling indicator status: {IndicatorId}", request.Id);
                throw;
            }
        }
    }
}
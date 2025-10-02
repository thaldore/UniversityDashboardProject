using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class PermanentDeleteIndicatorHandler : IRequestHandler<PermanentDeleteIndicatorCommand, bool>
    {
        private readonly IIndicatorService _indicatorService;
        private readonly Serilog.ILogger _logger = Log.ForContext<PermanentDeleteIndicatorHandler>();

        public PermanentDeleteIndicatorHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<bool> Handle(PermanentDeleteIndicatorCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Permanently deleting indicator: {IndicatorId}", request.Id);
            
            try
            {
                var result = await _indicatorService.PermanentDeleteIndicatorAsync(request.Id);
                _logger.Information("Indicator permanently deleted successfully: {IndicatorId}", request.Id);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error permanently deleting indicator: {IndicatorId}", request.Id);
                throw;
            }
        }
    }
}
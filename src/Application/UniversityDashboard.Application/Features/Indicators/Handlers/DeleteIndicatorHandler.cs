using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class DeleteIndicatorHandler : IRequestHandler<DeleteIndicatorCommand, bool>
    {
        private readonly IIndicatorService _indicatorService;
        private readonly Serilog.ILogger _logger = Log.ForContext<DeleteIndicatorHandler>();

        public DeleteIndicatorHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<bool> Handle(DeleteIndicatorCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Deleting indicator: {IndicatorId}", request.Id);
            
            try
            {
                var result = await _indicatorService.DeleteIndicatorAsync(request.Id);
                _logger.Information("Indicator deleted successfully: {IndicatorId}", request.Id);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error deleting indicator: {IndicatorId}", request.Id);
                throw;
            }
        }
    }
}

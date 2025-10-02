using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class UpdateIndicatorHandler : IRequestHandler<UpdateIndicatorCommand, bool>
    {
        private readonly IIndicatorService _indicatorService;
        private readonly Serilog.ILogger _logger = Log.ForContext<UpdateIndicatorHandler>();

        public UpdateIndicatorHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<bool> Handle(UpdateIndicatorCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Updating indicator: {IndicatorId}", request.Id);
            
            try
            {
                var result = await _indicatorService.UpdateIndicatorAsync(request.Id, request.Request);
                _logger.Information("Indicator updated successfully: {IndicatorId}", request.Id);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error updating indicator: {IndicatorId}", request.Id);
                throw;
            }
        }
    }
}

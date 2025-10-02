using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class CreateIndicatorHandler : IRequestHandler<CreateIndicatorCommand, int>
    {
        private readonly IIndicatorService _indicatorService;
        private readonly Serilog.ILogger _logger = Log.ForContext<CreateIndicatorHandler>();

        public CreateIndicatorHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<int> Handle(CreateIndicatorCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Creating indicator: {IndicatorName} by user: {CreatedBy}", request.Request.IndicatorName, request.CreatedBy);
            
            try
            {
                var result = await _indicatorService.CreateIndicatorAsync(request.Request, request.CreatedBy);
                _logger.Information("Indicator created successfully with ID: {IndicatorId}", result);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error creating indicator: {IndicatorName}", request.Request.IndicatorName);
                throw;
            }
        }
    }
}

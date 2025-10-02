using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class SaveIndicatorDataHandler : IRequestHandler<SaveIndicatorDataCommand, bool>
    {
        private readonly IIndicatorService _indicatorService;
        private readonly Serilog.ILogger _logger = Log.ForContext<SaveIndicatorDataHandler>();

        public SaveIndicatorDataHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<bool> Handle(SaveIndicatorDataCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Saving indicator data with {ItemCount} items by user: {UserId}", 
                request.Request.DataItems.Count, request.UserId);
            
            try
            {
                var result = await _indicatorService.SaveIndicatorDataAsync(request.Request, request.UserId);
                _logger.Information("Indicator data saved successfully with {ItemCount} items", request.Request.DataItems.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error saving indicator data with {ItemCount} items", request.Request.DataItems.Count);
                throw;
            }
        }
    }
}

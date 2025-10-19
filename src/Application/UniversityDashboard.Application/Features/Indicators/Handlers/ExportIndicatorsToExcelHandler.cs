using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class ExportIndicatorsToExcelHandler : IRequestHandler<ExportIndicatorsToExcelQuery, byte[]>
    {
        private readonly IIndicatorService _indicatorService;
        private readonly Serilog.ILogger _logger = Log.ForContext<ExportIndicatorsToExcelHandler>();

        public ExportIndicatorsToExcelHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<byte[]> Handle(ExportIndicatorsToExcelQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Exporting indicators to Excel");
            
            try
            {
                var result = await _indicatorService.ExportIndicatorsToExcelAsync();
                _logger.Information("Indicators exported to Excel successfully");
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error exporting indicators to Excel");
                throw;
            }
        }
    }
}

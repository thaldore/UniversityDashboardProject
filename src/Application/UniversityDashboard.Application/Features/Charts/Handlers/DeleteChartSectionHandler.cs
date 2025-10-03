using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class DeleteChartSectionHandler : IRequestHandler<DeleteChartSectionCommand, bool>
    {
        private readonly IChartService _chartService;
        private readonly Serilog.ILogger _logger = Log.ForContext<DeleteChartSectionHandler>();

        public DeleteChartSectionHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<bool> Handle(DeleteChartSectionCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Deleting chart section: {SectionId}", request.SectionId);
            
            try
            {
                var result = await _chartService.DeleteChartSectionAsync(request.SectionId);
                _logger.Information("Chart section deleted successfully: {SectionId}", request.SectionId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error deleting chart section: {SectionId}", request.SectionId);
                throw;
            }
        }
    }
}

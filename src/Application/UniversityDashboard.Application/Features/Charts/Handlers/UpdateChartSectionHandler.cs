using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Chart;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class UpdateChartSectionHandler : IRequestHandler<UpdateChartSectionCommand, bool>
    {
        private readonly IChartService _chartService;
        private readonly Serilog.ILogger _logger = Log.ForContext<UpdateChartSectionHandler>();

        public UpdateChartSectionHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<bool> Handle(UpdateChartSectionCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Updating chart section: {SectionId}", request.SectionId);
            
            try
            {
                var updateRequest = new UpdateChartSectionRequest
                {
                    SectionName = request.SectionName,
                    Description = request.Description,
                    DisplayOrder = request.DisplayOrder,
                    IsActive = request.IsActive
                };

                var result = await _chartService.UpdateChartSectionAsync(request.SectionId, updateRequest);
                _logger.Information("Chart section updated successfully: {SectionId}", request.SectionId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error updating chart section: {SectionId}", request.SectionId);
                throw;
            }
        }
    }
}

using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Chart;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class CreateChartSectionHandler : IRequestHandler<CreateChartSectionCommand, int>
    {
        private readonly IChartService _chartService;
        private readonly Serilog.ILogger _logger = Log.ForContext<CreateChartSectionHandler>();

        public CreateChartSectionHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<int> Handle(CreateChartSectionCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Creating chart section: {SectionName}", request.SectionName);
            
            try
            {
                var createRequest = new CreateChartSectionRequest
                {
                    SectionName = request.SectionName,
                    Description = request.Description,
                    ParentId = request.ParentId,
                    DisplayOrder = request.DisplayOrder
                };

                var result = await _chartService.CreateChartSectionAsync(createRequest);
                _logger.Information("Chart section created successfully with ID: {SectionId}", result);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error creating chart section: {SectionName}", request.SectionName);
                throw;
            }
        }
    }
}

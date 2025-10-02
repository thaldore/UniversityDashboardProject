using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Chart;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class GetChartsBySectionHandler : IRequestHandler<GetChartsBySectionQuery, List<ChartListDto>>
    {
        private readonly IChartService _chartService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetChartsBySectionHandler>();

        public GetChartsBySectionHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<List<ChartListDto>> Handle(GetChartsBySectionQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting charts by section: {SectionId}", request.SectionId);
            
            try
            {
                var result = await _chartService.GetChartsBySectionAsync(request.SectionId);
                _logger.Information("Charts retrieved successfully for section: {SectionId}, count: {Count}", request.SectionId, result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting charts by section: {SectionId}", request.SectionId);
                throw;
            }
        }
    }
}

using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Chart;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class GetChartSectionsHandler : IRequestHandler<GetChartSectionsQuery, List<ChartSectionTreeDto>>
    {
        private readonly IChartService _chartService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetChartSectionsHandler>();

        public GetChartSectionsHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<List<ChartSectionTreeDto>> Handle(GetChartSectionsQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting chart sections");
            
            try
            {
                var result = await _chartService.GetChartSectionsAsync();
                _logger.Information("Chart sections retrieved successfully, count: {Count}", result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting chart sections");
                throw;
            }
        }
    }
}

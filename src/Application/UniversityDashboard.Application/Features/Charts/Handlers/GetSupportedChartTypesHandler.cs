using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class GetSupportedChartTypesHandler : IRequestHandler<GetSupportedChartTypesQuery, List<string>>
    {
        private readonly IChartService _chartService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetSupportedChartTypesHandler>();

        public GetSupportedChartTypesHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<List<string>> Handle(GetSupportedChartTypesQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting supported chart types");
            
            try
            {
                var result = await _chartService.GetSupportedChartTypesAsync();
                _logger.Information("Supported chart types retrieved successfully, count: {Count}", result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting supported chart types");
                throw;
            }
        }
    }
}

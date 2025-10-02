using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Chart;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class GetChartByIdHandler : IRequestHandler<GetChartByIdQuery, ChartDetailDto?>
    {
        private readonly IChartService _chartService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetChartByIdHandler>();

        public GetChartByIdHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<ChartDetailDto?> Handle(GetChartByIdQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting chart by ID: {ChartId}", request.ChartId);
            
            try
            {
                var result = await _chartService.GetChartByIdAsync(request.ChartId);
                _logger.Information("Chart retrieved successfully: {ChartId}", request.ChartId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting chart by ID: {ChartId}", request.ChartId);
                throw;
            }
        }
    }
}

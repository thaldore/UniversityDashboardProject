using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Queries;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using Serilog;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class GetIndicatorListHandler : IRequestHandler<GetIndicatorListQuery, List<IndicatorListDto>>
    {
        private readonly IIndicatorService _indicatorService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetIndicatorListHandler>();

        public GetIndicatorListHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<List<IndicatorListDto>> Handle(GetIndicatorListQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting indicator list");
            
            try
            {
                var result = await _indicatorService.GetIndicatorListAsync();
                _logger.Information("Indicator list retrieved successfully, count: {Count}", result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting indicator list");
                throw;
            }
        }
    }
}

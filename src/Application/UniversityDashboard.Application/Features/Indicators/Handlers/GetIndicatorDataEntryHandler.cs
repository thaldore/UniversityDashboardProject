using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Queries;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class GetIndicatorDataEntryHandler : IRequestHandler<GetIndicatorDataEntryQuery, List<IndicatorDataEntryDto>>
    {
        private readonly IIndicatorService _indicatorService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetIndicatorDataEntryHandler>();

        public GetIndicatorDataEntryHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<List<IndicatorDataEntryDto>> Handle(GetIndicatorDataEntryQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting indicator data entry for user: {UserId}, year: {Year}, period: {Period}", 
                request.UserId, request.Year, request.Period);
            
            try
            {
                var result = await _indicatorService.GetUserIndicatorsForDataEntryAsync(request.UserId, request.Year, request.Period);
                _logger.Information("Indicator data entry retrieved successfully for user: {UserId}, count: {Count}", 
                    request.UserId, result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting indicator data entry for user: {UserId}", request.UserId);
                throw;
            }
        }
    }
}

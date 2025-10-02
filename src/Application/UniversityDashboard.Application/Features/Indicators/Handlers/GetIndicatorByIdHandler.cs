using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Queries;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using Serilog;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class GetIndicatorByIdHandler : IRequestHandler<GetIndicatorByIdQuery, IndicatorDetailDto?>
    {
        private readonly IIndicatorService _indicatorService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetIndicatorByIdHandler>();

        public GetIndicatorByIdHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<IndicatorDetailDto?> Handle(GetIndicatorByIdQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting indicator by ID: {IndicatorId}", request.Id);
            
            try
            {
                var result = await _indicatorService.GetIndicatorByIdAsync(request.Id);
                _logger.Information("Indicator retrieved successfully: {IndicatorId}", request.Id);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting indicator by ID: {IndicatorId}", request.Id);
                throw;
            }
        }
    }
}

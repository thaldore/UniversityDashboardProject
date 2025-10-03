using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class CalculateTargetScoreHandler : IRequestHandler<CalculateTargetScoreQuery, decimal>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<CalculateTargetScoreHandler>();

        public CalculateTargetScoreHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<decimal> Handle(CalculateTargetScoreQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Calculating target score for target: {TargetId} with actual value: {ActualValue}", 
                request.TargetId, request.ActualValue);
            
            try
            {
                var result = await _performanceService.CalculateTargetScoreAsync(request.TargetId, request.ActualValue);
                _logger.Information("Target score calculated successfully for target: {TargetId}, score: {Score}", 
                    request.TargetId, result);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error calculating target score for target: {TargetId}", request.TargetId);
                throw;
            }
        }
    }
}

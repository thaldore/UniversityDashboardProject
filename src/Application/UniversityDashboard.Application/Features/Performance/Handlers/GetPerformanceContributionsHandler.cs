using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformanceContributionsHandler : IRequestHandler<GetPerformanceContributionsQuery, List<PerformanceContributionDto>>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetPerformanceContributionsHandler>();

        public GetPerformanceContributionsHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<PerformanceContributionDto>> Handle(GetPerformanceContributionsQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting performance contributions for target: {TargetId}", request.TargetId);
            
            try
            {
                var result = await _performanceService.GetPerformanceContributionsAsync(request.TargetId);
                _logger.Information("Performance contributions retrieved successfully for target: {TargetId}, count: {Count}", request.TargetId, result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting performance contributions for target: {TargetId}", request.TargetId);
                throw;
            }
        }
    }
}

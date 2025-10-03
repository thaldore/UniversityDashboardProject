using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class UpdatePerformanceScoringHandler : IRequestHandler<UpdatePerformanceScoringCommand, bool>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<UpdatePerformanceScoringHandler>();

        public UpdatePerformanceScoringHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(UpdatePerformanceScoringCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Updating performance scoring: {ScoringId}", request.ScoringId);
            
            try
            {
                var result = await _performanceService.UpdatePerformanceScoringAsync(request.ScoringId, request.Request);
                _logger.Information("Performance scoring updated successfully: {ScoringId}", request.ScoringId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error updating performance scoring: {ScoringId}", request.ScoringId);
                throw;
            }
        }
    }
}

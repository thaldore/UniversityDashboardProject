using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class DeletePerformanceScoringHandler : IRequestHandler<DeletePerformanceScoringCommand, bool>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<DeletePerformanceScoringHandler>();

        public DeletePerformanceScoringHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(DeletePerformanceScoringCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Deleting performance scoring: {ScoringId}", request.ScoringId);
            
            try
            {
                var result = await _performanceService.DeletePerformanceScoringAsync(request.ScoringId);
                _logger.Information("Performance scoring deleted successfully: {ScoringId}", request.ScoringId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error deleting performance scoring: {ScoringId}", request.ScoringId);
                throw;
            }
        }
    }
}

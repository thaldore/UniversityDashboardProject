using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class CreatePerformanceScoringHandler : IRequestHandler<CreatePerformanceScoringCommand, bool>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<CreatePerformanceScoringHandler>();

        public CreatePerformanceScoringHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(CreatePerformanceScoringCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Creating performance scoring for period: {PeriodId}", request.PeriodId);
            
            try
            {
                var result = await _performanceService.CreatePerformanceScoringAsync(request.PeriodId, request.Request);
                _logger.Information("Performance scoring created successfully for period: {PeriodId}", request.PeriodId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error creating performance scoring for period: {PeriodId}", request.PeriodId);
                throw;
            }
        }
    }
}

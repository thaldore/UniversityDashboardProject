using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class CreatePerformanceAssignmentHandler : IRequestHandler<CreatePerformanceAssignmentCommand, bool>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<CreatePerformanceAssignmentHandler>();

        public CreatePerformanceAssignmentHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(CreatePerformanceAssignmentCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Creating performance assignment for period: {PeriodId}", request.PeriodId);
            
            try
            {
                var result = await _performanceService.CreatePerformanceAssignmentAsync(request.PeriodId, request.Request);
                _logger.Information("Performance assignment created successfully for period: {PeriodId}", request.PeriodId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error creating performance assignment for period: {PeriodId}", request.PeriodId);
                throw;
            }
        }
    }
}

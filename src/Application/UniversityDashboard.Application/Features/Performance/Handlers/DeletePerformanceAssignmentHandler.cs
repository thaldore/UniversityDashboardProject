using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class DeletePerformanceAssignmentHandler : IRequestHandler<DeletePerformanceAssignmentCommand, bool>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<DeletePerformanceAssignmentHandler>();

        public DeletePerformanceAssignmentHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(DeletePerformanceAssignmentCommand request, CancellationToken cancellationToken)
        {
            _logger.Information("Deleting performance assignment: {AssignmentId}", request.AssignmentId);
            
            try
            {
                var result = await _performanceService.DeletePerformanceAssignmentAsync(request.AssignmentId);
                _logger.Information("Performance assignment deleted successfully: {AssignmentId}", request.AssignmentId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error deleting performance assignment: {AssignmentId}", request.AssignmentId);
                throw;
            }
        }
    }
}

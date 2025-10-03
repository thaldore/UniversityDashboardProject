using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class CalculateTotalWeightHandler : IRequestHandler<CalculateTotalWeightQuery, decimal>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<CalculateTotalWeightHandler>();

        public CalculateTotalWeightHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<decimal> Handle(CalculateTotalWeightQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Calculating total weight for department: {DepartmentId}, user: {UserId}, period: {PeriodId}", 
                request.DepartmentId, request.UserId, request.PeriodId);
            
            try
            {
                var result = await _performanceService.CalculateTotalWeightAsync(request.DepartmentId, request.UserId, request.PeriodId);
                _logger.Information("Total weight calculated successfully: {TotalWeight}", result);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error calculating total weight");
                throw;
            }
        }
    }
}

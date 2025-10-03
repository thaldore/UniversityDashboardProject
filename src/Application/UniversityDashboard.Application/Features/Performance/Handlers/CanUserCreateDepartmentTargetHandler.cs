using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class CanUserCreateDepartmentTargetHandler : IRequestHandler<CanUserCreateDepartmentTargetQuery, bool>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<CanUserCreateDepartmentTargetHandler>();

        public CanUserCreateDepartmentTargetHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(CanUserCreateDepartmentTargetQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Checking if user can create department target: user {UserId}, department {DepartmentId}, period {PeriodId}", 
                request.UserId, request.DepartmentId, request.PeriodId);
            
            try
            {
                var result = await _performanceService.CanUserCreateDepartmentTargetAsync(request.UserId, request.PeriodId, request.DepartmentId);
                _logger.Information("User authorization check completed: user {UserId}, result: {Result}", request.UserId, result);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error checking user authorization: user {UserId}", request.UserId);
                throw;
            }
        }
    }
}

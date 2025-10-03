using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class CanUserEditDepartmentTargetHandler : IRequestHandler<CanUserEditDepartmentTargetQuery, bool>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<CanUserEditDepartmentTargetHandler>();

        public CanUserEditDepartmentTargetHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(CanUserEditDepartmentTargetQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Checking if user can edit department target: user {UserId}, target {TargetId}", 
                request.UserId, request.TargetId);
            
            try
            {
                var result = await _performanceService.CanUserEditDepartmentTargetAsync(request.UserId, request.TargetId);
                _logger.Information("User edit authorization check completed: user {UserId}, result: {Result}", request.UserId, result);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error checking user edit authorization: user {UserId}", request.UserId);
                throw;
            }
        }
    }
}

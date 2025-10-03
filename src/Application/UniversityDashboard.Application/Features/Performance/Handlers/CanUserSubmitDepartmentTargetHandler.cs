using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class CanUserSubmitDepartmentTargetHandler : IRequestHandler<CanUserSubmitDepartmentTargetQuery, bool>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<CanUserSubmitDepartmentTargetHandler>();

        public CanUserSubmitDepartmentTargetHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(CanUserSubmitDepartmentTargetQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Checking if user can submit department target: user {UserId}, target {TargetId}", 
                request.UserId, request.TargetId);
            
            try
            {
                var result = await _performanceService.CanUserSubmitDepartmentTargetAsync(request.UserId, request.TargetId);
                _logger.Information("User submit authorization check completed: user {UserId}, result: {Result}", request.UserId, result);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error checking user submit authorization: user {UserId}", request.UserId);
                throw;
            }
        }
    }
}

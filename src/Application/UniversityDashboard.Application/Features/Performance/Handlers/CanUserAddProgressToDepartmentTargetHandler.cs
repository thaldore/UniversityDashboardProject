using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class CanUserAddProgressToDepartmentTargetHandler : IRequestHandler<CanUserAddProgressToDepartmentTargetQuery, bool>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<CanUserAddProgressToDepartmentTargetHandler>();

        public CanUserAddProgressToDepartmentTargetHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(CanUserAddProgressToDepartmentTargetQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Checking if user can add progress to department target: user {UserId}, target {TargetId}", 
                request.UserId, request.TargetId);
            
            try
            {
                var result = await _performanceService.CanUserAddProgressToDepartmentTargetAsync(request.UserId, request.TargetId);
                _logger.Information("User progress authorization check completed: user {UserId}, result: {Result}", request.UserId, result);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error checking user progress authorization: user {UserId}", request.UserId);
                throw;
            }
        }
    }
}

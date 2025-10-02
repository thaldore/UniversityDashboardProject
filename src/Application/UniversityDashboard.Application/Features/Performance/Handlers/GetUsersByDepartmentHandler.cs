using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetUsersByDepartmentHandler : IRequestHandler<GetUsersByDepartmentQuery, List<UserDto>>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetUsersByDepartmentHandler>();

        public GetUsersByDepartmentHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<UserDto>> Handle(GetUsersByDepartmentQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting users by department: {DepartmentId}", request.DepartmentId);
            
            try
            {
                var result = await _performanceService.GetUsersByDepartmentAsync(request.DepartmentId);
                _logger.Information("Users retrieved successfully for department: {DepartmentId}, count: {Count}", request.DepartmentId, result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting users by department: {DepartmentId}", request.DepartmentId);
                throw;
            }
        }
    }
}

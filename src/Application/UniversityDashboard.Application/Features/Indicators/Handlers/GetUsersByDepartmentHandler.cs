using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Queries;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class GetUsersByDepartmentHandler : IRequestHandler<GetUsersByDepartmentQuery, List<UserDto>>
    {
        private readonly IIndicatorService _indicatorService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetUsersByDepartmentHandler>();

        public GetUsersByDepartmentHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<List<UserDto>> Handle(GetUsersByDepartmentQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting users by department: {DepartmentId}", request.DepartmentId);
            
            try
            {
                var result = await _indicatorService.GetUsersByDepartmentAsync(request.DepartmentId);
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

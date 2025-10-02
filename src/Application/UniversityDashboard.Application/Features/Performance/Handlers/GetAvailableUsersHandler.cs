using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetAvailableUsersHandler : IRequestHandler<GetAvailableUsersQuery, List<UserDto>>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetAvailableUsersHandler>();

        public GetAvailableUsersHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<UserDto>> Handle(GetAvailableUsersQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting available users");
            
            try
            {
                var result = await _performanceService.GetAvailableUsersAsync();
                _logger.Information("Available users retrieved successfully, count: {Count}", result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting available users");
                throw;
            }
        }
    }
}

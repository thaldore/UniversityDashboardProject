using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetAvailableDepartmentsHandler : IRequestHandler<GetAvailableDepartmentsQuery, List<DepartmentDto>>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetAvailableDepartmentsHandler>();

        public GetAvailableDepartmentsHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<DepartmentDto>> Handle(GetAvailableDepartmentsQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting available departments");
            
            try
            {
                var result = await _performanceService.GetAvailableDepartmentsAsync();
                _logger.Information("Available departments retrieved successfully, count: {Count}", result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting available departments");
                throw;
            }
        }
    }
}

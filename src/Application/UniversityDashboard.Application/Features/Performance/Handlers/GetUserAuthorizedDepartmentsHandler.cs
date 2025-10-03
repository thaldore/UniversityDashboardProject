using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetUserAuthorizedDepartmentsHandler : IRequestHandler<GetUserAuthorizedDepartmentsQuery, List<DepartmentDto>>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetUserAuthorizedDepartmentsHandler>();

        public GetUserAuthorizedDepartmentsHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<DepartmentDto>> Handle(GetUserAuthorizedDepartmentsQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting authorized departments for user: {UserId} in period: {PeriodId}", 
                request.UserId, request.PeriodId);
            
            try
            {
                var result = await _performanceService.GetUserAuthorizedDepartmentsAsync(request.UserId, request.PeriodId);
                _logger.Information("Authorized departments retrieved successfully for user: {UserId}, count: {Count}", 
                    request.UserId, result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting authorized departments for user: {UserId}", request.UserId);
                throw;
            }
        }
    }
}

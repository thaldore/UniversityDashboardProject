using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformanceTargetProgressByIdHandler : IRequestHandler<GetPerformanceTargetProgressByIdQuery, PerformanceTargetProgressDto?>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetPerformanceTargetProgressByIdHandler>();

        public GetPerformanceTargetProgressByIdHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<PerformanceTargetProgressDto?> Handle(GetPerformanceTargetProgressByIdQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting performance target progress by ID: {ProgressId}", request.ProgressId);
            
            try
            {
                var result = await _performanceService.GetPerformanceTargetProgressByIdAsync(request.ProgressId);
                _logger.Information("Performance target progress retrieved successfully: {ProgressId}", request.ProgressId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting performance target progress by ID: {ProgressId}", request.ProgressId);
                throw;
            }
        }
    }
}

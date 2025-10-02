using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformanceTargetByIdHandler : IRequestHandler<GetPerformanceTargetByIdQuery, PerformanceTargetDto?>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetPerformanceTargetByIdHandler>();

        public GetPerformanceTargetByIdHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<PerformanceTargetDto?> Handle(GetPerformanceTargetByIdQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting performance target by ID: {TargetId}", request.TargetId);
            
            try
            {
                var result = await _performanceService.GetPerformanceTargetByIdAsync(request.TargetId);
                _logger.Information("Performance target retrieved successfully: {TargetId}", request.TargetId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting performance target by ID: {TargetId}", request.TargetId);
                throw;
            }
        }
    }
}

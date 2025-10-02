using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformancePeriodByIdHandler : IRequestHandler<GetPerformancePeriodByIdQuery, PerformancePeriodDto?>
    {
        private readonly IPerformanceService _performanceService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetPerformancePeriodByIdHandler>();

        public GetPerformancePeriodByIdHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<PerformancePeriodDto?> Handle(GetPerformancePeriodByIdQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting performance period by ID: {PeriodId}", request.PeriodId);
            
            try
            {
                var result = await _performanceService.GetPerformancePeriodByIdAsync(request.PeriodId);
                _logger.Information("Performance period retrieved successfully: {PeriodId}", request.PeriodId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting performance period by ID: {PeriodId}", request.PeriodId);
                throw;
            }
        }
    }
}

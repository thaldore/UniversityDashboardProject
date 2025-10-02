using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Queries;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using UniversityDashBoardProject.Application.Interfaces;
using Serilog;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class GetDepartmentsHandler : IRequestHandler<GetDepartmentsQuery, List<DepartmentDto>>
    {
        private readonly IIndicatorService _indicatorService;
        private readonly Serilog.ILogger _logger = Log.ForContext<GetDepartmentsHandler>();

        public GetDepartmentsHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<List<DepartmentDto>> Handle(GetDepartmentsQuery request, CancellationToken cancellationToken)
        {
            _logger.Information("Getting departments");
            
            try
            {
                var result = await _indicatorService.GetDepartmentsAsync();
                _logger.Information("Departments retrieved successfully, count: {Count}", result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting departments");
                throw;
            }
        }
    }
}

using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Indicator;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetAvailableDepartmentsHandler : IRequestHandler<GetAvailableDepartmentsQuery, List<DepartmentDto>>
    {
        private readonly IPerformanceService _performanceService;

        public GetAvailableDepartmentsHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<DepartmentDto>> Handle(GetAvailableDepartmentsQuery request, CancellationToken cancellationToken)
        {
            return await _performanceService.GetAvailableDepartmentsAsync();
        }
    }
}

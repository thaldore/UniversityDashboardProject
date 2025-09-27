using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Indicator;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetUsersByDepartmentHandler : IRequestHandler<GetUsersByDepartmentQuery, List<UserDto>>
    {
        private readonly IPerformanceService _performanceService;

        public GetUsersByDepartmentHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<UserDto>> Handle(GetUsersByDepartmentQuery request, CancellationToken cancellationToken)
        {
            return await _performanceService.GetUsersByDepartmentAsync(request.DepartmentId);
        }
    }
}

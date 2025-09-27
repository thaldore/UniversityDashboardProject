using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Indicator;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetAvailableUsersHandler : IRequestHandler<GetAvailableUsersQuery, List<UserDto>>
    {
        private readonly IPerformanceService _performanceService;

        public GetAvailableUsersHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<UserDto>> Handle(GetAvailableUsersQuery request, CancellationToken cancellationToken)
        {
            return await _performanceService.GetAvailableUsersAsync();
        }
    }
}

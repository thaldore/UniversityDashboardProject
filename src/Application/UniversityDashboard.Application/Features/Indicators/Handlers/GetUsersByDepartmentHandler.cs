using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Queries;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class GetUsersByDepartmentHandler : IRequestHandler<GetUsersByDepartmentQuery, List<UserDto>>
    {
        private readonly IIndicatorService _indicatorService;

        public GetUsersByDepartmentHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<List<UserDto>> Handle(GetUsersByDepartmentQuery request, CancellationToken cancellationToken)
        {
            return await _indicatorService.GetUsersByDepartmentAsync(request.DepartmentId);
        }
    }
}

using MediatR;
using UniversityDashBoardProject.Application.Features.Indicators.Queries;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Indicators.Handlers
{
    public class GetDepartmentsHandler : IRequestHandler<GetDepartmentsQuery, List<DepartmentDto>>
    {
        private readonly IIndicatorService _indicatorService;

        public GetDepartmentsHandler(IIndicatorService indicatorService)
        {
            _indicatorService = indicatorService;
        }

        public async Task<List<DepartmentDto>> Handle(GetDepartmentsQuery request, CancellationToken cancellationToken)
        {
            return await _indicatorService.GetDepartmentsAsync();
        }
    }
}

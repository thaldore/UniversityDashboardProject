using MediatR;
using UniversityDashBoardProject.Application.Features.Performance.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Handlers
{
    public class GetPerformanceAssignmentsHandler : IRequestHandler<GetPerformanceAssignmentsQuery, List<PerformanceAssignmentDto>>
    {
        private readonly IPerformanceService _performanceService;

        public GetPerformanceAssignmentsHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<List<PerformanceAssignmentDto>> Handle(GetPerformanceAssignmentsQuery request, CancellationToken cancellationToken)
        {
            return await _performanceService.GetPerformanceAssignmentsAsync(request.PeriodId);
        }
    }
}

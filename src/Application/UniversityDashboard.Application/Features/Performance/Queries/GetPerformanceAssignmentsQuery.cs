using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class GetPerformanceAssignmentsQuery : IRequest<List<PerformanceAssignmentDto>>
    {
        public int PeriodId { get; set; }
    }
}

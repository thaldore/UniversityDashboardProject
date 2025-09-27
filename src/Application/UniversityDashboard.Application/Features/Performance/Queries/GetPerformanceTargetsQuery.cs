using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class GetPerformanceTargetsQuery : IRequest<List<PerformanceTargetListDto>>
    {
        public int? PeriodId { get; set; }
        public int? UserId { get; set; }
        public int? DepartmentId { get; set; }
    }
}

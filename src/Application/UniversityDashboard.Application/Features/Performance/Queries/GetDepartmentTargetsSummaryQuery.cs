using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class GetDepartmentTargetsSummaryQuery : IRequest<PerformanceSummaryDto>
    {
        public int DepartmentId { get; set; }
        public int PeriodId { get; set; }
    }
}

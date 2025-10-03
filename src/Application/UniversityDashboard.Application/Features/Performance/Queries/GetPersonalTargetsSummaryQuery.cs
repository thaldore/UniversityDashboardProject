using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class GetPersonalTargetsSummaryQuery : IRequest<PerformanceSummaryDto>
    {
        public int UserId { get; set; }
        public int PeriodId { get; set; }
    }
}

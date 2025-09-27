using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class GetPerformanceScoringsQuery : IRequest<List<PerformanceScoringDto>>
    {
        public int PeriodId { get; set; }
    }
}

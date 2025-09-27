using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class GetPerformanceContributionsQuery : IRequest<List<PerformanceContributionDto>>
    {
        public int TargetId { get; set; }
    }
}

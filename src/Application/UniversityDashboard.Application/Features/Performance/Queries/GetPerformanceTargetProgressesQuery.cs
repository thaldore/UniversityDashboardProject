using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class GetPerformanceTargetProgressesQuery : IRequest<List<PerformanceTargetProgressDto>>
    {
        public int TargetId { get; set; }
    }
}

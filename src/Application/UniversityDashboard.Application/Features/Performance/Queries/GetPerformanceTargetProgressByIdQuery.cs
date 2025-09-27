using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class GetPerformanceTargetProgressByIdQuery : IRequest<PerformanceTargetProgressDto?>
    {
        public int ProgressId { get; set; }
    }
}

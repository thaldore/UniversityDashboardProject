using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class GetPerformanceTargetByIdQuery : IRequest<PerformanceTargetDto?>
    {
        public int TargetId { get; set; }
    }
}

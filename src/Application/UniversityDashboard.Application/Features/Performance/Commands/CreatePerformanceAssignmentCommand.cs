using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class CreatePerformanceAssignmentCommand : IRequest<bool>
    {
        public int PeriodId { get; set; }
        public CreatePerformanceAssignmentRequest Request { get; set; } = null!;
    }
}

using MediatR;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class DeletePerformanceAssignmentCommand : IRequest<bool>
    {
        public int AssignmentId { get; set; }
    }
}

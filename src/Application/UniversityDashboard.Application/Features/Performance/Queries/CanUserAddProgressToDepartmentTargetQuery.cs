using MediatR;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class CanUserAddProgressToDepartmentTargetQuery : IRequest<bool>
    {
        public int UserId { get; set; }
        public int TargetId { get; set; }
    }
}

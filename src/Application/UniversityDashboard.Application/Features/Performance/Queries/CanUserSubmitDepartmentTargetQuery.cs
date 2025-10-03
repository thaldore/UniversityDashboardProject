using MediatR;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class CanUserSubmitDepartmentTargetQuery : IRequest<bool>
    {
        public int UserId { get; set; }
        public int TargetId { get; set; }
    }
}

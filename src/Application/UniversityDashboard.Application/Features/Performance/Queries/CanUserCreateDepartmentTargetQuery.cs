using MediatR;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class CanUserCreateDepartmentTargetQuery : IRequest<bool>
    {
        public int UserId { get; set; }
        public int PeriodId { get; set; }
        public int DepartmentId { get; set; }
    }
}

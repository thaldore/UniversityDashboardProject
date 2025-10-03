using MediatR;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class CalculateTotalWeightQuery : IRequest<decimal>
    {
        public int? DepartmentId { get; set; }
        public int? UserId { get; set; }
        public int? PeriodId { get; set; }
    }
}

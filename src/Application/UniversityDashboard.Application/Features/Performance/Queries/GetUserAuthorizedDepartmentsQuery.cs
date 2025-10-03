using MediatR;
using UniversityDashBoardProject.Application.DTOs.Indicator;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class GetUserAuthorizedDepartmentsQuery : IRequest<List<DepartmentDto>>
    {
        public int UserId { get; set; }
        public int PeriodId { get; set; }
    }
}

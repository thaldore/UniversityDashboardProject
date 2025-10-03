using MediatR;
using UniversityDashBoardProject.Application.DTOs.Indicator;

namespace UniversityDashBoardProject.Application.Features.Indicators.Queries
{
    public class GetUsersByDepartmentQuery : IRequest<List<UserDto>>
    {
        public int DepartmentId { get; set; }
    }
}
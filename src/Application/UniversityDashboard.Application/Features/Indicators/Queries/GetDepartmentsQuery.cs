using MediatR;
using UniversityDashBoardProject.Application.DTOs.Indicator;

namespace UniversityDashBoardProject.Application.Features.Indicators.Queries
{
    public class GetDepartmentsQuery : IRequest<List<DepartmentDto>>
    {
    }
}

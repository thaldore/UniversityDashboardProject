using MediatR;
using UniversityDashBoardProject.Application.DTOs.Indicator;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class GetAvailableDepartmentsQuery : IRequest<List<DepartmentDto>>
    {
    }
}

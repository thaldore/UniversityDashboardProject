using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class GetPerformancePeriodsQuery : IRequest<List<PerformancePeriodListDto>>
    {
    }
}

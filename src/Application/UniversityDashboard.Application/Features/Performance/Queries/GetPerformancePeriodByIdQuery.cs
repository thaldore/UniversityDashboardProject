using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class GetPerformancePeriodByIdQuery : IRequest<PerformancePeriodDto?>
    {
        public int PeriodId { get; set; }
    }
}

using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class CreatePerformanceScoringCommand : IRequest<bool>
    {
        public int PeriodId { get; set; }
        public CreatePerformanceScoringRequest Request { get; set; } = null!;
    }
}

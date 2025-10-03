using MediatR;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class TogglePerformancePeriodStatusCommand : IRequest<bool>
    {
        public int PeriodId { get; set; }
        public bool IsActive { get; set; }
    }
}

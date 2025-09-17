using MediatR;

namespace UniversityDashBoardProject.Application.Features.Indicators.Commands
{
    public class ToggleIndicatorStatusCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public bool IsActive { get; set; }
    }
}
using MediatR;

namespace UniversityDashBoardProject.Application.Features.Indicators.Commands
{
    public class PermanentDeleteIndicatorCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }
}
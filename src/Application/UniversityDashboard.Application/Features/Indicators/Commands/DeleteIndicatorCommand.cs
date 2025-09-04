using MediatR;

namespace UniversityDashBoardProject.Application.Features.Indicators.Commands
{
    public class DeleteIndicatorCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }
}

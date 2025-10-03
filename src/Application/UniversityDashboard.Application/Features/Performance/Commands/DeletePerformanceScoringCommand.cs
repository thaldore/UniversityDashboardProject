using MediatR;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class DeletePerformanceScoringCommand : IRequest<bool>
    {
        public int ScoringId { get; set; }
    }
}

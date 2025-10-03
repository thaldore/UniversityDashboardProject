using MediatR;
using UniversityDashBoardProject.Application.DTOs.Performance;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class UpdatePerformanceScoringCommand : IRequest<bool>
    {
        public int ScoringId { get; set; }
        public CreatePerformanceScoringRequest Request { get; set; } = null!;
    }
}

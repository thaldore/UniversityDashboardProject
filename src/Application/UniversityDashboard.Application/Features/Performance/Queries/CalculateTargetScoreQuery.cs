using MediatR;

namespace UniversityDashBoardProject.Application.Features.Performance.Queries
{
    public class CalculateTargetScoreQuery : IRequest<decimal>
    {
        public int TargetId { get; set; }
        public decimal ActualValue { get; set; }
    }
}

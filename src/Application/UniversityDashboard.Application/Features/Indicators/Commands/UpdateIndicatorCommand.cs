using MediatR;
using UniversityDashBoardProject.Application.DTOs.Indicator;

namespace UniversityDashBoardProject.Application.Features.Indicators.Commands
{
    public class UpdateIndicatorCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public UpdateIndicatorRequest Request { get; set; } = null!;
    }
}

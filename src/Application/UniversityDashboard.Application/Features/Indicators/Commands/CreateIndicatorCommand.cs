using MediatR;
using UniversityDashBoardProject.Application.DTOs.Indicator;

namespace UniversityDashBoardProject.Application.Features.Indicators.Commands
{
    public class CreateIndicatorCommand : IRequest<int>
    {
        public CreateIndicatorRequest Request { get; set; } = null!;
        public int CreatedBy { get; set; }
    }
}

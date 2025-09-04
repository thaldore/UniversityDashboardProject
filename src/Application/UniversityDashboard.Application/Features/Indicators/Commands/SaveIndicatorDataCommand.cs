using MediatR;
using UniversityDashBoardProject.Application.DTOs.Indicator;

namespace UniversityDashBoardProject.Application.Features.Indicators.Commands
{
    public class SaveIndicatorDataCommand : IRequest<bool>
    {
        public SaveIndicatorDataRequest Request { get; set; } = null!;
        public int UserId { get; set; }
    }
}

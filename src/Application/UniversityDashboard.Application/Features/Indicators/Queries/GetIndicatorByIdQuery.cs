using MediatR;
using UniversityDashBoardProject.Application.DTOs.Indicator;

namespace UniversityDashBoardProject.Application.Features.Indicators.Queries
{
    public class GetIndicatorByIdQuery : IRequest<IndicatorDetailDto?>
    {
        public int Id { get; set; }
    }
}

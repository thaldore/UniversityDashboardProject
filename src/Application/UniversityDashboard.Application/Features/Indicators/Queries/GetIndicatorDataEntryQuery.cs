using MediatR;
using UniversityDashBoardProject.Application.DTOs.Indicator;

namespace UniversityDashBoardProject.Application.Features.Indicators.Queries
{
    public class GetIndicatorDataEntryQuery : IRequest<List<IndicatorDataEntryDto>>
    {
        public int UserId { get; set; }
        public int Year { get; set; }
        public int Period { get; set; }
    }
}

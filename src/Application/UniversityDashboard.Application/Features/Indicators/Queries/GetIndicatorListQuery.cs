using MediatR;
using UniversityDashBoardProject.Application.DTOs.Indicator;

namespace UniversityDashBoardProject.Application.Features.Indicators.Queries
{
    public class GetIndicatorListQuery : IRequest<List<IndicatorListDto>>
    {
    }
}

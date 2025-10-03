using MediatR;

namespace UniversityDashBoardProject.Application.Features.Charts.Queries
{
    public class GetSupportedChartTypesQuery : IRequest<List<string>>
    {
    }
}

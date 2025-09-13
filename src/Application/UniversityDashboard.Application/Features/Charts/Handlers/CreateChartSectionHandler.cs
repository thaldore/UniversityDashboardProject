using MediatR;
using UniversityDashBoardProject.Application.Features.Charts.Commands;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Application.DTOs.Chart;

namespace UniversityDashBoardProject.Application.Features.Charts.Handlers
{
    public class CreateChartSectionHandler : IRequestHandler<CreateChartSectionCommand, int>
    {
        private readonly IChartService _chartService;

        public CreateChartSectionHandler(IChartService chartService)
        {
            _chartService = chartService;
        }

        public async Task<int> Handle(CreateChartSectionCommand request, CancellationToken cancellationToken)
        {
            var createRequest = new CreateChartSectionRequest
            {
                SectionName = request.SectionName,
                Description = request.Description,
                ParentId = request.ParentId,
                DisplayOrder = request.DisplayOrder
            };

            return await _chartService.CreateChartSectionAsync(createRequest);
        }
    }
}

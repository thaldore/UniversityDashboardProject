using MediatR;
using UniversityDashBoardProject.Application.Interfaces;

namespace UniversityDashBoardProject.Application.Features.Performance.Commands
{
    public class DeletePerformancePeriodCommand : IRequest<bool>
    {
        public int PeriodId { get; set; }
    }

    public class DeletePerformancePeriodCommandHandler : IRequestHandler<DeletePerformancePeriodCommand, bool>
    {
        private readonly IPerformanceService _performanceService;

        public DeletePerformancePeriodCommandHandler(IPerformanceService performanceService)
        {
            _performanceService = performanceService;
        }

        public async Task<bool> Handle(DeletePerformancePeriodCommand request, CancellationToken cancellationToken)
        {
            return await _performanceService.DeletePerformancePeriodAsync(request.PeriodId);
        }
    }
}

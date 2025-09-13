using UniversityDashBoardProject.Application.DTOs.Chart;
using UniversityDashBoardProject.Application.Features.Charts.Queries;

namespace UniversityDashBoardProject.Application.Interfaces
{
    public interface IChartService
    {
        // Chart Sections
        Task<List<ChartSectionTreeDto>> GetChartSectionsAsync();
        Task<int> CreateChartSectionAsync(CreateChartSectionRequest request);
        Task<bool> UpdateChartSectionAsync(int sectionId, UpdateChartSectionRequest request);
        Task<bool> DeleteChartSectionAsync(int sectionId);

        // Charts
        Task<List<ChartListDto>> GetChartsBySectionAsync(int sectionId);
        Task<ChartDetailDto?> GetChartByIdAsync(int chartId);
        Task<int> CreateChartAsync(CreateChartRequest request, int createdBy);
        Task<bool> UpdateChartAsync(int chartId, UpdateChartRequest request);
        Task<bool> DeleteChartAsync(int chartId);

        // Chart Data
        Task<ChartDataResponseDto> GetChartDataAsync(ChartDataRequest request);
        Task<List<ChartHistoricalDataDto>> GetChartHistoricalDataAsync(int chartId, int? filterId = null);

        // Utility Methods
        Task<List<string>> GetSupportedChartTypesAsync();
        Task<bool> ValidateChartConfigurationAsync(int chartId);
    }
}

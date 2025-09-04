using UniversityDashBoardProject.Application.DTOs.Indicator;

namespace UniversityDashBoardProject.Application.Interfaces
{
    public interface IIndicatorService
    {
        Task<int> CreateIndicatorAsync(CreateIndicatorRequest request, int createdBy);
        Task<bool> UpdateIndicatorAsync(int id, UpdateIndicatorRequest request);
        Task<bool> DeleteIndicatorAsync(int id);
        Task<IndicatorDetailDto?> GetIndicatorByIdAsync(int id);
        Task<List<IndicatorListDto>> GetIndicatorListAsync();
        Task<List<IndicatorDataEntryDto>> GetUserIndicatorsForDataEntryAsync(int userId, int year, int period);
        Task<bool> SaveIndicatorDataAsync(SaveIndicatorDataRequest request, int userId);
        Task<List<DepartmentDto>> GetDepartmentsAsync();
        Task<List<UserDto>> GetUsersByDepartmentAsync(int departmentId);
    }
}

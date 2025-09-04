using Microsoft.EntityFrameworkCore;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Domain.Entities;
using UniversityDashBoardProject.Infrastructure.Persistence;

namespace UniversityDashBoardProject.Infrastructure.Services
{
    public class IndicatorService : IIndicatorService
    {
        private readonly ApplicationDbContext _context;

        public IndicatorService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> CreateIndicatorAsync(CreateIndicatorRequest request, int createdBy)
        {
            var indicator = new Indicator
            {
                IndicatorCode = request.IndicatorCode,
                IndicatorName = request.IndicatorName,
                Description = request.Description,
                DepartmentId = request.DepartmentId,
                DataType = request.DataType,
                PeriodType = request.PeriodType,
                PeriodStartDate = request.PeriodStartDate,
                NotificationPeriod = request.NotificationPeriod,
                IsAutomatic = request.IsAutomatic,
                AssignedUserId = request.AssignedUserId,
                NotificationUserId = request.NotificationUserId,
                IsActive = request.IsActive,
                CreatedBy = createdBy,
                CreatedAt = DateTime.UtcNow
            };

            _context.Indicators.Add(indicator);
            await _context.SaveChangesAsync();

            // Kök değerleri ekle
            if (request.RootValues.Any())
            {
                var rootValues = request.RootValues.Select(rv => new IndicatorRootValue
                {
                    IndicatorId = indicator.IndicatorId,
                    RootValue = rv.RootValue,
                    Description = rv.Description,
                    SortOrder = rv.SortOrder
                }).ToList();

                _context.IndicatorRootValues.AddRange(rootValues);
            }

            // Geçmiş verileri ekle
            if (request.HistoricalData.Any())
            {
                var historicalData = request.HistoricalData.Select(hd => new IndicatorHistoricalData
                {
                    IndicatorId = indicator.IndicatorId,
                    PeriodLabel = hd.PeriodLabel,
                    Value = hd.Value,
                    Description = hd.Description
                }).ToList();

                _context.IndicatorHistoricalData.AddRange(historicalData);
            }

            await _context.SaveChangesAsync();
            return indicator.IndicatorId;
        }

        public async Task<List<IndicatorListDto>> GetIndicatorListAsync()
        {
            var indicators = await _context.Indicators
                .Include(i => i.Department)
                .Include(i => i.AssignedUser)
                .Include(i => i.RootValues.OrderBy(rv => rv.SortOrder))
                .Select(i => new IndicatorListDto
                {
                    IndicatorId = i.IndicatorId,
                    IndicatorCode = i.IndicatorCode,
                    IndicatorName = i.IndicatorName,
                    DepartmentName = i.Department.DepartmentName,
                    DataTypeName = i.DataType.ToString(),
                    IsActive = i.IsActive,
                    AssignedUserName = i.AssignedUser != null ? $"{i.AssignedUser.FirstName} {i.AssignedUser.LastName}" : null,
                    RootValues = i.RootValues.Select(rv => rv.RootValue).ToList(),
                    CreatedAt = i.CreatedAt
                })
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();

            return indicators;
        }

        public async Task<IndicatorDetailDto?> GetIndicatorByIdAsync(int id)
        {
            var indicator = await _context.Indicators
                .Include(i => i.Department)
                .Include(i => i.AssignedUser)
                .Include(i => i.NotificationUser)
                .Include(i => i.RootValues.OrderBy(rv => rv.SortOrder))
                .Include(i => i.HistoricalData)
                .FirstOrDefaultAsync(i => i.IndicatorId == id);

            if (indicator == null)
                return null;

            return new IndicatorDetailDto
            {
                IndicatorId = indicator.IndicatorId,
                IndicatorCode = indicator.IndicatorCode,
                IndicatorName = indicator.IndicatorName,
                Description = indicator.Description,
                DepartmentId = indicator.DepartmentId,
                DepartmentName = indicator.Department.DepartmentName,
                DataType = indicator.DataType,
                PeriodType = indicator.PeriodType,
                PeriodStartDate = indicator.PeriodStartDate,
                NotificationPeriod = indicator.NotificationPeriod,
                IsAutomatic = indicator.IsAutomatic,
                AssignedUserId = indicator.AssignedUserId,
                AssignedUserName = indicator.AssignedUser != null ? $"{indicator.AssignedUser.FirstName} {indicator.AssignedUser.LastName}" : null,
                NotificationUserId = indicator.NotificationUserId,
                NotificationUserName = indicator.NotificationUser != null ? $"{indicator.NotificationUser.FirstName} {indicator.NotificationUser.LastName}" : null,
                IsActive = indicator.IsActive,
                CreatedAt = indicator.CreatedAt,
                RootValues = indicator.RootValues.Select(rv => new RootValueDto
                {
                    RootValueId = rv.RootValueId,
                    RootValue = rv.RootValue,
                    Description = rv.Description,
                    SortOrder = rv.SortOrder
                }).ToList(),
                HistoricalData = indicator.HistoricalData.Select(hd => new HistoricalDataDto
                {
                    HistoricalId = hd.HistoricalId,
                    PeriodLabel = hd.PeriodLabel,
                    Value = hd.Value,
                    Description = hd.Description
                }).ToList()
            };
        }

        public async Task<bool> UpdateIndicatorAsync(int id, UpdateIndicatorRequest request)
        {
            var indicator = await _context.Indicators
                .Include(i => i.RootValues)
                .Include(i => i.HistoricalData)
                .FirstOrDefaultAsync(i => i.IndicatorId == id);

            if (indicator == null)
                return false;

            // Ana gösterge bilgilerini güncelle
            indicator.IndicatorCode = request.IndicatorCode;
            indicator.IndicatorName = request.IndicatorName;
            indicator.Description = request.Description;
            indicator.DepartmentId = request.DepartmentId;
            indicator.DataType = request.DataType;
            indicator.PeriodType = request.PeriodType;
            indicator.PeriodStartDate = request.PeriodStartDate;
            indicator.NotificationPeriod = request.NotificationPeriod;
            indicator.IsAutomatic = request.IsAutomatic;
            indicator.AssignedUserId = request.AssignedUserId;
            indicator.NotificationUserId = request.NotificationUserId;
            indicator.IsActive = request.IsActive;

            // Mevcut kök değerleri sil
            _context.IndicatorRootValues.RemoveRange(indicator.RootValues);

            // Yeni kök değerleri ekle
            if (request.RootValues.Any())
            {
                var newRootValues = request.RootValues.Select(rv => new IndicatorRootValue
                {
                    IndicatorId = indicator.IndicatorId,
                    RootValue = rv.RootValue,
                    Description = rv.Description,
                    SortOrder = rv.SortOrder
                }).ToList();

                _context.IndicatorRootValues.AddRange(newRootValues);
            }

            // Mevcut geçmiş verileri sil
            _context.IndicatorHistoricalData.RemoveRange(indicator.HistoricalData);

            // Yeni geçmiş verileri ekle
            if (request.HistoricalData.Any())
            {
                var newHistoricalData = request.HistoricalData.Select(hd => new IndicatorHistoricalData
                {
                    IndicatorId = indicator.IndicatorId,
                    PeriodLabel = hd.PeriodLabel,
                    Value = hd.Value,
                    Description = hd.Description
                }).ToList();

                _context.IndicatorHistoricalData.AddRange(newHistoricalData);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteIndicatorAsync(int id)
        {
            var indicator = await _context.Indicators
                .FirstOrDefaultAsync(i => i.IndicatorId == id);

            if (indicator == null)
                return false;

            // Soft delete - göstergeyi pasif yap
            indicator.IsActive = false;
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<IndicatorDataEntryDto>> GetUserIndicatorsForDataEntryAsync(int userId, int year, int period)
        {
            // Kullanıcının rolünü kontrol et
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return new List<IndicatorDataEntryDto>();

            var isAdmin = user.UserRoles.Any(ur => ur.Role.Name == "Admin");

            // Admin ise tüm aktif göstergeleri, normal kullanıcı ise sadece atandığı göstergeleri getir
            var query = _context.Indicators
                .Include(i => i.HistoricalData)
                .Include(i => i.Data.Where(d => d.Year == year && d.Period == period))
                .Where(i => i.IsActive);

            if (!isAdmin)
            {
                query = query.Where(i => i.AssignedUserId == userId);
            }

            var indicators = await query.ToListAsync();

            var result = indicators.Select(i => 
            {
                var existingData = i.Data.FirstOrDefault();
                
                return new IndicatorDataEntryDto
                {
                    IndicatorId = i.IndicatorId,
                    IndicatorCode = i.IndicatorCode,
                    IndicatorName = i.IndicatorName,
                    Description = i.Description,
                    IsAutomatic = i.IsAutomatic,
                    CurrentValue = existingData?.Value,
                    Status = existingData?.Status ?? Domain.Enums.DataStatus.Draft,
                    Notes = existingData?.Notes,
                    Year = year,
                    Period = period,
                    HistoricalData = i.HistoricalData.Select(hd => new HistoricalDataDto
                    {
                        HistoricalId = hd.HistoricalId,
                        PeriodLabel = hd.PeriodLabel,
                        Value = hd.Value,
                        Description = hd.Description
                    }).ToList()
                };
            }).ToList();

            return result;
        }

        public async Task<bool> SaveIndicatorDataAsync(SaveIndicatorDataRequest request, int userId)
        {
            foreach (var dataItem in request.DataItems)
            {
                var existingData = await _context.IndicatorData
                    .FirstOrDefaultAsync(d => d.IndicatorId == dataItem.IndicatorId 
                                           && d.Year == dataItem.Year 
                                           && d.Period == dataItem.Period);

                if (existingData != null)
                {
                    // Mevcut veriyi güncelle
                    existingData.Value = dataItem.Value;
                    existingData.Status = dataItem.Status;
                    existingData.Notes = dataItem.Notes;
                    existingData.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    // Yeni veri oluştur
                    var newData = new IndicatorData
                    {
                        IndicatorId = dataItem.IndicatorId,
                        Year = dataItem.Year,
                        Period = dataItem.Period,
                        Value = dataItem.Value,
                        Status = dataItem.Status,
                        Notes = dataItem.Notes,
                        EnteredBy = userId,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    _context.IndicatorData.Add(newData);
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<DepartmentDto>> GetDepartmentsAsync()
        {
            var departments = await _context.Departments
                .Where(d => d.IsActive)
                .Select(d => new DepartmentDto
                {
                    DepartmentId = d.DepartmentId,
                    DepartmentName = d.DepartmentName,
                    IsActive = d.IsActive
                })
                .ToListAsync();

            return departments;
        }

        public async Task<List<UserDto>> GetUsersByDepartmentAsync(int departmentId)
        {
            var users = await _context.Users
                .Include(u => u.Department)
                .Where(u => u.DepartmentId == departmentId && u.IsActive)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    DepartmentId = u.DepartmentId,
                    DepartmentName = u.Department != null ? u.Department.DepartmentName : null
                })
                .ToListAsync();

            return users;
        }
    }
}

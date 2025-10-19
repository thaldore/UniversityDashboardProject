using Microsoft.EntityFrameworkCore;
using UniversityDashBoardProject.Application.DTOs.Indicator;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Domain.Entities;
using UniversityDashBoardProject.Infrastructure.Persistence;
using UniversityDashBoardProject.Domain.Services;
using Serilog;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;

namespace UniversityDashBoardProject.Infrastructure.Services
{
    public class IndicatorService : IIndicatorService
    {
        private readonly ApplicationDbContext _context;
        private readonly IPeriodCalculationService _periodCalculationService;
        private readonly Serilog.ILogger _logger = Log.ForContext<IndicatorService>();

        public IndicatorService(ApplicationDbContext context, IPeriodCalculationService periodCalculationService)
        {
            _context = context;
            _periodCalculationService = periodCalculationService;
        }

        public async Task<int> CreateIndicatorAsync(CreateIndicatorRequest request, int createdBy)
        {
            _logger.Information("Creating indicator: {IndicatorName} by user: {CreatedBy}", request.IndicatorName, createdBy);
            
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

        public async Task<bool> ToggleIndicatorStatusAsync(int id, bool isActive)
        {
            var indicator = await _context.Indicators
                .FirstOrDefaultAsync(i => i.IndicatorId == id);

            if (indicator == null)
                return false;

            indicator.IsActive = isActive;
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

        public async Task<bool> PermanentDeleteIndicatorAsync(int id)
        {
            var indicator = await _context.Indicators
                .Include(i => i.RootValues)
                .Include(i => i.HistoricalData)
                .Include(i => i.Data)
                .FirstOrDefaultAsync(i => i.IndicatorId == id);

            if (indicator == null)
                return false;

            // İlişkili verileri sil
            _context.IndicatorRootValues.RemoveRange(indicator.RootValues);
            _context.IndicatorHistoricalData.RemoveRange(indicator.HistoricalData);
            _context.IndicatorData.RemoveRange(indicator.Data);
            
            // Göstergeyi tamamen sil
            _context.Indicators.Remove(indicator);
            
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

            // Periyot hesaplama servisini kullanarak sadece veri girişi yapılabilecek göstergeleri filtrele
            var filteredIndicators = indicators.Where(i => 
                i.PeriodStartDate.HasValue && 
                _periodCalculationService.IsDataEntryAllowed(i.PeriodStartDate.Value, i.PeriodType, year, period)
            ).ToList();

            var result = filteredIndicators.Select(i => 
            {
                var existingData = i.Data.FirstOrDefault();
                
                // Historical data'yı tarih sırasına göre sırala (en yeni en başta)
                var sortedHistoricalData = i.HistoricalData
                    .OrderByDescending(h => ExtractYearFromPeriodLabel(h.PeriodLabel))
                    .ThenByDescending(h => ExtractPeriodFromPeriodLabel(h.PeriodLabel))
                    .Take(5) // Sadece son 5 kayıt
                    .Select(hd => new HistoricalDataDto
                    {
                        HistoricalId = hd.HistoricalId,
                        PeriodLabel = hd.PeriodLabel,
                        Value = hd.Value,
                        Description = hd.Description
                    }).ToList();

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
                    HistoricalData = sortedHistoricalData
                };
            }).ToList();

            return result;
        }

        public async Task<bool> SaveIndicatorDataAsync(SaveIndicatorDataRequest request, int userId)
        {
            foreach (var dataItem in request.DataItems)
            {
                var indicator = await _context.Indicators
                    .Include(i => i.HistoricalData)
                    .Include(i => i.Data) // Tüm mevcut veri kayıtlarını dahil et
                    .FirstOrDefaultAsync(i => i.IndicatorId == dataItem.IndicatorId);

                if (indicator == null) continue;

                // Yeni periyot için tarih string'i oluştur
                var newPeriodLabel = $"{dataItem.Year}-P{dataItem.Period}";

                // Bu periyot için mevcut veri var mı kontrol et
                var existingData = indicator.Data
                    .FirstOrDefault(d => d.Year == dataItem.Year && d.Period == dataItem.Period);

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
                    // Yeni veri oluşturmadan önce eski verileri historical'a taşı
                    await MoveExistingDataToHistorical(indicator, dataItem.Year, dataItem.Period);

                    // Yeni veri kaydet
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

        /// <summary>
        /// Mevcut IndicatorData kayıtlarını historical data'ya taşır
        /// </summary>
        private async Task MoveExistingDataToHistorical(Indicator indicator, int newYear, int newPeriod)
        {
            // Tüm mevcut IndicatorData kayıtlarını al
            var existingDataRecords = await _context.IndicatorData
                .Where(d => d.IndicatorId == indicator.IndicatorId)
                .OrderByDescending(d => d.Year)
                .ThenByDescending(d => d.Period)
                .ToListAsync();

            foreach (var dataRecord in existingDataRecords)
            {
                var periodLabel = $"{dataRecord.Year}-P{dataRecord.Period}";
                
                // Bu period label ile historical data var mı kontrol et
                var existingHistorical = await _context.IndicatorHistoricalData
                    .FirstOrDefaultAsync(h => h.IndicatorId == indicator.IndicatorId && 
                                            h.PeriodLabel == periodLabel);

                if (existingHistorical == null)
                {
                    // Historical data'ya ekle
                    var historicalData = new IndicatorHistoricalData
                    {
                        IndicatorId = indicator.IndicatorId,
                        PeriodLabel = periodLabel,
                        Value = dataRecord.Value ?? 0,
                        Description = $"{dataRecord.Year} yılı {dataRecord.Period}. periyot verisi"
                    };

                    _context.IndicatorHistoricalData.Add(historicalData);
                }
                else
                {
                    // Mevcut historical data'yı güncelle
                    existingHistorical.Value = dataRecord.Value ?? 0;
                    existingHistorical.Description = $"{dataRecord.Year} yılı {dataRecord.Period}. periyot verisi";
                }
            }

            // Mevcut IndicatorData kayıtlarını sil (yeni veri eklenecek)
            _context.IndicatorData.RemoveRange(existingDataRecords);

            // Historical data'da fazla kayıt varsa temizle
            await CleanupHistoricalData(indicator.IndicatorId, indicator.PeriodType);
        }

        /// <summary>
        /// Historical data'da fazla kayıtları temizler ve sıralama yapar
        /// </summary>
        private async Task CleanupHistoricalData(int indicatorId, Domain.Enums.PeriodType periodType)
        {
            var maxRecords = GetMaxHistoricalRecords(periodType);
            
            // Tüm historical verileri al ve tarih sırasına göre sırala
            var allHistoricalData = await _context.IndicatorHistoricalData
                .Where(h => h.IndicatorId == indicatorId)
                .ToListAsync();

            // Period label'a göre sırala (en yeni en başta)
            var sortedData = allHistoricalData
                .OrderByDescending(h => ExtractYearFromPeriodLabel(h.PeriodLabel))
                .ThenByDescending(h => ExtractPeriodFromPeriodLabel(h.PeriodLabel))
                .ToList();

            // Sadece en son N kaydı tut
            if (sortedData.Count > maxRecords)
            {
                var recordsToKeep = sortedData.Take(maxRecords).ToList();
                var recordsToRemove = allHistoricalData.Except(recordsToKeep);
                
                _context.IndicatorHistoricalData.RemoveRange(recordsToRemove);
            }
        }

        /// <summary>
        /// Period label'dan yıl çıkarır
        /// </summary>
        private int ExtractYearFromPeriodLabel(string periodLabel)
        {
            if (string.IsNullOrEmpty(periodLabel)) return 0;
            
            // "2025-P3" veya "2023 Yılı" formatlarını handle et
            if (periodLabel.Contains("-P"))
            {
                var parts = periodLabel.Split('-');
                if (parts.Length > 0 && int.TryParse(parts[0], out int year))
                    return year;
            }
            else if (periodLabel.Contains("Yılı"))
            {
                var parts = periodLabel.Split(' ');
                if (parts.Length > 0 && int.TryParse(parts[0], out int year))
                    return year;
            }
            
            return 0;
        }

        /// <summary>
        /// Period label'dan periyot numarası çıkarır
        /// </summary>
        private int ExtractPeriodFromPeriodLabel(string periodLabel)
        {
            if (string.IsNullOrEmpty(periodLabel)) return 0;
            
            // "2025-P3" formatını handle et
            if (periodLabel.Contains("-P"))
            {
                var parts = periodLabel.Split('P');
                if (parts.Length > 1 && int.TryParse(parts[1], out int period))
                    return period;
            }
            
            return 1; // Default olarak 1. periyot
        }

        /// <summary>
        /// Periyot tipine göre tutulacak maksimum geçmiş veri sayısını döner
        /// </summary>
        private int GetMaxHistoricalRecords(Domain.Enums.PeriodType periodType)
        {
            return periodType switch
            {
                Domain.Enums.PeriodType.Quarter => 8,    // 2 yıllık geçmiş (8 çeyrek)
                Domain.Enums.PeriodType.HalfYear => 6,   // 3 yıllık geçmiş (6 yarıyıl)
                Domain.Enums.PeriodType.Year => 5,       // 5 yıllık geçmiş
                Domain.Enums.PeriodType.TwoYear => 5,    // 10 yıllık geçmiş (5 iki yıllık periyot)
                _ => 8
            };
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

        public async Task<byte[]> ExportIndicatorsToExcelAsync()
        {
            _logger.Information("Exporting indicators to Excel");
            
            // Set EPPlus license context
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            
            var indicators = await _context.Indicators
                .Include(i => i.Department)
                .Include(i => i.AssignedUser)
                .Include(i => i.RootValues.OrderBy(rv => rv.SortOrder))
                .OrderBy(i => i.IndicatorCode)
                .ToListAsync();
            
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Göstergeler");
            
            // Header
            var headerRow = 1;
            worksheet.Cells[headerRow, 1].Value = "Gösterge Kodu";
            worksheet.Cells[headerRow, 2].Value = "Gösterge Adı";
            worksheet.Cells[headerRow, 3].Value = "Açıklama";
            worksheet.Cells[headerRow, 4].Value = "Departman";
            worksheet.Cells[headerRow, 5].Value = "Veri Tipi";
            worksheet.Cells[headerRow, 6].Value = "Periyot Tipi";
            worksheet.Cells[headerRow, 7].Value = "Kök Değerler";
            worksheet.Cells[headerRow, 8].Value = "Atanan Kullanıcı";
            worksheet.Cells[headerRow, 9].Value = "Durum";
            worksheet.Cells[headerRow, 10].Value = "Oluşturma Tarihi";
            
            // Header styling
            using (var range = worksheet.Cells[headerRow, 1, headerRow, 10])
            {
                range.Style.Font.Bold = true;
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(79, 129, 189));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                range.Style.Border.BorderAround(ExcelBorderStyle.Thin);
            }
            
            // Data
            var row = 2;
            foreach (var indicator in indicators)
            {
                worksheet.Cells[row, 1].Value = indicator.IndicatorCode;
                worksheet.Cells[row, 2].Value = indicator.IndicatorName;
                worksheet.Cells[row, 3].Value = indicator.Description ?? "-";
                worksheet.Cells[row, 4].Value = indicator.Department?.DepartmentName ?? "-";
                worksheet.Cells[row, 5].Value = GetDataTypeName(indicator.DataType);
                worksheet.Cells[row, 6].Value = GetPeriodTypeName(indicator.PeriodType);
                worksheet.Cells[row, 7].Value = string.Join(", ", indicator.RootValues.Select(rv => rv.RootValue));
                worksheet.Cells[row, 8].Value = indicator.AssignedUser != null 
                    ? $"{indicator.AssignedUser.FirstName} {indicator.AssignedUser.LastName}" 
                    : "-";
                worksheet.Cells[row, 9].Value = indicator.IsActive ? "Aktif" : "Pasif";
                worksheet.Cells[row, 10].Value = indicator.CreatedAt.ToString("dd.MM.yyyy HH:mm");
                
                // Alternate row coloring
                if (row % 2 == 0)
                {
                    using var rowRange = worksheet.Cells[row, 1, row, 10];
                    rowRange.Style.Fill.PatternType = ExcelFillStyle.Solid;
                    rowRange.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(217, 225, 242));
                }
                
                row++;
            }
            
            // Auto-fit columns
            worksheet.Cells.AutoFitColumns(10, 50);
            
            // Add borders
            var dataRange = worksheet.Cells[1, 1, row - 1, 10];
            dataRange.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            
            _logger.Information("Excel export completed with {Count} indicators", indicators.Count);
            
            return package.GetAsByteArray();
        }

        private string GetDataTypeName(Domain.Enums.IndicatorDataType dataType)
        {
            return dataType switch
            {
                Domain.Enums.IndicatorDataType.Number => "Sayısal",
                Domain.Enums.IndicatorDataType.Percentage => "Yüzde",
                Domain.Enums.IndicatorDataType.Currency => "Para Birimi",
                Domain.Enums.IndicatorDataType.Other => "Diğer",
                _ => "Bilinmeyen"
            };
        }

        private string GetPeriodTypeName(Domain.Enums.PeriodType periodType)
        {
            return periodType switch
            {
                Domain.Enums.PeriodType.Quarter => "Çeyrek Yıl",
                Domain.Enums.PeriodType.HalfYear => "Yarı Yıl",
                Domain.Enums.PeriodType.Year => "Yıl",
                Domain.Enums.PeriodType.TwoYear => "İki Yıl",
                _ => "Bilinmeyen"
            };
        }
    }
}

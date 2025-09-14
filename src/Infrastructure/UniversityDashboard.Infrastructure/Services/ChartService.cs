using Microsoft.EntityFrameworkCore;
using UniversityDashBoardProject.Application.DTOs.Chart;
using UniversityDashBoardProject.Application.Features.Charts.Queries;
using UniversityDashBoardProject.Application.Interfaces;
using UniversityDashBoardProject.Domain.Entities;
using UniversityDashBoardProject.Domain.Enums;
using UniversityDashBoardProject.Infrastructure.Persistence;

namespace UniversityDashBoardProject.Infrastructure.Services
{
    public class ChartService : IChartService
    {
        private readonly ApplicationDbContext _context;

        public ChartService(ApplicationDbContext context)
        {
            _context = context;
        }

        #region Chart Sections

        public async Task<List<ChartSectionTreeDto>> GetChartSectionsAsync()
        {
            // First, get all active sections with their navigation properties
            var allSections = await _context.ChartSections
                .Where(s => s.IsActive)
                .Include(s => s.Children.Where(c => c.IsActive))
                .Include(s => s.Charts.Where(c => c.IsActive))
                .OrderBy(s => s.DisplayOrder)
                .ToListAsync();

            // Build the tree structure for root sections (no parent)
            var rootSections = allSections
                .Where(s => s.ParentId == null)
                .Select(s => MapToChartSectionTreeDto(s, allSections))
                .OrderBy(s => s.DisplayOrder)
                .ToList();

            return rootSections;
        }

        private ChartSectionTreeDto MapToChartSectionTreeDto(ChartSection section, List<ChartSection> allSections)
        {
            var children = allSections
                .Where(s => s.ParentId == section.SectionId)
                .Select(s => MapToChartSectionTreeDto(s, allSections))
                .OrderBy(s => s.DisplayOrder)
                .ToList();

            return new ChartSectionTreeDto
            {
                SectionId = section.SectionId,
                SectionName = section.SectionName ?? string.Empty,
                Description = section.Description,
                DisplayOrder = section.DisplayOrder,
                ChartCount = section.Charts?.Count(c => c.IsActive) ?? 0,
                Children = children
            };
        }

        public async Task<int> CreateChartSectionAsync(CreateChartSectionRequest request)
        {
            var section = new ChartSection
            {
                SectionName = request.SectionName,
                Description = request.Description,
                ParentId = request.ParentId,
                DisplayOrder = request.DisplayOrder,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.ChartSections.Add(section);
            await _context.SaveChangesAsync();

            return section.SectionId;
        }

        public async Task<bool> UpdateChartSectionAsync(int sectionId, UpdateChartSectionRequest request)
        {
            var section = await _context.ChartSections.FindAsync(sectionId);
            if (section == null) return false;

            section.SectionName = request.SectionName;
            section.Description = request.Description;
            section.DisplayOrder = request.DisplayOrder;
            section.IsActive = request.IsActive;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteChartSectionAsync(int sectionId)
        {
            var section = await _context.ChartSections
                .Include(s => s.Charts)
                .Include(s => s.Children)
                .FirstOrDefaultAsync(s => s.SectionId == sectionId);

            if (section == null) return false;

            // Check if section has charts or children
            if (section.Charts.Any() || section.Children.Any())
            {
                // Soft delete
                section.IsActive = false;
            }
            else
            {
                // Hard delete
                _context.ChartSections.Remove(section);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Charts

        public async Task<List<ChartListDto>> GetChartsBySectionAsync(int sectionId)
        {
            var charts = await _context.Charts
                .Where(c => c.SectionId == sectionId && c.IsActive)
                .Include(c => c.Section)
                .Include(c => c.ChartIndicators)
                .OrderBy(c => c.DisplayOrder)
                .Select(c => new ChartListDto
                {
                    ChartId = c.ChartId,
                    ChartName = c.ChartName,
                    Title = c.Title,
                    ChartType = c.ChartType,
                    ChartTypeName = c.ChartType.ToString(),
                    SectionName = c.Section.SectionName,
                    IsActive = c.IsActive,
                    IndicatorCount = c.ChartIndicators.Count,
                    CreatedAt = c.CreatedAt
                }).ToListAsync();

            return charts;
        }

        public async Task<ChartDetailDto?> GetChartByIdAsync(int chartId)
        {
            var chart = await _context.Charts
                .Where(c => c.ChartId == chartId && c.IsActive)
                .Include(c => c.ChartIndicators)
                    .ThenInclude(ci => ci.Indicator)
                .Include(c => c.ChartFilters)
                    .ThenInclude(cf => cf.ChartFilterIndicators)
                .Include(c => c.ChartGroups)
                    .ThenInclude(cg => cg.ChartGroupIndicators)
                        .ThenInclude(cgi => cgi.Indicator)
                .FirstOrDefaultAsync();

            if (chart == null) return null;

            var chartDetail = new ChartDetailDto
            {
                ChartId = chart.ChartId,
                ChartName = chart.ChartName,
                ChartType = chart.ChartType,
                Title = chart.Title,
                Subtitle = chart.Subtitle,
                Description = chart.Description,
                SectionId = chart.SectionId,
                DisplayOrder = chart.DisplayOrder,
                ShowHistoricalData = chart.ShowHistoricalData,
                HistoricalDataDisplayType = chart.HistoricalDataDisplayType,
                ShowHistoricalInChart = chart.ShowHistoricalInChart,
                HistoricalPeriodCount = chart.HistoricalPeriodCount,
                Indicators = chart.ChartIndicators
                    .OrderBy(ci => ci.DisplayOrder)
                    .Select(ci => new ChartIndicatorDto
                    {
                        IndicatorId = ci.IndicatorId,
                        IndicatorCode = ci.Indicator.IndicatorCode,
                        IndicatorName = ci.Indicator.IndicatorName,
                        DisplayOrder = ci.DisplayOrder,
                        Color = ci.Color,
                        Label = ci.Label,
                        IsVisible = ci.IsVisible
                    }).ToList(),
                Filters = chart.ChartFilters
                    .OrderBy(cf => cf.DisplayOrder)
                    .Select(cf => new ChartFilterDto
                    {
                        FilterId = cf.FilterId,
                        FilterName = cf.FilterName,
                        FilterType = cf.FilterType,
                        FilterValue = cf.FilterValue,
                        IsDefault = cf.IsDefault,
                        DisplayOrder = cf.DisplayOrder,
                        IndicatorIds = cf.ChartFilterIndicators.Select(cfi => cfi.IndicatorId).ToList()
                    }).ToList(),
                Groups = chart.ChartGroups
                    .OrderBy(cg => cg.DisplayOrder)
                    .Select(cg => new ChartGroupDto
                    {
                        GroupId = cg.GroupId,
                        GroupName = cg.GroupName,
                        Description = cg.Description,
                        DisplayOrder = cg.DisplayOrder,
                        Color = cg.Color,
                        Indicators = cg.ChartGroupIndicators
                            .OrderBy(cgi => cgi.DisplayOrder)
                            .Select(cgi => new ChartIndicatorDto
                            {
                                IndicatorId = cgi.IndicatorId,
                                IndicatorCode = cgi.Indicator.IndicatorCode,
                                IndicatorName = cgi.Indicator.IndicatorName,
                                DisplayOrder = cgi.DisplayOrder
                            }).ToList()
                    }).ToList()
            };

            return chartDetail;
        }

        public async Task<int> CreateChartAsync(CreateChartRequest request, int createdBy)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var chart = new Chart
                {
                    ChartName = request.ChartName,
                    ChartType = request.ChartType,
                    Title = request.Title,
                    Subtitle = request.Subtitle,
                    Description = request.Description,
                    SectionId = request.SectionId,
                    DisplayOrder = request.DisplayOrder,
                    ShowHistoricalData = request.ShowHistoricalData,
                    HistoricalDataDisplayType = request.HistoricalDataDisplayType,
                    ShowHistoricalInChart = request.ShowHistoricalInChart,
                    HistoricalPeriodCount = request.HistoricalPeriodCount,
                    CreatedBy = createdBy,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Charts.Add(chart);
                await _context.SaveChangesAsync();

                // Add indicators
                foreach (var indicator in request.Indicators)
                {
                    var chartIndicator = new ChartIndicator
                    {
                        ChartId = chart.ChartId,
                        IndicatorId = indicator.IndicatorId,
                        DisplayOrder = indicator.DisplayOrder,
                        Color = indicator.Color,
                        Label = indicator.Label,
                        IsVisible = indicator.IsVisible
                    };
                    _context.ChartIndicators.Add(chartIndicator);
                }

                // Add filters
                foreach (var filter in request.Filters)
                {
                    var chartFilter = new ChartFilter
                    {
                        ChartId = chart.ChartId,
                        FilterName = filter.FilterName,
                        FilterType = filter.FilterType,
                        FilterValue = filter.FilterValue,
                        IsDefault = filter.IsDefault,
                        DisplayOrder = filter.DisplayOrder
                    };
                    _context.ChartFilters.Add(chartFilter);
                    await _context.SaveChangesAsync();

                    // Add filter indicators
                    foreach (var indicatorId in filter.IndicatorIds)
                    {
                        var filterIndicator = new ChartFilterIndicator
                        {
                            FilterId = chartFilter.FilterId,
                            IndicatorId = indicatorId
                        };
                        _context.ChartFilterIndicators.Add(filterIndicator);
                    }
                }

                // Add groups
                foreach (var group in request.Groups)
                {
                    var chartGroup = new ChartGroup
                    {
                        ChartId = chart.ChartId,
                        GroupName = group.GroupName,
                        Description = group.Description,
                        DisplayOrder = group.DisplayOrder,
                        Color = group.Color
                    };
                    _context.ChartGroups.Add(chartGroup);
                    await _context.SaveChangesAsync();

                    // Add group indicators
                    foreach (var indicatorId in group.IndicatorIds)
                    {
                        var groupIndicator = new ChartGroupIndicator
                        {
                            GroupId = chartGroup.GroupId,
                            IndicatorId = indicatorId,
                            DisplayOrder = group.IndicatorIds.IndexOf(indicatorId)
                        };
                        _context.ChartGroupIndicators.Add(groupIndicator);
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return chart.ChartId;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> UpdateChartAsync(int chartId, UpdateChartRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var chart = await _context.Charts
                    .Include(c => c.ChartIndicators)
                    .Include(c => c.ChartFilters)
                        .ThenInclude(cf => cf.ChartFilterIndicators)
                    .Include(c => c.ChartGroups)
                        .ThenInclude(cg => cg.ChartGroupIndicators)
                    .FirstOrDefaultAsync(c => c.ChartId == chartId);

                if (chart == null) return false;

                // Update chart properties
                chart.ChartName = request.ChartName;
                chart.ChartType = request.ChartType;
                chart.Title = request.Title;
                chart.Subtitle = request.Subtitle;
                chart.Description = request.Description;
                chart.DisplayOrder = request.DisplayOrder;
                chart.IsActive = request.IsActive;
                chart.ShowHistoricalData = request.ShowHistoricalData;
                chart.HistoricalDataDisplayType = request.HistoricalDataDisplayType;
                chart.ShowHistoricalInChart = request.ShowHistoricalInChart;
                chart.HistoricalPeriodCount = request.HistoricalPeriodCount;
                chart.UpdatedAt = DateTime.UtcNow;

                // Remove existing relations
                _context.ChartIndicators.RemoveRange(chart.ChartIndicators);
                _context.ChartFilterIndicators.RemoveRange(chart.ChartFilters.SelectMany(cf => cf.ChartFilterIndicators));
                _context.ChartFilters.RemoveRange(chart.ChartFilters);
                _context.ChartGroupIndicators.RemoveRange(chart.ChartGroups.SelectMany(cg => cg.ChartGroupIndicators));
                _context.ChartGroups.RemoveRange(chart.ChartGroups);

                await _context.SaveChangesAsync();

                // Add new indicators
                foreach (var indicator in request.Indicators)
                {
                    var chartIndicator = new ChartIndicator
                    {
                        ChartId = chart.ChartId,
                        IndicatorId = indicator.IndicatorId,
                        DisplayOrder = indicator.DisplayOrder,
                        Color = indicator.Color,
                        Label = indicator.Label,
                        IsVisible = indicator.IsVisible
                    };
                    _context.ChartIndicators.Add(chartIndicator);
                }

                // Add new filters
                foreach (var filter in request.Filters)
                {
                    var chartFilter = new ChartFilter
                    {
                        ChartId = chart.ChartId,
                        FilterName = filter.FilterName,
                        FilterType = filter.FilterType,
                        FilterValue = filter.FilterValue,
                        IsDefault = filter.IsDefault,
                        DisplayOrder = filter.DisplayOrder
                    };
                    _context.ChartFilters.Add(chartFilter);
                    await _context.SaveChangesAsync();

                    // Add filter indicators
                    foreach (var indicatorId in filter.IndicatorIds)
                    {
                        var filterIndicator = new ChartFilterIndicator
                        {
                            FilterId = chartFilter.FilterId,
                            IndicatorId = indicatorId
                        };
                        _context.ChartFilterIndicators.Add(filterIndicator);
                    }
                }

                // Add new groups
                foreach (var group in request.Groups)
                {
                    var chartGroup = new ChartGroup
                    {
                        ChartId = chart.ChartId,
                        GroupName = group.GroupName,
                        Description = group.Description,
                        DisplayOrder = group.DisplayOrder,
                        Color = group.Color
                    };
                    _context.ChartGroups.Add(chartGroup);
                    await _context.SaveChangesAsync();

                    // Add group indicators
                    foreach (var indicatorId in group.IndicatorIds)
                    {
                        var groupIndicator = new ChartGroupIndicator
                        {
                            GroupId = chartGroup.GroupId,
                            IndicatorId = indicatorId,
                            DisplayOrder = group.IndicatorIds.IndexOf(indicatorId)
                        };
                        _context.ChartGroupIndicators.Add(groupIndicator);
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> DeleteChartAsync(int chartId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var chart = await _context.Charts
                    .Include(c => c.ChartIndicators)
                    .Include(c => c.ChartFilters)
                        .ThenInclude(cf => cf.ChartFilterIndicators)
                    .Include(c => c.ChartGroups)
                        .ThenInclude(cg => cg.ChartGroupIndicators)
                    .FirstOrDefaultAsync(c => c.ChartId == chartId);

                if (chart == null) return false;

                // İlk olarak ilişkili tabloları sil
                // Chart Filter Indicators
                var filterIndicators = chart.ChartFilters.SelectMany(cf => cf.ChartFilterIndicators);
                _context.ChartFilterIndicators.RemoveRange(filterIndicators);

                // Chart Group Indicators
                var groupIndicators = chart.ChartGroups.SelectMany(cg => cg.ChartGroupIndicators);
                _context.ChartGroupIndicators.RemoveRange(groupIndicators);

                // Chart Indicators
                _context.ChartIndicators.RemoveRange(chart.ChartIndicators);

                // Chart Filters
                _context.ChartFilters.RemoveRange(chart.ChartFilters);

                // Chart Groups
                _context.ChartGroups.RemoveRange(chart.ChartGroups);

                // Son olarak Chart'ı sil
                _context.Charts.Remove(chart);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        #endregion

        #region Chart Data

        public async Task<ChartDataResponseDto> GetChartDataAsync(ChartDataRequest request)
        {
            var chart = await _context.Charts
                .Include(c => c.ChartIndicators)
                    .ThenInclude(ci => ci.Indicator)
                        .ThenInclude(i => i.Data)
                .Include(c => c.ChartFilters)
                    .ThenInclude(cf => cf.ChartFilterIndicators)
                .Include(c => c.ChartGroups)
                    .ThenInclude(cg => cg.ChartGroupIndicators)
                .FirstOrDefaultAsync(c => c.ChartId == request.ChartId && c.IsActive);

            if (chart == null)
                return new ChartDataResponseDto();

            var response = new ChartDataResponseDto
            {
                ChartTitle = chart.Title,
                ChartType = chart.ChartType.ToString(),
                CurrentData = new List<ChartDataDto>(),
                HistoricalData = new List<ChartHistoricalDataDto>(),
                ChartOptions = new Dictionary<string, object>()
            };

            // Get indicators to display based on filter
            var indicatorsToShow = chart.ChartIndicators.AsQueryable();

            if (request.FilterId.HasValue)
            {
                var filter = chart.ChartFilters.FirstOrDefault(f => f.FilterId == request.FilterId.Value);
                if (filter != null)
                {
                    var filterIndicatorIds = filter.ChartFilterIndicators.Select(cfi => cfi.IndicatorId).ToList();
                    indicatorsToShow = indicatorsToShow.Where(ci => filterIndicatorIds.Contains(ci.IndicatorId));
                }
            }

            // Build current data
            foreach (var chartIndicator in indicatorsToShow.OrderBy(ci => ci.DisplayOrder))
            {
                // ShowHistoricalInChart true ise geçmiş dönemleri de dahil et
                if (chart.ShowHistoricalInChart && chart.HistoricalPeriodCount.HasValue)
                {
                    // Geçmiş dönemler dahil olmak üzere veri topla
                    var historicalPeriodCount = chart.HistoricalPeriodCount.Value;
                    
                    // Son N dönemin verilerini getir
                    var historicalData = chartIndicator.Indicator.Data
                        .Where(d => d.Status == DataStatus.Approved)
                        .OrderByDescending(d => d.Year)
                        .ThenByDescending(d => d.Period)
                        .Take(historicalPeriodCount)
                        .OrderBy(d => d.Year)
                        .ThenBy(d => d.Period)
                        .ToList();

                    // Her dönem için ayrı data point oluştur
                    for (int i = 0; i < historicalData.Count; i++)
                    {
                        var data = historicalData[i];
                        string periodLabel;
                        
                        if (i == historicalData.Count - 1)
                        {
                            periodLabel = "Güncel Dönem";
                        }
                        else
                        {
                            var periodsBack = historicalData.Count - 1 - i;
                            periodLabel = $"Geçmiş {periodsBack}. Dönem";
                        }

                        response.CurrentData.Add(new ChartDataDto
                        {
                            Label = $"{chartIndicator.Label ?? chartIndicator.Indicator.IndicatorName} - {periodLabel}",
                            Value = data.Value ?? 0,
                            Color = chartIndicator.Color,
                            Unit = chartIndicator.Indicator.DataType.ToString(),
                            AdditionalData = new Dictionary<string, object>
                            {
                                { "IndicatorCode", chartIndicator.Indicator.IndicatorCode },
                                { "IndicatorId", chartIndicator.IndicatorId },
                                { "Year", data.Year },
                                { "Period", data.Period },
                                { "PeriodLabel", periodLabel },
                                { "IsHistorical", i < historicalData.Count - 1 }
                            }
                        });
                    }
                }
                else
                {
                    // Sadece güncel dönem verisi
                    // Try to get latest data for the specified year and period first
                    var latestData = chartIndicator.Indicator.Data
                        .Where(d => d.Year == request.Year && d.Period == request.Period && d.Status == DataStatus.Approved)
                        .FirstOrDefault();

                    // If no data found for specific year/period, try to get the most recent approved data
                    if (latestData == null)
                    {
                        latestData = chartIndicator.Indicator.Data
                            .Where(d => d.Status == DataStatus.Approved)
                            .OrderByDescending(d => d.Year)
                            .ThenByDescending(d => d.Period)
                            .FirstOrDefault();
                    }

                    if (latestData != null)
                    {
                        response.CurrentData.Add(new ChartDataDto
                        {
                            Label = chartIndicator.Label ?? chartIndicator.Indicator.IndicatorName,
                            Value = latestData.Value ?? 0,
                            Color = chartIndicator.Color,
                            Unit = chartIndicator.Indicator.DataType.ToString(),
                            AdditionalData = new Dictionary<string, object>
                            {
                                { "IndicatorCode", chartIndicator.Indicator.IndicatorCode },
                                { "IndicatorId", chartIndicator.IndicatorId },
                                { "Year", latestData.Year },
                                { "Period", latestData.Period }
                            }
                        });
                    }
                }
            }

            // Calculate percentages for pie charts
            if (chart.ChartType == ChartType.Pie && response.CurrentData.Any())
            {
                var total = response.CurrentData.Sum(d => d.Value);
                if (total > 0)
                {
                    foreach (var data in response.CurrentData)
                    {
                        data.Percentage = Math.Round((data.Value / total) * 100, 2);
                    }
                }
            }

            // Get historical data if requested
            if (request.IncludeHistoricalData && chart.ShowHistoricalData)
            {
                response.HistoricalData = await GetChartHistoricalDataAsync(request.ChartId, request.FilterId);
            }

            return response;
        }

        public async Task<List<ChartHistoricalDataDto>> GetChartHistoricalDataAsync(int chartId, int? filterId = null)
        {
            var chart = await _context.Charts
                .Include(c => c.ChartIndicators)
                    .ThenInclude(ci => ci.Indicator)
                        .ThenInclude(i => i.HistoricalData)
                .FirstOrDefaultAsync(c => c.ChartId == chartId);

            if (chart == null) return new List<ChartHistoricalDataDto>();

            var historicalData = new List<ChartHistoricalDataDto>();

            // Get historical data from IndicatorHistoricalData table
            foreach (var chartIndicator in chart.ChartIndicators.OrderBy(ci => ci.DisplayOrder))
            {
                var indicatorHistoricalData = chartIndicator.Indicator.HistoricalData
                    .OrderBy(hd => hd.PeriodLabel)
                    .ToList();

                foreach (var histData in indicatorHistoricalData)
                {
                    var existingPeriod = historicalData.FirstOrDefault(hd => hd.PeriodLabel == histData.PeriodLabel);
                    if (existingPeriod == null)
                    {
                        existingPeriod = new ChartHistoricalDataDto
                        {
                            PeriodLabel = histData.PeriodLabel,
                            Data = new List<ChartDataDto>()
                        };
                        historicalData.Add(existingPeriod);
                    }

                    existingPeriod.Data.Add(new ChartDataDto
                    {
                        Label = chartIndicator.Label ?? chartIndicator.Indicator.IndicatorName,
                        Value = histData.Value,
                        Color = chartIndicator.Color,
                        Unit = chartIndicator.Indicator.DataType.ToString()
                    });
                }
            }

            return historicalData;
        }

        #endregion

        #region Utility Methods

        public async Task<List<string>> GetSupportedChartTypesAsync()
        {
            return await Task.FromResult(Enum.GetNames(typeof(ChartType)).ToList());
        }

        public async Task<bool> ValidateChartConfigurationAsync(int chartId)
        {
            var chart = await _context.Charts
                .Include(c => c.ChartIndicators)
                .FirstOrDefaultAsync(c => c.ChartId == chartId);

            if (chart == null) return false;

            // Basic validation rules
            if (!chart.ChartIndicators.Any()) return false;

            // Chart type specific validations
            switch (chart.ChartType)
            {
                case ChartType.Pie:
                    // Pie charts should have at least 2 segments
                    return chart.ChartIndicators.Count >= 2;
                case ChartType.Column:
                case ChartType.Combo:
                case ChartType.Difference:
                    return chart.ChartIndicators.Any();
                default:
                    return true;
            }
        }

        #endregion
    }
}

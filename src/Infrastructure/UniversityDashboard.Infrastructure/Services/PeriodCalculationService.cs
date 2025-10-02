using UniversityDashBoardProject.Domain.Enums;
using UniversityDashBoardProject.Domain.Services;
using Serilog;

namespace UniversityDashBoardProject.Infrastructure.Services
{
    public class PeriodCalculationService : IPeriodCalculationService
    {
        private readonly Serilog.ILogger _logger = Log.ForContext<PeriodCalculationService>();
        public (int year, int period) GetNextDataEntryPeriod(DateTime periodStartDate, PeriodType periodType, int currentYear, int currentPeriod)
        {
            _logger.Debug("Calculating next data entry period for PeriodType: {PeriodType}, CurrentYear: {CurrentYear}, CurrentPeriod: {CurrentPeriod}", 
                periodType, currentYear, currentPeriod);
            
            var startYear = periodStartDate.Year;
            var startPeriod = GetPeriodFromDateTime(periodStartDate, periodType);
            
            // Çeyrek bazında hesaplama yapıyoruz (her zaman 4 çeyrek var)
            var startQuarter = GetQuarterFromDateTime(periodStartDate);
            var currentQuarter = GetQuarterFromYearAndPeriod(currentYear, currentPeriod);
            
            // Başlangıç çeyreğinden itibaren kaç çeyrek geçtiğini hesapla
            var totalQuartersPassed = (currentYear - startYear) * 4 + (currentQuarter - startQuarter);
            
            // Periyot tipine göre bir sonraki veri giriş çeyreğini hesapla
            var nextDataEntryInterval = GetDataEntryInterval(periodType);
            var nextDataEntryQuarterIndex = ((totalQuartersPassed / nextDataEntryInterval) + 1) * nextDataEntryInterval;
            
            var nextYear = startYear + (startQuarter - 1 + nextDataEntryQuarterIndex) / 4;
            var nextQuarter = ((startQuarter - 1 + nextDataEntryQuarterIndex) % 4) + 1;
            
            // Çeyrek numarasını periyot numarasına çevir
            var nextPeriod = GetPeriodFromQuarter(nextQuarter, periodType);
            
            _logger.Debug("Next data entry period calculated: Year: {NextYear}, Period: {NextPeriod}", nextYear, nextPeriod);
            return (nextYear, nextPeriod);
        }
        
        public bool IsDataEntryAllowed(DateTime periodStartDate, PeriodType periodType, int targetYear, int targetPeriod)
        {
            _logger.Debug("Checking if data entry is allowed for PeriodType: {PeriodType}, TargetYear: {TargetYear}, TargetPeriod: {TargetPeriod}", 
                periodType, targetYear, targetPeriod);
            
            var startYear = periodStartDate.Year;
            var startQuarter = GetQuarterFromDateTime(periodStartDate);
            var targetQuarter = GetQuarterFromYearAndPeriod(targetYear, targetPeriod);
            
            // Başlangıç çeyreğinden itibaren kaç çeyrek geçtiğini hesapla
            var totalQuartersPassed = (targetYear - startYear) * 4 + (targetQuarter - startQuarter);
            
            if (totalQuartersPassed < 0) 
            {
                _logger.Debug("Data entry not allowed: Target period is before start period");
                return false;
            }
            
            // Veri giriş aralığını al (çeyrek bazında)
            var dataEntryInterval = GetDataEntryInterval(periodType);
            
            // Bu periyotta veri girişi yapılabilir mi kontrol et
            var isAllowed = totalQuartersPassed % dataEntryInterval == 0;
            _logger.Debug("Data entry allowed: {IsAllowed} for PeriodType: {PeriodType}", isAllowed, periodType);
            return isAllowed;
        }
        
        public int GetPeriodsPerYear(PeriodType periodType)
        {
            return periodType switch
            {
                PeriodType.Quarter => 4,   // Çeyrek yılda bir
                PeriodType.HalfYear => 2,  // Yarı yılda bir  
                PeriodType.Year => 1,      // Yılda bir
                PeriodType.TwoYear => 1,   // İki yılda bir (yıl bazında hesap)
                _ => 4
            };
        }
        
        public (int year, int period) GetLastDataEntryPeriod(DateTime periodStartDate, PeriodType periodType, DateTime currentDate)
        {
            var currentYear = currentDate.Year;
            var currentQuarter = GetQuarterFromDateTime(currentDate);
            var startYear = periodStartDate.Year;
            var startQuarter = GetQuarterFromDateTime(periodStartDate);
            
            // Başlangıçtan şu ana kadar geçen toplam çeyrek sayısı
            var totalQuartersPassed = (currentYear - startYear) * 4 + (currentQuarter - startQuarter);
            
            if (totalQuartersPassed < 0) return (startYear, GetPeriodFromQuarter(startQuarter, periodType));
            
            var dataEntryInterval = GetDataEntryInterval(periodType);
            
            // Son veri giriş çeyreğini bul
            var lastDataEntryQuarterIndex = (totalQuartersPassed / dataEntryInterval) * dataEntryInterval;
            
            var lastYear = startYear + (startQuarter - 1 + lastDataEntryQuarterIndex) / 4;
            var lastQuarter = ((startQuarter - 1 + lastDataEntryQuarterIndex) % 4) + 1;
            
            var lastPeriod = GetPeriodFromQuarter(lastQuarter, periodType);
            
            return (lastYear, lastPeriod);
        }
        
        /// <summary>
        /// Periyot tipine göre veri giriş aralığını döner (kaç periyotta bir veri girişi yapılacak)
        /// </summary>
        private int GetDataEntryInterval(PeriodType periodType)
        {
            return periodType switch
            {
                PeriodType.Quarter => 1,   // Her çeyrek veri girişi
                PeriodType.HalfYear => 2,  // 2 çeyrekte bir veri girişi (6 ayda bir)
                PeriodType.Year => 4,      // 4 çeyrekte bir veri girişi (yılda bir)
                PeriodType.TwoYear => 8,   // 8 çeyrekte bir veri girişi (2 yılda bir)
                _ => 1
            };
        }
        
        /// <summary>
        /// Tarihten periyot numarasını çıkarır
        /// </summary>
        private int GetPeriodFromDateTime(DateTime date, PeriodType periodType)
        {
            return periodType switch
            {
                PeriodType.Quarter or PeriodType.HalfYear or PeriodType.Year or PeriodType.TwoYear => 
                    (date.Month - 1) / 3 + 1, // Çeyrek bazında hesaplama (1-4)
                _ => 1
            };
        }
        
        /// <summary>
        /// Tarihten çeyrek numarasını çıkarır (1-4)
        /// </summary>
        private int GetQuarterFromDateTime(DateTime date)
        {
            return (date.Month - 1) / 3 + 1;
        }
        
        /// <summary>
        /// Yıl ve periyot numarasından çeyrek numarasını hesaplar
        /// </summary>
        private int GetQuarterFromYearAndPeriod(int year, int period)
        {
            // Periyot numarası zaten çeyrek numarası olarak kabul ediliyor
            return period;
        }
        
        /// <summary>
        /// Çeyrek numarasını periyot tipine göre periyot numarasına çevirir
        /// </summary>
        private int GetPeriodFromQuarter(int quarter, PeriodType periodType)
        {
            return periodType switch
            {
                PeriodType.Quarter => quarter, // Çeyrek yılda bir - çeyrek numarası = periyot numarası
                PeriodType.HalfYear => quarter <= 2 ? 1 : 2, // Yarı yılda bir - 1-2. çeyrek = 1. periyot, 3-4. çeyrek = 2. periyot
                PeriodType.Year => 1, // Yılda bir - her zaman 1. periyot
                PeriodType.TwoYear => 1, // İki yılda bir - her zaman 1. periyot
                _ => quarter
            };
        }
    }
}

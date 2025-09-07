using UniversityDashBoardProject.Domain.Enums;
using UniversityDashBoardProject.Domain.Services;

namespace UniversityDashBoardProject.Infrastructure.Services
{
    public class PeriodCalculationService : IPeriodCalculationService
    {
        public (int year, int period) GetNextDataEntryPeriod(DateTime periodStartDate, PeriodType periodType, int currentYear, int currentPeriod)
        {
            var periodsPerYear = GetPeriodsPerYear(periodType);
            var startYear = periodStartDate.Year;
            var startPeriod = GetPeriodFromDateTime(periodStartDate, periodType);
            
            // Başlangıç periyodundan itibaren kaç periyot geçtiğini hesapla
            var totalPeriodsPassed = (currentYear - startYear) * periodsPerYear + (currentPeriod - startPeriod);
            
            // Periyot tipine göre bir sonraki veri giriş periyodunu hesapla
            var nextDataEntryInterval = GetDataEntryInterval(periodType);
            var nextDataEntryPeriodIndex = ((totalPeriodsPassed / nextDataEntryInterval) + 1) * nextDataEntryInterval;
            
            var nextYear = startYear + (startPeriod - 1 + nextDataEntryPeriodIndex) / periodsPerYear;
            var nextPeriod = ((startPeriod - 1 + nextDataEntryPeriodIndex) % periodsPerYear) + 1;
            
            return (nextYear, nextPeriod);
        }
        
        public bool IsDataEntryAllowed(DateTime periodStartDate, PeriodType periodType, int targetYear, int targetPeriod)
        {
            var startYear = periodStartDate.Year;
            var startPeriod = GetPeriodFromDateTime(periodStartDate, periodType);
            var periodsPerYear = GetPeriodsPerYear(periodType);
            
            // Başlangıç periyodundan itibaren kaç periyot geçtiğini hesapla
            var totalPeriodsPassed = (targetYear - startYear) * periodsPerYear + (targetPeriod - startPeriod);
            
            if (totalPeriodsPassed < 0) return false;
            
            // Veri giriş aralığını al
            var dataEntryInterval = GetDataEntryInterval(periodType);
            
            // Bu periyotta veri girişi yapılabilir mi kontrol et
            return totalPeriodsPassed % dataEntryInterval == 0;
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
            var currentPeriod = GetPeriodFromDateTime(currentDate, periodType);
            var startYear = periodStartDate.Year;
            var startPeriod = GetPeriodFromDateTime(periodStartDate, periodType);
            var periodsPerYear = GetPeriodsPerYear(periodType);
            
            // Başlangıçtan şu ana kadar geçen toplam periyot sayısı
            var totalPeriodsPassed = (currentYear - startYear) * periodsPerYear + (currentPeriod - startPeriod);
            
            if (totalPeriodsPassed < 0) return (startYear, startPeriod);
            
            var dataEntryInterval = GetDataEntryInterval(periodType);
            
            // Son veri giriş periyodunu bul
            var lastDataEntryPeriodIndex = (totalPeriodsPassed / dataEntryInterval) * dataEntryInterval;
            
            var lastYear = startYear + (startPeriod - 1 + lastDataEntryPeriodIndex) / periodsPerYear;
            var lastPeriod = ((startPeriod - 1 + lastDataEntryPeriodIndex) % periodsPerYear) + 1;
            
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
    }
}

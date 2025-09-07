using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Domain.Services
{
    public interface IPeriodCalculationService
    {
        /// <summary>
        /// Göstergenin bir sonraki veri giriş periyodunu hesaplar
        /// </summary>
        (int year, int period) GetNextDataEntryPeriod(DateTime periodStartDate, PeriodType periodType, int currentYear, int currentPeriod);
        
        /// <summary>
        /// Belirli bir yıl ve periyotta göstergenin veri girişi yapılıp yapılamayacağını kontrol eder
        /// </summary>
        bool IsDataEntryAllowed(DateTime periodStartDate, PeriodType periodType, int targetYear, int targetPeriod);
        
        /// <summary>
        /// Periyot tipine göre bir yılda kaç periyot olduğunu döner
        /// </summary>
        int GetPeriodsPerYear(PeriodType periodType);
        
        /// <summary>
        /// Göstergenin son veri giriş periyodunu bulur
        /// </summary>
        (int year, int period) GetLastDataEntryPeriod(DateTime periodStartDate, PeriodType periodType, DateTime currentDate);
    }
}

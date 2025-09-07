import apiClient from './api/apiClient';

export const periodService = {
  // Get available periods for a specific indicator
  getIndicatorPeriods: async (indicatorId) => {
    try {
      const response = await apiClient.get(`/Indicator/periods/${indicatorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching indicator periods:', error);
      throw error;
    }
  },

  // Get current period based on date
  getCurrentPeriod: (date = new Date()) => {
    const year = date.getFullYear();
    const period = Math.floor((date.getMonth()) / 3) + 1; // Quarter calculation
    return { year, period };
  },

  // Format period for display
  formatPeriod: (year, period, periodType) => {
    const periodNames = {
      Quarter: [`${year} Q${period}`, `${year} ${period}. Çeyrek`],
      HalfYear: [`${year} H${Math.ceil(period/2)}`, `${year} ${Math.ceil(period/2)}. Yarıyıl`],
      Year: [`${year}`, `${year} Yılı`],
      TwoYear: [`${year}-${year+1}`, `${year}-${year+1} Dönemi`]
    };
    
    return periodNames[periodType] || [`${year}-P${period}`, `${year} ${period}. Periyot`];
  },

  // Get period label for dropdown
  getPeriodLabel: (year, period, periodType) => {
    const [, longLabel] = periodService.formatPeriod(year, period, periodType);
    return longLabel;
  },

  // Generate available periods for dropdown
  generateAvailablePeriods: (startYear, endYear, periodType) => {
    const periods = [];
    const periodsPerYear = {
      Quarter: 4,
      HalfYear: 2, 
      Year: 1,
      TwoYear: 1
    };

    const perYear = periodsPerYear[periodType] || 4;
    
    for (let year = startYear; year <= endYear; year++) {
      for (let period = 1; period <= perYear; period++) {
        periods.push({
          year,
          period,
          label: periodService.getPeriodLabel(year, period, periodType),
          value: `${year}-${period}`
        });
      }
    }

    return periods;
  }
};

export default periodService;

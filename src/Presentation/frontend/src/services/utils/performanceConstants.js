// Performance System Constants

export const TARGET_STATUS = {
  DRAFT: 1,
  SUBMITTED: 2,
  APPROVED: 3,
  REJECTED: 4,
  PROGRESS_DRAFT: 5,
  PROGRESS_SUBMITTED: 6,
  PROGRESS_APPROVED: 7,
  PROGRESS_REJECTED: 8
};

export const PROGRESS_STATUS = {
  DRAFT: 1,
  SUBMITTED: 2,
  APPROVED: 3,
  REJECTED: 4
};

export const TARGET_DIRECTION = {
  POSITIVE: 1,
  NEGATIVE: 2
};

export const ASSIGNMENT_TYPE = {
  DEPARTMENT: 1,
  USER: 2
};

export const getTargetStatusText = (status) => {
  const statusMap = {
    [TARGET_STATUS.DRAFT]: 'Taslak',
    [TARGET_STATUS.SUBMITTED]: 'Gönderildi',
    [TARGET_STATUS.APPROVED]: 'Onaylandı',
    [TARGET_STATUS.REJECTED]: 'Reddedildi',
    [TARGET_STATUS.PROGRESS_DRAFT]: 'Gerçekleşme Taslak',
    [TARGET_STATUS.PROGRESS_SUBMITTED]: 'Gerçekleşme Gönderildi',
    [TARGET_STATUS.PROGRESS_APPROVED]: 'Gerçekleşme Onaylandı',
    [TARGET_STATUS.PROGRESS_REJECTED]: 'Gerçekleşme Reddedildi'
  };
  return statusMap[status] || 'Bilinmiyor';
};

export const getProgressStatusText = (status) => {
  const statusMap = {
    [PROGRESS_STATUS.DRAFT]: 'Taslak',
    [PROGRESS_STATUS.SUBMITTED]: 'Gönderildi',
    [PROGRESS_STATUS.APPROVED]: 'Onaylandı',
    [PROGRESS_STATUS.REJECTED]: 'Reddedildi'
  };
  return statusMap[status] || 'Bilinmiyor';
};

export const getTargetDirectionText = (direction) => {
  const directionMap = {
    [TARGET_DIRECTION.POSITIVE]: 'Pozitif',
    [TARGET_DIRECTION.NEGATIVE]: 'Negatif'
  };
  return directionMap[direction] || 'Bilinmiyor';
};

export const getAssignmentTypeText = (type) => {
  const typeMap = {
    [ASSIGNMENT_TYPE.DEPARTMENT]: 'Departman',
    [ASSIGNMENT_TYPE.USER]: 'Kullanıcı'
  };
  return typeMap[type] || 'Bilinmiyor';
};

export const getTargetStatusBadgeClass = (status) => {
  const classMap = {
    [TARGET_STATUS.DRAFT]: 'badge-secondary',
    [TARGET_STATUS.SUBMITTED]: 'badge-info',
    [TARGET_STATUS.APPROVED]: 'badge-success',
    [TARGET_STATUS.REJECTED]: 'badge-danger',
    [TARGET_STATUS.PROGRESS_DRAFT]: 'badge-warning',
    [TARGET_STATUS.PROGRESS_SUBMITTED]: 'badge-primary',
    [TARGET_STATUS.PROGRESS_APPROVED]: 'badge-success',
    [TARGET_STATUS.PROGRESS_REJECTED]: 'badge-danger'
  };
  return classMap[status] || 'badge-secondary';
};

export const getProgressStatusBadgeClass = (status) => {
  const classMap = {
    [PROGRESS_STATUS.DRAFT]: 'badge-secondary',
    [PROGRESS_STATUS.SUBMITTED]: 'badge-info',
    [PROGRESS_STATUS.APPROVED]: 'badge-success',
    [PROGRESS_STATUS.REJECTED]: 'badge-danger'
  };
  return classMap[status] || 'badge-secondary';
};

export const getTargetDirectionBadgeClass = (direction) => {
  const classMap = {
    [TARGET_DIRECTION.POSITIVE]: 'badge-success',
    [TARGET_DIRECTION.NEGATIVE]: 'badge-warning'
  };
  return classMap[direction] || 'badge-secondary';
};

export const formatCompletionRate = (rate) => {
  if (rate === null || rate === undefined) return 'N/A';
  return `${rate.toFixed(2)}%`;
};

export const formatScore = (score) => {
  if (score === null || score === undefined) return 'N/A';
  return score.toFixed(2);
};

export const formatWeight = (weight) => {
  if (weight === null || weight === undefined) return 'N/A';
  return `${weight.toFixed(2)}%`;
};

export const formatContributionPercentage = (percentage) => {
  if (percentage === null || percentage === undefined) return 'N/A';
  return `${percentage.toFixed(2)}%`;
};

export const validatePerformancePeriod = (period) => {
  const errors = [];

  if (!period.periodName || period.periodName.trim() === '') {
    errors.push('Performans dönemi adı gereklidir.');
  }

  if (!period.targetEntryStartDate) {
    errors.push('Hedef giriş başlangıç tarihi gereklidir.');
  }

  if (!period.targetEntryEndDate) {
    errors.push('Hedef giriş bitiş tarihi gereklidir.');
  }

  if (!period.targetReviseStartDate) {
    errors.push('Hedef revize başlangıç tarihi gereklidir.');
  }

  if (!period.targetReviseEndDate) {
    errors.push('Hedef revize bitiş tarihi gereklidir.');
  }

  if (!period.resultEntryStartDate) {
    errors.push('Sonuç giriş başlangıç tarihi gereklidir.');
  }

  if (!period.resultEntryEndDate) {
    errors.push('Sonuç giriş bitiş tarihi gereklidir.');
  }

  if (period.targetEntryStartDate && period.targetEntryEndDate && 
      period.targetEntryStartDate >= period.targetEntryEndDate) {
    errors.push('Hedef giriş başlangıç tarihi bitiş tarihinden önce olmalıdır.');
  }

  if (period.targetReviseStartDate && period.targetReviseEndDate && 
      period.targetReviseStartDate >= period.targetReviseEndDate) {
    errors.push('Hedef revize başlangıç tarihi bitiş tarihinden önce olmalıdır.');
  }

  if (period.resultEntryStartDate && period.resultEntryEndDate && 
      period.resultEntryStartDate >= period.resultEntryEndDate) {
    errors.push('Sonuç giriş başlangıç tarihi bitiş tarihinden önce olmalıdır.');
  }

  return errors;
};

export const validatePerformanceTarget = (target) => {
  const errors = [];

  if (!target.targetName || target.targetName.trim() === '') {
    errors.push('Hedef adı gereklidir.');
  }

  if (!target.targetValue || target.targetValue <= 0) {
    errors.push('Hedef değeri 0\'dan büyük olmalıdır.');
  }

  if (!target.unit || target.unit.trim() === '') {
    errors.push('Hedef birimi gereklidir.');
  }

  if (!target.weight || target.weight <= 0) {
    errors.push('Hedef ağırlığı 0\'dan büyük olmalıdır.');
  }

  if (target.weight > 100) {
    errors.push('Hedef ağırlığı 100\'den büyük olamaz.');
  }

  return errors;
};

export const validatePerformanceScoring = (scoring) => {
  const errors = [];

  if (scoring.minValue === null || scoring.minValue === undefined) {
    errors.push('Minimum değer gereklidir.');
  }

  if (scoring.maxValue !== null && scoring.maxValue !== undefined && 
      scoring.maxValue <= scoring.minValue) {
    errors.push('Maksimum değer minimum değerden büyük olmalıdır.');
  }

  if (!scoring.score || scoring.score < 0) {
    errors.push('Puan 0\'dan küçük olamaz.');
  }

  if (!scoring.letterGrade || scoring.letterGrade.trim() === '') {
    errors.push('Harf notu gereklidir.');
  }

  return errors;
};

export const calculateCompletionRate = (actualValue, targetValue, direction = 'positive') => {
  if (!targetValue || targetValue === 0) return 0;
  
  if (direction === 'positive' || direction === 1) {
    // Pozitif hedefler için: (actual / target) * 100
    return (actualValue / targetValue) * 100;
  } else {
    // Negatif hedefler için: (target - actual) / target * 100
    // Örnek: Hedef 100'den 20'ye düşürmek, 80% başarı = (100-20)/100 * 100 = 80%
    return ((targetValue - actualValue) / targetValue) * 100;
  }
};

export const calculateScore = (completionRate, scorings, isNegativeTarget = false) => {
  if (!scorings || scorings.length === 0) return 0;

  const applicableScorings = scorings.filter(s => s.isForNegativeTarget === isNegativeTarget);
  if (applicableScorings.length === 0) return 0;

  const scoring = applicableScorings.find(s => {
    const meetsMin = completionRate >= s.minValue;
    const meetsMax = s.maxValue === null || completionRate <= s.maxValue;
    return meetsMin && meetsMax;
  });

  return scoring ? scoring.score : 0;
};

export const getLetterGrade = (score, scorings, isNegativeTarget = false) => {
  if (!scorings || scorings.length === 0) return '';

  const applicableScorings = scorings.filter(s => s.isForNegativeTarget === isNegativeTarget);
  if (applicableScorings.length === 0) return '';

  const scoring = applicableScorings.find(s => score >= s.score);
  return scoring ? scoring.letterGrade : '';
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('tr-TR');
};

export const isDateInRange = (date, startDate, endDate) => {
  if (!date || !startDate || !endDate) return false;
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return d >= start && d <= end;
};

export const canEditTarget = (target, currentDate) => {
  if (!target || !target.period) return false;
  
  const now = new Date(currentDate);
  const reviseStart = new Date(target.period.targetReviseStartDate);
  const reviseEnd = new Date(target.period.targetReviseEndDate);
  
  return now >= reviseStart && now <= reviseEnd;
};

export const canSubmitProgress = (target, currentDate) => {
  if (!target || !target.period) return false;
  
  const now = new Date(currentDate);
  const resultStart = new Date(target.period.resultEntryStartDate);
  const resultEnd = new Date(target.period.resultEntryEndDate);
  
  return now >= resultStart && now <= resultEnd;
};

export const getPerformancePeriodStatus = (period, currentDate) => {
  if (!period) return 'unknown';
  
  const now = new Date(currentDate);
  const targetEntryStart = new Date(period.targetEntryStartDate);
  const targetEntryEnd = new Date(period.targetEntryEndDate);
  const resultEntryStart = new Date(period.resultEntryStartDate);
  const resultEntryEnd = new Date(period.resultEntryEndDate);
  
  if (now < targetEntryStart) return 'upcoming';
  if (now >= targetEntryStart && now <= targetEntryEnd) return 'target-entry';
  if (now > targetEntryEnd && now < resultEntryStart) return 'target-review';
  if (now >= resultEntryStart && now <= resultEntryEnd) return 'result-entry';
  if (now > resultEntryEnd) return 'completed';
  
  return 'unknown';
};

export const getPerformancePeriodStatusText = (status) => {
  const statusMap = {
    'upcoming': 'Yaklaşan',
    'target-entry': 'Hedef Girişi',
    'target-review': 'Hedef İnceleme',
    'result-entry': 'Sonuç Girişi',
    'completed': 'Tamamlandı',
    'unknown': 'Bilinmiyor'
  };
  return statusMap[status] || 'Bilinmiyor';
};

export const getPerformancePeriodStatusBadgeClass = (status) => {
  const classMap = {
    'upcoming': 'badge-info',
    'target-entry': 'badge-primary',
    'target-review': 'badge-warning',
    'result-entry': 'badge-success',
    'completed': 'badge-secondary',
    'unknown': 'badge-secondary'
  };
  return classMap[status] || 'badge-secondary';
};
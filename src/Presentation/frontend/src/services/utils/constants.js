// Enum değerleri
export const IndicatorDataType = {
    Number: 1,
    Percentage: 2,
    Currency: 3,
    Other: 4
};

export const PeriodType = {
    Quarter: 1,      // Çeyrek yılda bir
    HalfYear: 2,     // Yarı yılda bir
    Year: 3,         // Yılda bir
    TwoYear: 4       // İki yılda bir
};

export const DataStatus = {
    Draft: 1,        // Taslak
    Submitted: 2,    // Gönderildi
    Approved: 3      // Onaylandı
};

// Enum'ları gösterimi için text'e çeviren fonksiyonlar
export const getIndicatorDataTypeText = (type) => {
    switch (type) {
        case IndicatorDataType.Number: return 'Rakam';
        case IndicatorDataType.Percentage: return 'Yüzde';
        case IndicatorDataType.Currency: return 'Parasal';
        case IndicatorDataType.Other: return 'Diğer';
        default: return 'Bilinmiyor';
    }
};

export const getPeriodTypeText = (type) => {
    switch (type) {
        case PeriodType.Quarter: return 'Çeyrek Yılda Bir';
        case PeriodType.HalfYear: return 'Yarı Yılda Bir';
        case PeriodType.Year: return 'Yılda Bir';
        case PeriodType.TwoYear: return 'İki Yılda Bir';
        default: return 'Bilinmiyor';
    }
};

export const getDataStatusText = (status) => {
    switch (status) {
        case DataStatus.Draft: return 'Taslak';
        case DataStatus.Submitted: return 'Gönderildi';
        case DataStatus.Approved: return 'Onaylandı';
        default: return 'Bilinmiyor';
    }
};

export const getDataStatusBadgeClass = (status) => {
    switch (status) {
        case DataStatus.Draft: return 'status-draft';
        case DataStatus.Submitted: return 'status-submitted';
        case DataStatus.Approved: return 'status-approved';
        default: return 'status-unknown';
    }
};

// Tarih formatı
export const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
};

// Para formatı
export const formatCurrency = (amount) => {
    if (amount == null) return '-';
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(amount);
};

// Yüzde formatı
export const formatPercentage = (value) => {
    if (value == null) return '-';
    return `%${value}`;
};

// Değer formatı (tip'e göre)
export const formatValue = (value, dataType) => {
    if (value == null) return '-';
    
    switch (dataType) {
        case IndicatorDataType.Currency:
            return formatCurrency(value);
        case IndicatorDataType.Percentage:
            return formatPercentage(value);
        default:
            return value.toString();
    }
};

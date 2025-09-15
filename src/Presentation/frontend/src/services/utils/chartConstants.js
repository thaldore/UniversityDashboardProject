// Chart Types
export const ChartType = {
    PieChart: 1,
    ColumnChart: 2,
    ComboChart: 3,
    DifferenceChart: 4,
    Column3D: 6,
    Difference3D: 7
};

// Historical Data Display Types
export const HistoricalDataDisplayType = {
    Table: 1,
    ComboChart: 2,
    StackedColumn: 3,
    Column3D: 4
};

// Filter Types
export const FilterType = {
    Single: 1,
    Multiple: 2
};

// Chart constants
export const CHART_COLORS = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'
];

export const getChartTypeText = (type) => {
    switch (type) {
        case ChartType.PieChart:
            return 'Pasta Grafiği';
        case ChartType.ColumnChart:
            return 'Sütun Grafiği';
        case ChartType.ComboChart:
            return 'Kombine Grafik';
        case ChartType.DifferenceChart:
            return 'Fark Grafiği';
        case ChartType.Column3D:
            return '3D Sütun Grafiği';
        case ChartType.Difference3D:
            return '3D Fark Grafiği';
        default:
            return 'Bilinmeyen';
    }
};

export const getHistoricalDataDisplayTypeText = (type) => {
    switch (type) {
        case HistoricalDataDisplayType.Table:
            return 'Tablo';
        case HistoricalDataDisplayType.ComboChart:
            return 'Kombine Grafik';
        case HistoricalDataDisplayType.StackedColumn:
            return 'Yığılmış Sütun';
        case HistoricalDataDisplayType.Column3D:
            return '3D Sütun';
        default:
            return 'Bilinmeyen';
    }
};

export const getFilterTypeText = (type) => {
    switch (type) {
        case FilterType.Single:
            return 'Tekli Seçim';
        case FilterType.Multiple:
            return 'Çoklu Seçim';
        default:
            return 'Bilinmeyen';
    }
};

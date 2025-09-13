import apiClient from './apiClient';

const chartService = {
    // Chart Sections (Başlık Yönetimi)
    getSections: async () => {
        return await apiClient.get('/chart/sections');
    },

    getChartSections: async () => {
        return await apiClient.get('/chart/sections');
    },

    createChartSection: async (data) => {
        return await apiClient.post('/chart/sections', data);
    },

    updateChartSection: async (sectionId, data) => {
        return await apiClient.put(`/chart/sections/${sectionId}`, data);
    },

    deleteChartSection: async (sectionId) => {
        return await apiClient.delete(`/chart/sections/${sectionId}`);
    },

    // Indicators (Göstergeler)
    getIndicators: async () => {
        return await apiClient.get('/chart/indicators');
    },

    // Charts (Grafik Yönetimi)
    getChart: async (chartId) => {
        return await apiClient.get(`/chart/${chartId}`);
    },

    getChartById: async (chartId) => {
        return await apiClient.get(`/chart/${chartId}`);
    },

    getChartsBySection: async (sectionId) => {
        return await apiClient.get(`/chart/section/${sectionId}`);
    },

    getChartData: async (chartId, filterId = null, year, period, includeHistoricalData = true) => {
        const params = new URLSearchParams({
            year: year.toString(),
            period: period.toString(),
            includeHistoricalData: includeHistoricalData.toString()
        });
        
        // Sadece gerçek bir filterId varsa ekle, boş string veya null değil
        if (filterId && filterId !== '' && filterId !== 'null' && filterId !== 'undefined') {
            params.append('filterId', filterId.toString());
        }

        return await apiClient.get(`/chart/${chartId}/data?${params.toString()}`);
    },

    createChart: async (data) => {
        return await apiClient.post('/chart', data);
    },

    updateChart: async (chartId, data) => {
        return await apiClient.put(`/chart/${chartId}`, data);
    },

    deleteChart: async (chartId) => {
        return await apiClient.delete(`/chart/${chartId}`);
    },

    // Chart Filters (Grafik Filtreleri)
    getChartFilters: async (chartId) => {
        return await apiClient.get(`/chart/${chartId}/filters`);
    },

    createChartFilter: async (chartId, data) => {
        return await apiClient.post(`/chart/${chartId}/filters`, data);
    },

    updateChartFilter: async (filterId, data) => {
        return await apiClient.put(`/chart/filters/${filterId}`, data);
    },

    deleteChartFilter: async (filterId) => {
        return await apiClient.delete(`/chart/filters/${filterId}`);
    },

    // Chart Groups (Grafik Grupları)
    getChartGroups: async (chartId) => {
        return await apiClient.get(`/chart/${chartId}/groups`);
    },

    createChartGroup: async (chartId, data) => {
        return await apiClient.post(`/chart/${chartId}/groups`, data);
    },

    updateChartGroup: async (groupId, data) => {
        return await apiClient.put(`/chart/groups/${groupId}`, data);
    },

    deleteChartGroup: async (groupId) => {
        return await apiClient.delete(`/chart/groups/${groupId}`);
    }
};

export default chartService;

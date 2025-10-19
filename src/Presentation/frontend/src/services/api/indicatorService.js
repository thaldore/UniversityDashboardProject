import apiClient from './apiClient.js';

const indicatorService = {
    // Gösterge listesi
    getIndicatorList: async () => {
        const response = await apiClient.get('/indicator');
        return response.data;
    },

    // Gösterge detayı
    getIndicatorById: async (id) => {
        const response = await apiClient.get(`/indicator/${id}`);
        return response.data;
    },

    // Yeni gösterge oluştur
    createIndicator: async (data) => {
        const response = await apiClient.post('/indicator', data);
        return response.data;
    },

    // Gösterge güncelle
    updateIndicator: async (id, data) => {
        const response = await apiClient.put(`/indicator/${id}`, data);
        return response.data;
    },

    // Gösterge durumu değiştir
    toggleIndicatorStatus: async (id, isActive) => {
        const response = await apiClient.patch(`/indicator/${id}/status`, { isActive });
        return response.data;
    },

    // Gösterge sil
    deleteIndicator: async (id) => {
        const response = await apiClient.delete(`/indicator/${id}`);
        return response.data;
    },

    // Göstergeyi kalıcı olarak sil
    permanentDeleteIndicator: async (id) => {
        const response = await apiClient.delete(`/indicator/${id}/permanent`);
        return response.data;
    },

    // Veri giriş formu
    getDataEntryForm: async (year, period) => {
        const response = await apiClient.get(`/indicator/data-entry?year=${year}&period=${period}`);
        return response.data;
    },

    // Gösterge verilerini kaydet
    saveIndicatorData: async (data) => {
        const response = await apiClient.post('/indicator/data-entry', data);
        return response.data;
    },

    // Departmanları getir
    getDepartments: async () => {
        const response = await apiClient.get('/indicator/departments');
        return response.data;
    },

    // Departmandaki kullanıcıları getir
    getUsersByDepartment: async (departmentId) => {
        const response = await apiClient.get(`/indicator/users/department/${departmentId}`);
        return response.data;
    },

    // Excel dışa aktarım
    exportToExcel: async () => {
        const response = await apiClient.get('/indicator/export/excel', {
            responseType: 'blob'
        });
        return response.data;
    }
};

export default indicatorService;

import apiClient from './apiClient';

export const notificationService = {
  // Bildirimleri getir (Lazy Loading)
  getNotifications: async (skip = 0, take = 20, onlyUnread = null) => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      take: take.toString()
    });

    if (onlyUnread !== null) {
      params.append('onlyUnread', onlyUnread.toString());
    }

    const response = await apiClient.get(`/notification?${params.toString()}`);
    return response.data;
  },  // Okunmamış bildirim sayısını getir
  getUnreadCount: async () => {
    const response = await apiClient.get('/notification/unread-count');
    return response.data.count;
  },

  // Bildirim özetini getir
  getNotificationSummary: async () => {
    const response = await apiClient.get('/notification/summary');
    return response.data;
  },

  // Bildirimi okundu olarak işaretle
  markAsRead: async (notificationId) => {
    const response = await apiClient.put(`/notification/${notificationId}/mark-as-read`);
    return response.data;
  },

  // Tüm bildirimleri okundu olarak işaretle
  markAllAsRead: async () => {
    const response = await apiClient.put('/notification/mark-all-as-read');
    return response.data;
  },

  // Bildirimi sil
  deleteNotification: async (notificationId) => {
    const response = await apiClient.delete(`/notification/${notificationId}`);
    return response.data;
  }
};

export default notificationService;

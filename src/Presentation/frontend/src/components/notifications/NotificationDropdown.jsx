import { useState, useEffect } from 'react';
import notificationService from '../../services/api/notificationService';
import NotificationItem from './NotificationItem';
import '../../styles/components/notifications.css';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const summary = await notificationService.getNotificationSummary();
      console.log('📬 Notification Summary:', summary); // DEBUG
      
      // Backend PascalCase veya camelCase dönebilir
      const recentNotifs = summary.recentNotifications || summary.RecentNotifications || [];
      const unread = summary.unreadCount ?? summary.UnreadCount ?? 0;
      
      setNotifications(recentNotifs);
      setUnreadCount(unread);
    } catch (error) {
      console.error('Bildirimler yüklenemedi:', error);
      console.error('Error details:', error.response?.data); // DEBUG
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('Bildirim işaretlenemedi:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await loadNotifications();
    } catch (error) {
      console.error('Bildirimler işaretlenemedi:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('Bildirim silinemedi:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="notification-overlay" onClick={onClose} />
      <div className="notification-dropdown">
        <div className="notification-header">
          <h3>Bildirimler</h3>
          {unreadCount > 0 && (
            <button 
              className="mark-all-read-btn"
              onClick={handleMarkAllAsRead}
            >
              Tümünü Okundu İşaretle
            </button>
          )}
        </div>

        <div className="notification-list">
          {loading ? (
            <div className="notification-loading">Yükleniyor...</div>
          ) : notifications.length === 0 ? (
            <div className="notification-empty">
              <p>Henüz bildiriminiz yok</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
              />
            ))
          )}
        </div>

        <div className="notification-footer">
          <a href="/notifications" className="view-all-link">
            Tüm Bildirimleri Görüntüle
          </a>
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;

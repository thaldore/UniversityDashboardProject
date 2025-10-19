import { useState, useEffect } from 'react';
import notificationService from '../../services/api/notificationService';
import NotificationItem from '../../components/notifications/NotificationItem';
import '../../styles/components/notifications.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const take = 20;

  const loadNotifications = async (reset = false) => {
    try {
      setLoading(true);
      const currentSkip = reset ? 0 : skip;
      const onlyUnread = filter === 'unread' ? true : filter === 'read' ? false : null;
      const response = await notificationService.getNotifications(currentSkip, take, onlyUnread);
      
      console.log('📋 Notifications Page Data:', response); // DEBUG
      
      const newData = response.data || response; // Backend'den data veya direkt array
      
      if (reset) {
        setNotifications(newData);
        setSkip(take);
      } else {
        setNotifications(prev => [...prev, ...newData]);
        setSkip(currentSkip + take);
      }
      
      setHasMore(response.hasMore ?? (newData.length === take));
    } catch (error) {
      console.error('Bildirimler yüklenemedi:', error);
      console.error('Error details:', error.response?.data); // DEBUG
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications(true); // Reset when filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Bildirim işaretlenemedi:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Bildirim silinemedi:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Bildirimler işaretlenemedi:', error);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSkip(0);
    setHasMore(true);
  };

  const loadMore = () => {
    loadNotifications(false); // Load more without reset
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bildirimler</h1>
          <p className="page-subtitle">Tüm bildirimlerinizi buradan görüntüleyin</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleMarkAllAsRead}
          disabled={notifications.every(n => n.isRead)}
        >
          Tümünü Okundu İşaretle
        </button>
      </div>

      <div className="card">
        <div className="notification-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            Tümü ({notifications.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => handleFilterChange('unread')}
          >
            Okunmamış ({notifications.filter(n => !n.isRead).length})
          </button>
          <button 
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => handleFilterChange('read')}
          >
            Okunmuş ({notifications.filter(n => n.isRead).length})
          </button>
        </div>

        <div className="notifications-page-list">
          {loading && skip === 0 ? (
            <div className="notification-loading">
              <p>Bildirimler yükleniyor...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-empty">
              <p>Henüz bildiriminiz yok</p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
              
              {hasMore && (
                <div className="load-more-container">
                  <button 
                    className="btn btn-secondary"
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? 'Yükleniyor...' : 'Daha Fazla Yükle'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

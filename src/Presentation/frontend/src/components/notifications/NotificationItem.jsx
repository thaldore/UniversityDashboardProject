import { useNavigate } from 'react-router-dom';
import '../../styles/components/notifications.css';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!notification.isRead) {
      await onMarkAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Bu bildirimi silmek istediğinizden emin misiniz?')) {
      await onDelete(notification.id);
    }
  };

  const getNotificationTypeClass = (type) => {
    // Type artık string olarak geliyor (örn: "PerformanceTargetApproved")
    const typeMap = {
      'PerformancePeriodCreated': 'performance',
      'PerformanceTargetAssigned': 'performance',
      'PerformanceTargetApproved': 'success',
      'PerformanceTargetRejected': 'error',
      'PerformanceTargetProgressApproved': 'success',
      'PerformanceTargetProgressRejected': 'error',
      'IndicatorCreated': 'indicator',
      'IndicatorDataEntryRequired': 'warning',
      'IndicatorDataSubmitted': 'indicator',
      'SystemMaintenance': 'system',
      'UserRoleChanged': 'system',
      'GeneralAnnouncement': 'info'
    };
    return typeMap[type] || 'info';
  };

  const getNotificationIcon = (type) => {
    // Type artık string olarak geliyor (örn: "PerformanceTargetApproved")
    const iconMap = {
      'PerformancePeriodCreated': '📅',
      'PerformanceTargetAssigned': '🎯',
      'PerformanceTargetApproved': '✅',
      'PerformanceTargetRejected': '❌',
      'PerformanceTargetProgressApproved': '✅',
      'PerformanceTargetProgressRejected': '❌',
      'IndicatorCreated': '📊',
      'IndicatorDataEntryRequired': '⚠️',
      'IndicatorDataSubmitted': '📊',
      'SystemMaintenance': '🔧',
      'UserRoleChanged': '👤',
      'GeneralAnnouncement': '📢'
    };
    return iconMap[type] || '🔔';
  };

  return (
    <div 
      className={`notification-item ${!notification.isRead ? 'unread' : ''} ${getNotificationTypeClass(notification.type)}`}
      onClick={handleClick}
    >
      <div className="notification-icon">
        {getNotificationIcon(notification.type)}
      </div>
      
      <div className="notification-content">
        <div className="notification-title-row">
          <span className="notification-type-badge">{notification.typeDisplay}</span>
          <span className="notification-time">{notification.timeAgo}</span>
        </div>
        
        <h4 className="notification-title">{notification.title}</h4>
        <p className="notification-message">{notification.message}</p>
      </div>

      <div className="notification-actions">
        {!notification.isRead && (
          <button
            className="notification-action-btn mark-read-btn"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            title="Okundu işaretle"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
            </svg>
          </button>
        )}
        
        <button
          className="notification-action-btn delete-btn"
          onClick={handleDelete}
          title="Sil"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;

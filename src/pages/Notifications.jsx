import { useApp } from '../AppContext';

export default function Notifications() {
  const { NOTIFICATIONS, toast } = useApp();

  return (
    <div className="page-pad view active">
      <div className="page-title-row">
        <div><h1>Notifications</h1><p className="sub">Everything that happened while you were away.</p></div>
        <button className="btn btn-ghost btn-sm" onClick={() => toast('All marked as read')}>Mark all as read</button>
      </div>
      <div className="panel">
        {NOTIFICATIONS.map((n, i) => (
          <div className="notif-row" key={i}>
            <div className="notif-icon">{n.icon}</div>
            <div>
              <div className="notif-text" dangerouslySetInnerHTML={{ __html: n.text }} />
              <div className="notif-time">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

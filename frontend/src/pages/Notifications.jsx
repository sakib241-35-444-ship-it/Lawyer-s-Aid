import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export default function Notifications() {
  const [data, setData] = useState({ unread: 0, notifications: [] });
  const load = () => api.get('/notifications').then(setData).catch(() => {});
  useEffect(() => { load(); }, []);

  const read = async (id) => { await api.put(`/notifications/${id}/read`); load(); };
  const readAll = async () => { await api.put('/notifications/read-all'); load(); };

  return (
    <>
      <div className="between">
        <h2>Notifications</h2>
        {data.unread > 0 && <button className="btn outline small" onClick={readAll}>Mark all as read</button>}
      </div>
      {!data.notifications.length && <p className="muted">No notifications yet.</p>}
      <ul className="notes">
        {data.notifications.map((n) => (
          <li key={n.id} className={n.is_read ? '' : 'unread'}>
            <div>{n.message}<div className="muted">{n.created_at} · <Link to={`/cases/${n.case_id}`}>Open case</Link></div></div>
            {!n.is_read && <button className="btn small outline" onClick={() => read(n.id)}>Mark read</button>}
          </li>
        ))}
      </ul>
    </>
  );
}

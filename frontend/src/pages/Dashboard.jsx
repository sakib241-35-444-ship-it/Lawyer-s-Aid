import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { lawyer } = useAuth();
  const [history, setHistory] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api.get('/history').then(setHistory).catch(() => {});
    api.get('/timeline').then((d) => setUpcoming(d.slice(0, 5))).catch(() => {});
    api.get('/notifications').then((d) => setUnread(d.unread)).catch(() => {});
  }, []);

  const active = history ? history.cases.filter((c) => !['Disposed', 'Closed'].includes(c.current_status)).length : 0;

  return (
    <>
      <h2>Welcome, {lawyer.name}</h2>
      <div className="grid3">
        <div className="card stat"><b>{history?.total ?? '-'}</b><span>Total cases</span></div>
        <div className="card stat"><b>{active}</b><span>Active cases</span></div>
        <div className="card stat"><b>{unread}</b><span><Link to="/notifications">Unread notifications</Link></span></div>
      </div>
      <div className="row"><Link className="btn" to="/cases/new">+ Add new case</Link></div>

      <h3>Next hearings</h3>
      {!upcoming.length ? <p className="muted">No upcoming hearings.</p> : (
        <ul className="list">
        {upcoming.map((c) => (
        <li key={c.id}><Link to={`/cases/${c.id}`}>{c.case_title}</Link> — {c.court_name}
        <b> {c.next_hearing_date}</b> ({c.days_left === 0 ? 'today' : `${c.days_left} day(s) left`})</li>
      ))}
      </ul>
    )}
  </>
 );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export default function Timeline() {
  const [items, setItems] = useState(null);
  useEffect(() => { api.get('/timeline').then(setItems).catch(() => setItems([])); }, []);
  if (!items) return <p>Loading...</p>;

  return (
    <>
      <h2>Case Timeline</h2>
      <p className="muted">Upcoming hearings in date order. You get a notification 3 days, 1 day and on the day of the hearing.</p>
      {!items.length && <p className="muted">No upcoming hearings.</p>}
      <ol className="timeline">
        {items.map((c) => (
          <li key={c.id} className={c.days_left <= 1 ? 'soon' : ''}>
            <div className="date">{c.next_hearing_date}
              <small>{c.days_left === 0 ? 'Today' : c.days_left === 1 ? 'Tomorrow' : `${c.days_left} days left`}</small></div>
            <div className="body">
              <Link to={`/cases/${c.id}`}><b>{c.case_title}</b></Link>
              <div className="muted">{c.case_no} · {c.court_name}</div>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

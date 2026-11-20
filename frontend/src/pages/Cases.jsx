import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, STATUSES } from '../api.js';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (status) p.set('status', status);
    api.get(`/cases?${p}`).then(setCases).catch(() => {});
  }, [q, status]);

  return (
    <>
      <div className="between"><h2>My Cases</h2><Link className="btn" to="/cases/new">+ Add case</Link></div>
      <div className="row">
        <input placeholder="Search title, case no., client..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Case ID</th><th>Case No.</th><th>Title</th><th>Client</th><th>Court</th><th>Status</th><th>Next hearing</th></tr></thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id}>
                <td>{c.case_code}</td><td>{c.case_no}</td>
                <td><Link to={`/cases/${c.id}`}>{c.case_title}</Link></td>
                <td>{c.client_name}</td><td>{c.court_name}</td>
                <td><StatusBadge status={c.current_status} /></td>
                <td>{c.next_hearing_date || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!cases.length && <p className="muted">No cases found.</p>}
      </div>
    </>
  );
}

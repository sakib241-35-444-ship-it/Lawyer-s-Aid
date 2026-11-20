import { useEffect, useState } from 'react';
import { api, PRACTICE_AREAS } from '../api.js';
import LawyerCard from '../components/LawyerCard.jsx';

export default function FindLawyers() {
  const [area, setArea] = useState('');
  const [q, setQ] = useState('');
  const [lawyers, setLawyers] = useState([]);

  useEffect(() => {
    const p = new URLSearchParams();
    if (area) p.set('practice_area', area);
    if (q) p.set('q', q);
    api.get(`/lawyers?${p}`).then(setLawyers).catch(() => {});
  }, [area, q]);

  return (
    <>
      <h2>Find a lawyer</h2>
      <div className="row">
        <input placeholder="Search by name or address" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">All practice areas</option>
          {PRACTICE_AREAS.map((a) => <option key={a}>{a}</option>)}
        </select>
      </div>
      <div className="grid3">{lawyers.map((l) => <LawyerCard key={l.id} l={l} />)}</div>
      {!lawyers.length && <p className="muted">No lawyers found.</p>}
    </>
  );
}

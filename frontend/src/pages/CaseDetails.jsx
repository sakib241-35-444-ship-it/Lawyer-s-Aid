import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, FIELD_LABELS } from '../api.js';
import StatusBadge from '../components/StatusBadge.jsx';
import WhatChanged from '../components/WhatChanged.jsx';
import Documents from '../components/Documents.jsx';

export default function CaseDetails() {
  const { id } = useParams();
  const [c, setC] = useState(null);
  const [tab, setTab] = useState('info');
  const [error, setError] = useState('');

  useEffect(() => { api.get(`/cases/${id}`).then(setC).catch((e) => setError(e.message)); }, [id]);
  if (error) return <p className="error">{error}</p>;
  if (!c) return <p>Loading...</p>;

  const rows = ['case_no', 'case_type', 'current_status', 'filing_date', 'next_hearing_date', 'client_name', 'court_name'];

  return (
    <>
      <div className="between">
        <div><span className="tag">{c.case_code}</span><h2>{c.case_title}</h2></div>
        <Link className="btn" to={`/cases/${c.id}/edit`}>Update case</Link>
      </div>

      <div className="tabs">
        {[['info', 'Case Information'], ['changes', 'What Changed'], ['docs', 'Documents']].map(([k, label]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>

      {tab === 'info' && (
        <div className="card">
          <dl className="details">
            {rows.map((k) => (
              <div key={k}><dt>{FIELD_LABELS[k]}</dt>
                <dd>{k === 'current_status' ? <StatusBadge status={c[k]} /> : c[k] || '-'}</dd></div>
            ))}
          </dl>
          <h4>Description</h4>
          <p>{c.description || <span className="muted">No description</span>}</p>
        </div>
      )}
      {tab === 'changes' && <WhatChanged caseId={c.id} />}
      {tab === 'docs' && <Documents caseId={c.id} />}
    </>
  );
}

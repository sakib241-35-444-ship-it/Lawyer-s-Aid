import { useEffect, useState } from 'react';
import { api, FIELD_LABELS } from '../api.js';

export default function WhatChanged({ caseId, refreshKey }) {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    api.get(`/cases/${caseId}/changes`).then(setRows).catch(() => setRows([]));
  }, [caseId, refreshKey]);

  if (!rows) return <p>Loading...</p>;
  if (!rows.length) return <p className="muted">No updates yet. Changes you make to case information will appear here.</p>;

  return (
    <div className="table-wrap">
      <table>
      <thead><tr><th>When</th><th>Field</th><th>Old data</th><th>New data</th></tr></thead>
      <tbody>
      {rows.map((r) => (
      <tr key={r.id}>
    <td>{r.changed_at}</td>
    <td>{FIELD_LABELS[r.field_name] || r.field_name}</td>
      <td className="old">{r.old_value || <em>(empty)</em>}</td>
      <td className="new">{r.new_value || <em>(empty)</em>}</td>
      </tr>
      ))}
      </tbody>
      </table>
    </div>
  );
}

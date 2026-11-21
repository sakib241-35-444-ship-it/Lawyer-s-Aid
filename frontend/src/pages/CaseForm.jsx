// Used for both "Add case" and "Edit case" (edit saves old/new data in What Changed)
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, CASE_TYPES, STATUSES } from '../api.js';

const EMPTY = {
  case_no: '', case_title: '', case_type: 'Civil', current_status: 'Pending', filing_date: '',
  next_hearing_date: '', client_name: '', court_name: '', description: '',
};

export default function CaseForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [f, setF] = useState(EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) api.get(`/cases/${id}`).then((c) => setF({ ...EMPTY, ...Object.fromEntries(Object.entries(c).map(([k, v]) => [k, v ?? ''])) }));
  }, [id]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (id) { await api.put(`/cases/${id}`, f); nav(`/cases/${id}`); }
      else { const c = await api.post('/cases', f); nav(`/cases/${c.id}`); }
    } catch (err) { setError(err.message); }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>{id ? 'Update case information' : 'Add new case'}</h2>
      {id && <p className="muted">Old and new data will be saved in the "What Changed" register.</p>}
      {error && <p className="error">{error}</p>}
      <div className="grid2">
        <label>Case No.<input required value={f.case_no} onChange={set('case_no')} /></label>
        <label>Case Title<input required value={f.case_title} onChange={set('case_title')} /></label>
        <label>Case Type
          <select value={f.case_type} onChange={set('case_type')}>{CASE_TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label>Current Status
          <select value={f.current_status} onChange={set('current_status')}>{STATUSES.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label>Filing Date<input type="date" required value={f.filing_date} onChange={set('filing_date')} /></label>
        <label>Next Hearing Date<input type="date" value={f.next_hearing_date} onChange={set('next_hearing_date')} /></label>
        <label>Client Name<input required value={f.client_name} onChange={set('client_name')} /></label>
        <label>Court Name<input required value={f.court_name} onChange={set('court_name')} /></label>
      </div>
      <label>Description<textarea rows="5" value={f.description} onChange={set('description')} /></label>
      <div className="row">
        <button className="btn">{id ? 'Save changes' : 'Create case'}</button>
        <button type="button" className="btn outline" onClick={() => nav(-1)}>Cancel</button>
      </div>
    </form>
  );
}

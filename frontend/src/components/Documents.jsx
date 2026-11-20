import { useEffect, useState } from 'react';
import { api, openDocument } from '../api.js';

const CATS = ['Legal Notice', 'Evidence', 'Court Order', 'Other'];

export default function Documents({ caseId }) {
  const [docs, setDocs] = useState([]);
  const [category, setCategory] = useState('Legal Notice');
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [filter, setFilter] = useState('All');

  const load = () => api.get(`/cases/${caseId}/documents`).then(setDocs).catch((e) => setMsg(e.message));
  useEffect(() => { load(); }, [caseId]);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return setMsg('Choose a file first');
    const form = new FormData();
    form.append('doc_category', category);
    form.append('file', file);
    try {
      await api.upload(`/cases/${caseId}/documents`, form);
      setFile(null); e.target.reset(); setMsg('Uploaded ✔'); load();
    } catch (err) { setMsg(err.message); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    await api.del(`/cases/${caseId}/documents/${id}`);
    load();
  };

  const shown = filter === 'All' ? docs : docs.filter((d) => d.doc_category === filter);

  return (
    <div>
      <form className="row upload" onSubmit={upload}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button className="btn">Upload</button>
      </form>
      {msg && <p className="muted">{msg}</p>}

      <div className="chips">
        {['All', ...CATS].map((c) => (
          <button key={c} className={`chip ${filter === c ? 'on' : ''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      {!shown.length ? <p className="muted">No documents.</p> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Category</th><th>File</th><th>Size</th><th>Uploaded</th><th></th></tr></thead>
            <tbody>
              {shown.map((d) => (
                <tr key={d.id}>
                  <td>{d.doc_category}</td>
                  <td>{d.original_name}</td>
                  <td>{(d.size_bytes / 1024).toFixed(0)} KB</td>
                  <td>{d.uploaded_at}</td>
                  <td className="actions">
                    <button className="btn small outline" onClick={() => openDocument(caseId, d.id)}>View</button>
                    <button className="btn small outline" onClick={() => openDocument(caseId, d.id, true)}>Download</button>
                    <button className="btn small danger" onClick={() => remove(d.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

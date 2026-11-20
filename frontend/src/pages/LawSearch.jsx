import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api.js';
import LawyerCard from '../components/LawyerCard.jsx';

export default function LawSearch() {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const [laws, setLaws] = useState([]);
  const [problem, setProblem] = useState(location.state?.problem || '');
  const [result, setResult] = useState(null);   // { laws, lawyers, categories }
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.get('/laws/categories').then(setCategories).catch(() => {}); }, []);

  // browse / keyword list
  useEffect(() => {
    const p = new URLSearchParams();
    if (category) p.set('category', category);
    if (q) p.set('q', q);
    api.get(`/laws?${p}`).then(setLaws).catch((e) => setError(e.message));
  }, [category, q]);

  const searchProblem = async (text) => {
    setError(''); setLoading(true);
    try { setResult(await api.post('/laws/problem-search', { problem: text })); }
    catch (e) { setError(e.message); }
    setLoading(false);
  };

  // came from home page with a problem
  useEffect(() => { if (location.state?.problem) searchProblem(location.state.problem); }, []);

  const LawItem = ({ l }) => (
    <div className="card">
      <span className="tag">{l.category}</span>
      <h3>{l.title}</h3>
      <p className="muted">{l.act_name} {l.section_ref && `— ${l.section_ref}`}</p>
      <p>{l.summary}</p>
    </div>
  );

  return (
    <>
      <h2>Tell us your problem</h2>
      <form className="row" onSubmit={(e) => { e.preventDefault(); searchProblem(problem); }}>
        <textarea rows="2" value={problem} onChange={(e) => setProblem(e.target.value)}
          placeholder="Describe your legal problem in a few words..." />
        <button className="btn" disabled={loading}>{loading ? 'Searching...' : 'Find laws & lawyers'}</button>
      </form>
      {error && <p className="error">{error}</p>}

      {result && (
        <section>
          <h2>Related laws</h2>
          {!result.laws.length && <p className="muted">No matching law found. Try different words, or browse below.</p>}
          {result.laws.map((l) => <LawItem key={l.id} l={l} />)}

          {result.lawyers.length > 0 && (
            <>
              <h2>Suggested lawyers {result.categories.length > 0 && <small className="muted">({result.categories.join(', ')})</small>}</h2>
              <div className="grid3">{result.lawyers.map((l) => <LawyerCard key={l.id} l={l} />)}</div>
            </>
          )}
          {result.laws.length > 0 && !result.lawyers.length && <p className="muted">No registered lawyer for this area yet.</p>}
        </section>
      )}

      <h2>Browse law information</h2>
      <div className="row">
        <input placeholder="Search by keyword (e.g. divorce, cheque, rent)" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.category} value={c.category}>{c.category} ({c.total})</option>)}
        </select>
      </div>
      {laws.map((l) => <LawItem key={l.id} l={l} />)}
      {!laws.length && <p className="muted">No laws found.</p>}
    </>
  );
}

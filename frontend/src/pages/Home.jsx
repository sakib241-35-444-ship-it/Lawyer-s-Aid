import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const [problem, setProblem] = useState('');
  const nav = useNavigate();

  const go = (e) => {
    e.preventDefault();
    if (problem.trim()) nav('/laws', { state: { problem } });
  };

  return (
    <>
      <section className="hero">
        <h1>Know your legal rights. Find the right lawyer.</h1>
        <p>No login needed. Tell us your problem and we will show related laws and lawyers.</p>
        <form onSubmit={go} className="hero-form">
          <textarea rows="3" value={problem} onChange={(e) => setProblem(e.target.value)}
            placeholder="Example: my landlord wants to evict me without notice" />
          <button className="btn">Search laws & lawyers</button>
        </form>
        <p className="muted"><Link to="/laws">Or browse all laws</Link> · <Link to="/find-lawyers">See all lawyers</Link></p>
      </section>

      <section className="grid3">
        <div className="card"><h3>📚 Law information</h3><p>Browse laws by category or search with keywords.</p></div>
        <div className="card"><h3>🧑‍⚖️ Lawyer suggestions</h3><p>Get lawyers for your problem with phone and email.</p></div>
        <div className="card"><h3>🗂 For lawyers</h3><p>Manage cases, hearing dates, documents and get reminders. <Link to="/register">Register</Link></p></div>
      </section>
    </>
  );
}

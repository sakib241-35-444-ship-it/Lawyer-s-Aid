import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';

export default function Navbar() {
  const { lawyer, logout } = useAuth();
  const nav = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!lawyer) return;
    const load = () => api.get('/notifications').then((d) => setUnread(d.unread)).catch(() => {});
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [lawyer]);

  return (
    <header className="navbar">
      <Link to="/" className="brand">⚖ Lawyer's Aid</Link>
      <nav>
        <NavLink to="/laws">Law Information</NavLink>
        <NavLink to="/find-lawyers">Find a Lawyer</NavLink>
        {lawyer ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/cases">Cases</NavLink>
            <NavLink to="/history">Case History</NavLink>
            <NavLink to="/timeline">Timeline</NavLink>
            <NavLink to="/notifications">🔔{unread > 0 && <span className="badge">{unread}</span>}</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <button className="btn small outline" onClick={() => { logout(); nav('/'); }}>Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Lawyer Login</NavLink>
            <NavLink to="/register" className="btn small">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

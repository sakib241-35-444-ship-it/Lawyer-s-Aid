import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { saveLogin } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try { saveLogin(await api.post('/auth/login', form)); nav('/dashboard'); }
    catch (err) { setError(err.message); }
  };

  return (
    <form className="card form narrow" onSubmit={submit}>
      <h2>Lawyer Login</h2>
      {error && <p className="error">{error}</p>}
      <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Password<input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
      <button className="btn">Login</button>
      <p>New lawyer? <Link to="/register">Register</Link></p>
    </form>
  );
}

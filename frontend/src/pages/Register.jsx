import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, PRACTICE_AREAS } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [f, setF] = useState({ name: '', address: '', phone: '', email: '', password: '', bar_enrollment_no: '' });
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState('');
  const { saveLogin } = useAuth();
  const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const toggle = (a) => setAreas(areas.includes(a) ? areas.filter((x) => x !== a) : [...areas, a]);

  const submit = async (e) => {
    e.preventDefault();
    if (!areas.length) return setError('Select at least one practice area');
    try {
      saveLogin(await api.post('/auth/register', { ...f, practice_area: areas.join(', ') }));
      nav('/dashboard');
    } catch (err) { setError(err.message); }
  };

  return (
    <form className="card form narrow" onSubmit={submit}>
      <h2>Lawyer Registration</h2>
      <p className="muted">Your name, address, phone, email and practice area will be shown to the public as a lawyer suggestion.</p>
      {error && <p className="error">{error}</p>}
      <label>Full name<input required value={f.name} onChange={set('name')} /></label>
      <label>Address<input required value={f.address} onChange={set('address')} /></label>
      <label>Phone<input required value={f.phone} onChange={set('phone')} /></label>
      <label>Email<input type="email" required value={f.email} onChange={set('email')} /></label>
      <label>Bar Council enrollment no.<input required value={f.bar_enrollment_no} onChange={set('bar_enrollment_no')} /></label>
      <fieldset>
        <legend>Practice area</legend>
        <div className="chips">
          {PRACTICE_AREAS.map((a) => (
            <button type="button" key={a} className={`chip ${areas.includes(a) ? 'on' : ''}`} onClick={() => toggle(a)}>{a}</button>
          ))}
        </div>
      </fieldset>
      <label>Password (min 6 characters)<input type="password" minLength="6" required value={f.password} onChange={set('password')} /></label>
      <button className="btn">Create account</button>
      <p>Already registered? <Link to="/login">Login</Link></p>
    </form>
  );
}

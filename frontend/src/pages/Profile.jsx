import { useEffect, useState } from 'react';
import { api, PRACTICE_AREAS } from '../api.js';

export default function Profile() {
  const [p, setP] = useState(null);
  const [areas, setAreas] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/profile').then((d) => { setP(d); setAreas(d.practice_area.split(',').map((s) => s.trim())); });
  }, []);
  if (!p) return <p>Loading...</p>;

  const set = (k) => (e) => setP({ ...p, [k]: e.target.value });
  const toggle = (a) => setAreas(areas.includes(a) ? areas.filter((x) => x !== a) : [...areas, a]);

  const save = async (e) => {
    e.preventDefault();
    try {
      const d = await api.put('/profile', { ...p, practice_area: areas.join(', ') });
      setP(d); setMsg('Profile saved ✔');
    } catch (err) { setMsg(err.message); }
  };

  return (
    <form className="card form narrow" onSubmit={save}>
      <h2>My Profile</h2>
      {msg && <p className="muted">{msg}</p>}
      <label>Full name<input required value={p.name} onChange={set('name')} /></label>
      <label>Address<input required value={p.address} onChange={set('address')} /></label>
      <label>Phone<input required value={p.phone} onChange={set('phone')} /></label>
      <label>Email<input value={p.email} disabled /></label>
      <label>Bar Council enrollment no.<input value={p.bar_enrollment_no} disabled /></label>
      <fieldset>
        <legend>Practice area</legend>
        <div className="chips">
          {PRACTICE_AREAS.map((a) => (
            <button type="button" key={a} className={`chip ${areas.includes(a) ? 'on' : ''}`} onClick={() => toggle(a)}>{a}</button>
          ))}
        </div>
      </fieldset>
      <button className="btn">Save profile</button>
    </form>
  );
}

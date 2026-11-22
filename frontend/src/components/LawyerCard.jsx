export default function LawyerCard({ l }) {
  return (
    <div className="card lawyer">
      <h3>{l.name}</h3>
      <p className="muted">{l.practice_area}</p>
      <p>📍 {l.address}</p>
      <p>📞 <a href={`tel:${l.phone}`}>{l.phone}</a></p>
      <p>✉️ <a href={`mailto:${l.email}`}>{l.email}</a></p>
    </div>
  );
}

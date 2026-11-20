export default function StatusBadge({ status }) {
  const cls = ['Disposed', 'Closed'].includes(status) ? 'done' : status === 'Hearing' ? 'hot' : 'live';
  return <span className={`status ${cls}`}>{status}</span>;
}

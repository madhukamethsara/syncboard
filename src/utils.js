export function priorityColor(p) {
  return p === 'High' ? 'var(--rose)' : p === 'Medium' ? 'var(--gold)' : 'var(--green)';
}

export function fmtDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

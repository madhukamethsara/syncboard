import { useApp } from '../AppContext';

export default function Avatar({ userId, size = 26 }) {
  const { userById } = useApp();
  const u = userById(userId);
  if (!u) return null;
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.4, background: u.color, position: 'relative' }}
      title={u.name}
    >
      {u.initials}
      {u.online && <span className="online-dot"></span>}
    </div>
  );
}

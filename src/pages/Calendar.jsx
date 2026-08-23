import { useApp } from '../AppContext';
import { priorityColor } from '../utils';

const DOWS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ openDrawer }) {
  const { tasks } = useApp();
  const year = 2026, month = 7; // August (0-indexed)
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(<div className="cal-cell empty" key={`e${i}`}></div>);
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `2026-08-${String(day).padStart(2, '0')}`;
    const dayTasks = tasks.filter((t) => t.due === dateStr);
    const isToday = day === 11;
    cells.push(
      <div className="cal-cell" key={day}>
        <div className={`cal-date${isToday ? ' today' : ''}`}>{day}</div>
        {dayTasks.slice(0, 3).map((t) => (
          <div
            className="cal-task"
            key={t.id}
            style={{ borderColor: priorityColor(t.priority) }}
            onClick={() => openDrawer(t.id)}
          >
            {t.title}
          </div>
        ))}
        {dayTasks.length > 3 && (
          <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>+{dayTasks.length - 3} more</div>
        )}
      </div>
    );
  }

  return (
    <div className="page-pad view active">
      <div className="page-title-row"><div><h1>Calendar</h1><p className="sub">All tasks with a due date, across every board.</p></div></div>
      <div className="panel">
        <div className="section-sub-title">August 2026</div>
        <div className="cal-grid">
          {DOWS.map((d) => <div className="cal-dow" key={d}>{d}</div>)}
          {cells}
        </div>
      </div>
    </div>
  );
}

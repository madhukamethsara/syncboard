import { useApp } from '../AppContext';
import Avatar from '../components/Avatar';
import { priorityColor, fmtDate } from '../utils';

export default function Dashboard({ gotoApp, openBoard, openDrawer, openTaskModal, openBoardModal }) {
  const { currentUser, boards, tasks, users, ACTIVITY, boardProgress, tasksForBoard } = useApp();

  const dashBoards = boards.slice(0, 4);
  const mine = tasks.filter((t) => t.assignee === currentUser.id && t.status !== 'done').slice(0, 5);
  const assignedList = mine.length ? mine : tasks.slice(0, 4);
  const online = users.filter((u) => u.online);

  return (
    <div className="page-pad view active">
      <div className="page-title-row">
        <div>
          <h1>Welcome back, {currentUser.name.split(' ')[0]}</h1>
          <p className="sub">Here's what's moving across your boards today.</p>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 22 }}>
        <div className="stat-card"><div className="label">MY BOARDS</div><div className="value">{boards.length}</div><div className="delta up">+1 this month</div></div>
        <div className="stat-card"><div className="label">ASSIGNED TASKS</div><div className="value">{tasks.filter(t=>t.assignee===currentUser.id).length}</div><div className="delta down">3 due this week</div></div>
        <div className="stat-card"><div className="label">TEAM MEMBERS ONLINE</div><div className="value">{online.length}</div><div className="delta up">across 2 teams</div></div>
        <div className="stat-card"><div className="label">COMPLETION RATE</div><div className="value">72%</div><div className="delta up">+4% vs last week</div></div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1.3fr 1fr', alignItems: 'start' }}>
        <div>
          <div className="section-sub-title">My Boards</div>
          <div className="grid-2">
            {dashBoards.map((b) => {
              const pct = boardProgress(b.id);
              return (
                <div className="board-card" key={b.id} onClick={() => openBoard(b.id)}>
                  <div className="bc-strip" style={{ background: b.color }}></div>
                  <h3>{b.name}</h3>
                  <p>{b.desc}</p>
                  <div className="progress-bar"><div style={{ width: `${pct}%`, background: b.color }}></div></div>
                  <div className="bc-meta"><span>{pct}% complete</span><span>{tasksForBoard(b.id).length} tasks</span></div>
                </div>
              );
            })}
          </div>
          <div className="panel" style={{ marginTop: 16 }}>
            <h3>Quick actions</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => openTaskModal()}>+ New Task</button>
              <button className="btn btn-ghost btn-sm" onClick={() => openBoardModal()}>+ New Board</button>
              <button className="btn btn-ghost btn-sm" onClick={() => gotoApp('calendar')}>📅 View Calendar</button>
              <button className="btn btn-ghost btn-sm" onClick={() => gotoApp('team')}>👥 Invite Member</button>
            </div>
          </div>
        </div>
        <div>
          <div className="panel" style={{ marginBottom: 16 }}>
            <h3>Assigned to me <span className="see-all" onClick={() => gotoApp('boards')}>See all</span></h3>
            <div className="task-list-mini">
              {assignedList.map((t) => (
                <div className="mini-task" key={t.id} onClick={() => openDrawer(t.id)}>
                  <div className="p-tab" style={{ background: priorityColor(t.priority) }}></div>
                  <div className="mt-title">{t.title}</div>
                  <div className="mt-due">{fmtDate(t.due)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel" style={{ marginBottom: 16 }}>
            <h3>Recent activity</h3>
            <div>
              {ACTIVITY.slice(0, 4).map((a, i) => (
                <div className="activity-row" key={i}>
                  <div className="activity-time mono">{a.time}</div>
                  <div className="activity-text" dangerouslySetInnerHTML={{ __html: `${a.user} ${a.text}` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <h3>Team members online</h3>
            <div>
              {online.map((u) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0' }} key={u.id}>
                  <Avatar userId={u.id} size={26} />
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{u.name}</div>
                    <span className="pill pill-online">Online</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

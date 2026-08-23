export default function Topbar({ gotoApp, openTaskModal, logout, onSearch }) {
  return (
    <div className="topbar">
      <div className="topbar-search">
        🔍
        <input type="text" placeholder="Search tasks, boards, people..." onChange={(e) => onSearch(e.target.value)} />
      </div>
      <div className="topbar-right">
        <button className="icon-btn" onClick={() => gotoApp('notifications')}>
          🔔<span className="badge-dot"></span>
        </button>
        <button className="btn btn-gold btn-sm" onClick={() => openTaskModal()}>+ Add Task</button>
        <button className="icon-btn" onClick={logout} title="Log out">⏻</button>
      </div>
    </div>
  );
}

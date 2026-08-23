import { useMemo, useState } from 'react';
import { useApp } from '../AppContext';
import Avatar from '../components/Avatar';
import { priorityColor, fmtDate } from '../utils';

const COLS = [
  { key: 'todo', label: 'To Do', color: 'var(--text-faint)' },
  { key: 'doing', label: 'Doing', color: 'var(--blue)' },
  { key: 'done', label: 'Done', color: 'var(--green)' },
];

export default function Kanban({ currentBoardId, gotoApp, openTaskModal, openDrawer, openBoardModal, searchTerm }) {
  const { boardById, tasksForBoard, users, moveTask, deleteBoard, toast } = useApp();
  const board = boardById(currentBoardId);

  const [search, setSearch] = useState('');
  const [fPriority, setFPriority] = useState('');
  const [fAssignee, setFAssignee] = useState('');
  const [fLabel, setFLabel] = useState('');
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const effectiveSearch = searchTerm || search;

  const allLabels = useMemo(() => {
    const s = new Set();
    tasksForBoard(currentBoardId).forEach((t) => t.labels.forEach((l) => s.add(l)));
    return [...s];
  }, [tasksForBoard, currentBoardId]);

  const filtered = useMemo(() => {
    return tasksForBoard(currentBoardId).filter((t) => {
      if (effectiveSearch && !t.title.toLowerCase().includes(effectiveSearch.toLowerCase())) return false;
      if (fPriority && t.priority !== fPriority) return false;
      if (fAssignee && t.assignee !== fAssignee) return false;
      if (fLabel && !t.labels.includes(fLabel)) return false;
      return true;
    });
  }, [tasksForBoard, currentBoardId, effectiveSearch, fPriority, fAssignee, fLabel]);

  if (!board) {
    return (
      <div className="page-pad view active">
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => gotoApp('boards')}>← All boards</button>
        <div className="empty-state"><h4>Board not found</h4></div>
      </div>
    );
  }

  function handleDrop(status) {
    setDragOverCol(null);
    if (!draggedId) return;
    const moved = moveTask(draggedId, status);
    if (moved) {
      const label = status === 'todo' ? 'To Do' : status === 'doing' ? 'Doing' : 'Done';
      toast(`Moved "${moved.title}" to ${label}`);
    }
    setDraggedId(null);
  }

  function handleDeleteBoard() {
    if (!window.confirm('Delete this board and all its tasks?')) return;
    deleteBoard(currentBoardId);
    gotoApp('boards');
  }

  return (
    <div className="page-pad view active">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => gotoApp('boards')}>← All boards</button>
      <div className="board-header">
        <h1><span>{board.name}</span></h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => openBoardModal(currentBoardId)}>Edit board</button>
          <button className="btn btn-danger btn-sm" onClick={handleDeleteBoard}>Delete board</button>
          <button className="btn btn-gold btn-sm" onClick={() => openTaskModal()}>+ Add Task</button>
        </div>
      </div>

      <div className="filter-bar">
        <input className="search-sm" placeholder="Search task..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="select-sm" value={fPriority} onChange={(e) => setFPriority(e.target.value)}>
          <option value="">All priorities</option><option>High</option><option>Medium</option><option>Low</option>
        </select>
        <select className="select-sm" value={fAssignee} onChange={(e) => setFAssignee(e.target.value)}>
          <option value="">All assignees</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <select className="select-sm" value={fLabel} onChange={(e) => setFLabel(e.target.value)}>
          <option value="">All labels</option>
          {allLabels.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>

      <div className="kanban-wrap">
        {COLS.map((c) => {
          const colTasks = filtered.filter((t) => t.status === c.key);
          return (
            <div
              key={c.key}
              className={`kanban-col${dragOverCol === c.key ? ' drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOverCol(c.key); }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => { e.preventDefault(); handleDrop(c.key); }}
            >
              <div className="kcol-head">
                <div className="kc-title"><span className="kcol-dot" style={{ background: c.color }}></span>{c.label}</div>
                <span className="kcol-count">{colTasks.length}</span>
              </div>
              <div className="kcol-body">
                {colTasks.map((t) => (
                  <div
                    key={t.id}
                    className={`task-card${draggedId === t.id ? ' dragging' : ''}`}
                    draggable
                    onDragStart={() => setDraggedId(t.id)}
                    onDragEnd={() => { setDraggedId(null); setDragOverCol(null); }}
                    onClick={() => openDrawer(t.id)}
                  >
                    <div className="tcard-tab" style={{ background: priorityColor(t.priority) }}></div>
                    <div className="t-title">{t.title}</div>
                    <div className="t-labels">
                      {t.labels.map((l) => <span className="label-chip" key={l}>{l}</span>)}
                    </div>
                    <div className="t-foot">
                      <div className="t-foot-left">
                        <span className="t-due">📅 {fmtDate(t.due)}</span>
                        {t.comments.length > 0 && <span className="t-meta-icon">💬 {t.comments.length}</span>}
                        {t.attachments.length > 0 && <span className="t-meta-icon">📎 {t.attachments.length}</span>}
                      </div>
                      <Avatar userId={t.assignee} size={22} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="add-task-col-btn" onClick={() => openTaskModal(null, c.key)}>+ Add task</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

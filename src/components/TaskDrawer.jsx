import { useState } from 'react';
import { useApp } from '../AppContext';
import Avatar from './Avatar';
import { fmtDate } from '../utils';

export default function TaskDrawer({ taskId, onClose, onEdit, onDeleted }) {
  const { tasks, boardById, userById, addComment, deleteTask } = useApp();
  const [commentText, setCommentText] = useState('');
  const t = tasks.find((x) => x.id === taskId);

  if (!t) return null;
  const b = boardById(t.board);

  function handlePost() {
    const text = commentText.trim();
    if (!text) return;
    addComment(taskId, text);
    setCommentText('');
  }

  function handleDelete() {
    if (!window.confirm('Delete this task?')) return;
    deleteTask(taskId);
    onClose();
    if (onDeleted) onDeleted();
  }

  return (
    <>
      <div className="drawer-overlay active" onClick={onClose}></div>
      <div className="drawer active">
        <div className="drawer-head">
          <button className="modal-close" style={{ float: 'right' }} onClick={onClose}>✕</button>
          <div className="eyebrow">{b ? b.name.toUpperCase() : ''}</div>
          <h2 style={{ fontSize: 20, margin: 0 }}>{t.title}</h2>
        </div>
        <div className="drawer-body">
          <div className="drawer-section">
            <h4>Description</h4>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              {t.desc || 'No description provided.'}
            </p>
          </div>
          <div className="drawer-section">
            <h4>Details</h4>
            <div className="detail-grid">
              <div className="detail-item"><div className="di-label">Priority</div><div className="di-val"><span className={`pill pill-${t.priority.toLowerCase()}`}>{t.priority}</span></div></div>
              <div className="detail-item"><div className="di-label">Status</div><div className="di-val">{t.status === 'todo' ? 'To Do' : t.status === 'doing' ? 'Doing' : 'Done'}</div></div>
              <div className="detail-item"><div className="di-label">Due date</div><div className="di-val">{fmtDate(t.due)}</div></div>
              <div className="detail-item"><div className="di-label">Assignee</div><div className="di-val"><Avatar userId={t.assignee} size={20} /> {userById(t.assignee)?.name}</div></div>
            </div>
          </div>
          <div className="drawer-section">
            <h4>Labels</h4>
            <div className="t-labels" style={{ paddingLeft: 0 }}>
              {t.labels.length ? t.labels.map((l) => <span className="label-chip" key={l}>{l}</span>) : <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>No labels</span>}
            </div>
          </div>
          <div className="drawer-section">
            <h4>Attachments</h4>
            <div>
              {t.attachments.length ? t.attachments.map((a) => (
                <div className="attachment-row" key={a}><div className="a-icon">📄</div>{a}</div>
              )) : <div className="empty-state" style={{ padding: '16px 0' }}><p>No attachments yet</p></div>}
            </div>
          </div>
          <div className="drawer-section">
            <h4>Comments</h4>
            <div>
              {t.comments.length ? t.comments.map((c, i) => {
                const u = userById(c.user);
                return (
                  <div className="comment" key={i}>
                    <Avatar userId={c.user} size={28} />
                    <div className="c-body">
                      <div className="c-head"><span className="c-name">{u ? u.name : c.user}</span><span className="c-time">{c.time}</span></div>
                      <div className="c-text">{c.text}</div>
                    </div>
                  </div>
                );
              }) : <p style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>No comments yet — be the first to comment.</p>}
            </div>
            <div className="comment-input">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handlePost(); }}
              />
              <button className="btn btn-gold btn-sm" onClick={handlePost}>Post</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { onClose(); onEdit(taskId); }}>Edit task</button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete task</button>
          </div>
        </div>
      </div>
    </>
  );
}

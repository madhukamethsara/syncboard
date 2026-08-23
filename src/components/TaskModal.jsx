import { useEffect, useState } from 'react';
import { useApp } from '../AppContext';

const EMPTY = { title: '', desc: '', priority: 'Medium', status: 'todo', due: '2026-08-20', assignee: '', labels: '' };

export default function TaskModal({ editingTaskId, defaultStatus, currentBoardId, onClose }) {
  const { users, tasks, currentUser, saveTask, toast } = useApp();
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (editingTaskId) {
      const t = tasks.find((x) => x.id === editingTaskId);
      if (t) {
        setForm({
          title: t.title, desc: t.desc, priority: t.priority, status: t.status,
          due: t.due, assignee: t.assignee, labels: t.labels.join(', '),
        });
      }
    } else {
      setForm({ ...EMPTY, status: defaultStatus || 'todo', assignee: currentUser.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingTaskId, defaultStatus]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSave() {
    const title = form.title.trim();
    if (!title) { toast('Task title is required'); return; }
    const labels = form.labels.split(',').map((s) => s.trim()).filter(Boolean);
    saveTask({
      title,
      desc: form.desc.trim(),
      priority: form.priority,
      status: form.status,
      due: form.due || '2026-08-20',
      assignee: form.assignee,
      labels,
    }, editingTaskId, currentBoardId);
    onClose();
  }

  return (
    <div className="modal-overlay active">
      <div className="modal">
        <div className="modal-head">
          <h3>{editingTaskId ? 'Edit Task' : 'Create Task'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="field"><label>Task title</label><input type="text" placeholder="e.g. Design login screen" value={form.title} onChange={(e) => update('title', e.target.value)} /></div>
          <div className="field"><label>Description</label><textarea placeholder="Add more detail..." value={form.desc} onChange={(e) => update('desc', e.target.value)} /></div>
          <div className="field-grid">
            <div className="field">
              <label>Priority</label>
              <select value={form.priority} onChange={(e) => update('priority', e.target.value)}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={(e) => update('status', e.target.value)}>
                <option value="todo">To Do</option><option value="doing">Doing</option><option value="done">Done</option>
              </select>
            </div>
          </div>
          <div className="field-grid">
            <div className="field"><label>Due date</label><input type="date" value={form.due} onChange={(e) => update('due', e.target.value)} /></div>
            <div className="field">
              <label>Assignee</label>
              <select value={form.assignee} onChange={(e) => update('assignee', e.target.value)}>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>
          <div className="field"><label>Labels (comma separated)</label><input type="text" placeholder="Frontend, Bug, Design" value={form.labels} onChange={(e) => update('labels', e.target.value)} /></div>
          <div className="field"><label>Attachments</label><div className="upload-box">📎 Drop files here or click to upload (demo only)</div></div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-gold" onClick={handleSave}>Save task</button>
        </div>
      </div>
    </div>
  );
}

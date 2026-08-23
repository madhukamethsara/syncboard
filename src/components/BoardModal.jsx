import { useEffect, useState } from 'react';
import { useApp } from '../AppContext';

export default function BoardModal({ editingBoardId, onClose, onSaved }) {
  const { boards, teams, saveBoard, toast } = useApp();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [team, setTeam] = useState('');

  useEffect(() => {
    if (editingBoardId) {
      const b = boards.find((x) => x.id === editingBoardId);
      if (b) { setName(b.name); setDesc(b.desc); setTeam(b.team || ''); }
    } else {
      setName(''); setDesc(''); setTeam('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingBoardId]);

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) { toast('Board name is required'); return; }
    const newId = saveBoard({ name: trimmed, desc: desc.trim(), team: team || null }, editingBoardId);
    onClose();
    if (onSaved) onSaved(newId);
  }

  return (
    <div className="modal-overlay active">
      <div className="modal" style={{ width: 440 }}>
        <div className="modal-head">
          <h3>{editingBoardId ? 'Edit Board' : 'Create Board'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="field"><label>Board name</label><input type="text" placeholder="e.g. Backend Sprint" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="field"><label>Description</label><textarea placeholder="What is this board for?" value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
          <div className="field">
            <label>Team</label>
            <select value={team} onChange={(e) => setTeam(e.target.value)}>
              <option value="">Personal (no team)</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-gold" onClick={handleSave}>Save board</button>
        </div>
      </div>
    </div>
  );
}

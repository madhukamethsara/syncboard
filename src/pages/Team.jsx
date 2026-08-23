import { useState } from 'react';
import { useApp } from '../AppContext';
import Avatar from '../components/Avatar';

export default function Team() {
  const { teams, teamById, userById, ACTIVITY, toast } = useApp();
  const [currentTeamId, setCurrentTeamId] = useState('t1');
  const team = teamById(currentTeamId);

  return (
    <div className="page-pad view active">
      <div className="page-title-row">
        <div><h1>Teams</h1><p className="sub">Manage members, roles and team workspaces.</p></div>
        <button className="btn btn-gold" onClick={() => toast('Invite link copied (demo)')}>+ Invite Member</button>
      </div>
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1.3fr', alignItems: 'start' }}>
        <div className="panel">
          <h3>Teams</h3>
          <div>
            {teams.map((t) => (
              <div className="mini-task" style={{ marginBottom: 8 }} key={t.id} onClick={() => setCurrentTeamId(t.id)}>
                <div className="p-tab" style={{ background: 'var(--teal)' }}></div>
                <div className="mt-title">{t.name}</div>
                <div className="mt-due">{t.members.length} members</div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h3>Members — <span>{team.name}</span></h3>
          <div>
            {team.members.map((uid) => {
              const u = userById(uid);
              return (
                <div className="member-row" key={uid}>
                  <Avatar userId={uid} size={38} />
                  <div className="member-info">
                    <div className="m-name">{u.name}</div>
                    <div className="m-email">{u.email}</div>
                  </div>
                  <div className="m-actions">
                    <span className={`pill pill-${u.role.toLowerCase()}`}>{u.role}</span>
                    {u.online && <span className="pill pill-online">Online</span>}
                    <select className="select-sm" defaultValue={u.role} onChange={() => toast('Role updated (demo)')}>
                      <option>Owner</option>
                      <option>Admin</option>
                      <option>Member</option>
                    </select>
                    <button className="btn btn-ghost btn-sm" onClick={() => toast('Member removed (demo)')}>Remove</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="panel" style={{ marginTop: 16 }}>
        <h3>Team activity</h3>
        <div>
          {ACTIVITY.map((a, i) => (
            <div className="activity-row" key={i}>
              <div className="activity-time mono">{a.time}</div>
              <div className="activity-text" dangerouslySetInnerHTML={{ __html: `${a.user} ${a.text}` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

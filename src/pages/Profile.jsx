import { useState } from 'react';
import { useApp } from '../AppContext';

export default function Profile() {
  const { currentUser, toast } = useApp();
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  return (
    <div className="page-pad view active">
      <div className="page-title-row"><div><h1>Profile</h1><p className="sub">Your personal account details.</p></div></div>
      <div className="grid-2" style={{ gridTemplateColumns: '0.9fr 1.1fr', alignItems: 'start' }}>
        <div className="panel" style={{ textAlign: 'center' }}>
          <div className="avatar" style={{ width: 88, height: 88, fontSize: 28, margin: '0 auto 14px', background: currentUser.color }}>
            {currentUser.initials}
          </div>
          <h3 style={{ margin: '0 0 4px' }}>{currentUser.name}</h3>
          <p style={{ color: 'var(--text-faint)', fontSize: 13, margin: '0 0 16px' }}>{currentUser.email}</p>
          <button className="btn btn-ghost btn-sm btn-block">Change photo</button>
        </div>
        <div className="panel">
          <h3>Account details</h3>
          <div className="field"><label>Name</label><input type="text" defaultValue={currentUser.name} /></div>
          <div className="field"><label>Email</label><input type="email" defaultValue={currentUser.email} /></div>
          <div className="field-grid">
            <div className="field"><label>New password</label><input type="password" placeholder="••••••••" /></div>
            <div className="field"><label>Confirm password</label><input type="password" placeholder="••••••••" /></div>
          </div>
          <div className="settings-row">
            <div><div className="sr-label">Email notifications</div><div className="sr-desc">Task assignments and due-date reminders</div></div>
            <div className={`toggle${emailNotif ? ' on' : ''}`} onClick={() => setEmailNotif(!emailNotif)}></div>
          </div>
          <div className="settings-row">
            <div><div className="sr-label">Push notifications</div><div className="sr-desc">Real-time alerts on this device</div></div>
            <div className={`toggle${pushNotif ? ' on' : ''}`} onClick={() => setPushNotif(!pushNotif)}></div>
          </div>
          <button className="btn btn-gold" style={{ marginTop: 18 }} onClick={() => toast('Profile saved')}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

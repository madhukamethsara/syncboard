import { useState } from 'react';

export default function Settings() {
  const [activeSwatch, setActiveSwatch] = useState(0);
  const [notifOn, setNotifOn] = useState(true);
  const [compact, setCompact] = useState(false);

  return (
    <div className="page-pad view active">
      <div className="page-title-row"><div><h1>Settings</h1><p className="sub">Workspace preferences.</p></div></div>

      <div className="panel" style={{ maxWidth: 640 }}>
        <h3>Theme</h3>
        <div className="theme-swatch-row">
          <div className={`theme-swatch${activeSwatch === 0 ? ' active' : ''}`} style={{ background: '#12141C' }} onClick={() => setActiveSwatch(0)}></div>
          <div className={`theme-swatch${activeSwatch === 1 ? ' active' : ''}`} style={{ background: '#F4F1EA' }} onClick={() => setActiveSwatch(1)}></div>
          <div className={`theme-swatch${activeSwatch === 2 ? ' active' : ''}`} style={{ background: 'linear-gradient(90deg,#12141C 50%,#F4F1EA 50%)' }} onClick={() => setActiveSwatch(2)}></div>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: 640, marginTop: 16 }}>
        <h3>Preferences</h3>
        <div className="settings-row">
          <div><div className="sr-label">Notifications</div><div className="sr-desc">Task, comment and mention alerts</div></div>
          <div className={`toggle${notifOn ? ' on' : ''}`} onClick={() => setNotifOn(!notifOn)}></div>
        </div>
        <div className="settings-row">
          <div><div className="sr-label">Language</div><div className="sr-desc">Interface language</div></div>
          <select className="select-sm"><option>English</option><option>Sinhala</option><option>Tamil</option></select>
        </div>
        <div className="settings-row">
          <div><div className="sr-label">Compact sidebar</div><div className="sr-desc">Collapse labels on desktop</div></div>
          <div className={`toggle${compact ? ' on' : ''}`} onClick={() => setCompact(!compact)}></div>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: 640, marginTop: 16 }}>
        <h3>Account</h3>
        <div className="settings-row">
          <div><div className="sr-label">Deactivate account</div><div className="sr-desc">Hide your profile and pause notifications</div></div>
          <button className="btn btn-ghost btn-sm">Deactivate</button>
        </div>
        <div className="settings-row">
          <div><div className="sr-label">Delete account</div><div className="sr-desc">Permanently remove your data</div></div>
          <button className="btn btn-danger btn-sm">Delete</button>
        </div>
      </div>
    </div>
  );
}

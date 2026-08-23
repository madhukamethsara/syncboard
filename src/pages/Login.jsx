import { useState } from 'react';
import { useApp } from '../AppContext';

export default function Login({ goto, afterAuth }) {
  const { users, setCurrentUser } = useApp();
  const [email, setEmail] = useState('madhuka@loom.app');
  const [password, setPassword] = useState('password');
  const [showError, setShowError] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || users[0];
    setCurrentUser(found);
    afterAuth();
  }

  return (
    <section className="view active">
      <div className="auth-wrap">
        <div className="auth-side">
          <div className="eyebrow">WELCOME BACK</div>
          <h2>
            Pick up exactly
            <br />
            where the thread
            <br />
            left off.
          </h2>
          <p>Your boards, assignments and team activity are waiting — nothing moves until you sign back in.</p>
        </div>
        <div className="auth-form-wrap">
          <form className="auth-form" onSubmit={handleLogin}>
            <h1>Log in</h1>
            <p className="sub">
              New to SyncBoard? <a className="link-teal" onClick={() => goto('register')}>Create an account</a>
            </p>
            {showError && (
              <div className="auth-error">
                Enter an email and password to continue — this is a demo, any values work.
              </div>
            )}
            <div className="field">
              <label>Email</label>
              <input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="field-row">
              <label className="checkbox-row"><input type="checkbox" defaultChecked /> Remember me</label>
              <a className="link-teal">Forgot password?</a>
            </div>
            <button className="btn btn-gold btn-block" type="submit">Log in</button>
            <p className="auth-switch">By continuing you agree to the demo Terms &amp; Privacy Notice.</p>
          </form>
        </div>
      </div>
    </section>
  );
}

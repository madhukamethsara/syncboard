import { useState } from 'react';
import { useApp } from '../AppContext';

export default function Register({ goto, afterAuth }) {
  const { setCurrentUser, toast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  function handleRegister(e) {
    e.preventDefault();
    if (password !== confirm) {
      toast("Passwords don't match");
      return;
    }
    const initials = (name || 'NU').split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase();
    setCurrentUser({
      id: 'u_new',
      name: name || 'New User',
      email: email || 'you@loom.app',
      initials,
      color: '#E3A64A',
      online: true,
      role: 'Owner',
    });
    toast('Account created — welcome to Loom!');
    afterAuth();
  }

  return (
    <section className="view active">
      <div className="auth-wrap">
        <div className="auth-side">
          <div className="eyebrow">START A NEW THREAD</div>
          <h2>
            One account.
            <br />
            Personal, team and
            <br />
            org boards.
          </h2>
          <p>Set up your workspace in under a minute — start solo and invite your team whenever you're ready.</p>
        </div>
        <div className="auth-form-wrap">
          <form className="auth-form" onSubmit={handleRegister}>
            <h1>Create your account</h1>
            <p className="sub">
              Already have one? <a className="link-teal" onClick={() => goto('login')}>Log in</a>
            </p>
            <div className="field">
              <label>Full name</label>
              <input type="text" placeholder="Madhuka Perera" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="field">
              <label>Confirm password</label>
              <input type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
            <button className="btn btn-gold btn-block" type="submit">Create account</button>
          </form>
        </div>
      </div>
    </section>
  );
}

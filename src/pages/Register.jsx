import { useState } from "react";
import { useApp } from "../AppContext";

export default function Register({ goto }) {
  const { register, toast } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    if (password !== confirm) {
      toast("Passwords don't match");
      return;
    }

    try {
      // The backend requires email verification before login is allowed,
      // so we can't log the user in right after registering here - that
      // call would always fail with a 403 "please verify your email"
      // error. Send them to check their inbox and log in once verified.
      await register(name.trim(), email.trim(), password);

      toast("Account created! Check your email to verify it, then log in.");
      goto("login");
    } catch (error) {
      toast(error.message);
    }
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
          <p>
            Set up your workspace in under a minute — start solo and invite your
            team whenever you're ready.
          </p>
        </div>
        <div className="auth-form-wrap">
          <form className="auth-form" onSubmit={handleRegister}>
            <h1>Create your account</h1>
            <p className="sub">
              Already have one?{" "}
              <a className="link-teal" onClick={() => goto("login")}>
                Log in
              </a>
            </p>
            <div className="field">
              <label>Full name</label>
              <input
                type="text"
                placeholder="Madhuka Perera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Confirm password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-gold btn-block" type="submit">
              Create account
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

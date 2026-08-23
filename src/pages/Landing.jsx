export default function Landing({ goto }) {
  return (
    <section className="view active">
      <nav className="landing-nav">
        <div className="brand">
          <svg className="brand-mark" viewBox="0 0 26 26">
            <circle cx="13" cy="13" r="11" fill="none" stroke="#E3A64A" strokeWidth="1.5" />
            <path d="M4 13 Q13 4 22 13 Q13 22 4 13" fill="none" stroke="#4FB8AC" strokeWidth="1.5" />
          </svg>
          Loom
        </div>
        <div className="landing-nav-links">
          <a href="#features-sec">Features</a>
          <a href="#about-sec">About</a>
          <a onClick={() => goto('login')}>Log in</a>
          <button className="btn btn-gold" onClick={() => goto('register')}>Get started</button>
        </div>
      </nav>

      <div className="hero">
        <div>
          <div className="eyebrow">SOLO · TEAM · CO-OP PLANNING</div>
          <h1>
            Weave every task
            <br />
            into <em>one clear thread.</em>
          </h1>
          <p className="lead">
            Loom is a project planning workspace that carries a single task from your personal to-do list all the
            way to a cross-team board — without losing the thread.
          </p>
          <div className="hero-ctas">
            <button className="btn btn-gold" onClick={() => goto('register')}>Get started free</button>
            <button className="btn btn-ghost" onClick={() => goto('login')}>Log in</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><b>12,400+</b><span>Boards woven</span></div>
            <div className="hero-stat"><b>3</b><span>Planning levels</span></div>
            <div className="hero-stat"><b>72%</b><span>Avg. completion rate</span></div>
          </div>
        </div>
        <div className="loom-visual">
          <svg viewBox="0 0 300 420">
            <path className="thread-path" d="M40 40 C 140 90, 100 220, 190 240 C 260 255, 200 340, 80 360" />
          </svg>
          <div className="thread-card tc-1"><div className="tc-tab"></div><h4>Personal Board</h4><p>4 tasks due this week</p></div>
          <div className="thread-card tc-2"><div className="tc-tab"></div><h4>Software Eng. Project</h4><p>Frontend Sprint · 68% done</p></div>
          <div className="thread-card tc-3"><div className="tc-tab"></div><h4>Marketing Team</h4><p>6 members online</p></div>
        </div>
      </div>

      <div className="section" id="features-sec">
        <div className="section-head">
          <h2>Built for how work actually spreads</h2>
          <p>
            From a private list to a company-wide dashboard, Loom keeps the same board, task and comment model at
            every scale — so nothing needs re-learning as your team grows.
          </p>
        </div>
        <div className="feature-grid">
          <div className="feature-card"><div className="feature-num">01</div><h3>Personal Kanban</h3><p>A private board for your own sprints, errands and research — visible to no one else.</p></div>
          <div className="feature-card"><div className="feature-num">02</div><h3>Team Boards</h3><p>Shared columns, live activity feed and @mentions keep a whole team on the same page.</p></div>
          <div className="feature-card"><div className="feature-num">03</div><h3>Org Rollups</h3><p>See every team's progress on one dashboard, with reports built automatically.</p></div>
          <div className="feature-card"><div className="feature-num">04</div><h3>Due-date Calendar</h3><p>Every task with a deadline shows up on a shared monthly calendar, automatically.</p></div>
          <div className="feature-card"><div className="feature-num">05</div><h3>Comments &amp; Files</h3><p>Discuss a task, attach a file, and resolve it — without leaving the card.</p></div>
          <div className="feature-card"><div className="feature-num">06</div><h3>Progress Analytics</h3><p>Completion rate, per-member load and team velocity, charted in real time.</p></div>
        </div>
      </div>

      <div className="section" id="about-sec">
        <div className="about-wrap">
          <div>
            <h2>Three planning levels, one model</h2>
            <p>
              Most tools force a choice between a personal to-do app and heavyweight team software. Loom is the
              same board underneath at every level, so a task can move from your desk to your whole department
              without changing shape.
            </p>
            <button className="btn btn-outline-gold" onClick={() => goto('register')}>Start weaving →</button>
          </div>
          <div className="plan-list">
            <div className="plan-item"><b>Personal Planning</b><span>Private board · calendar · notes</span></div>
            <div className="plan-item"><b>Team Planning</b><span>Shared boards · assignments · chat</span></div>
            <div className="plan-item"><b>Org / Co-op Planning</b><span>Cross-team boards · reports · roles</span></div>
          </div>
        </div>
      </div>

      <footer>
        <div className="footer-grid">
          <div className="brand" style={{ fontSize: 16 }}>Loom</div>
          <p>Dummy data demo interface — built for a UI coursework brief. Not a real product.</p>
        </div>
      </footer>
    </section>
  );
}

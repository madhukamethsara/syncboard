import { useState } from "react";
import { useApp } from "../AppContext";
import { joinTeamByCode } from "../api/teamApi";

export default function JoinTeam({ initialCode, goto }) {
  const { currentUser, authLoading, toast } = useApp();
  const [code, setCode] = useState(initialCode || "");
  const [status, setStatus] = useState("idle"); // idle | joining | success | error
  const [message, setMessage] = useState("");

  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase();

    if (!trimmed) {
      toast("Please enter a join code");
      return;
    }

    if (trimmed.length !== 6) {
      toast("Join code must be exactly 6 characters");
      return;
    }

    try {
      setStatus("joining");

      const data = await joinTeamByCode(trimmed);

      setStatus("success");
      setMessage(
        data.team?.name
          ? `You've joined ${data.team.name}.`
          : "You've joined the team."
      );
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Failed to join team");
    }
  };

  if (authLoading) {
    return (
      <section className="view active">
        <div className="auth-wrap">
          <div className="auth-side">
            <div className="eyebrow">JOIN TEAM</div>
            <h2>
              Join a team
              <br />
              with a code.
            </h2>
          </div>
          <div className="auth-form-wrap">
            <div className="auth-form">
              <h1>Loading...</h1>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!currentUser) {
    return (
      <section className="view active">
        <div className="auth-wrap">
          <div className="auth-side">
            <div className="eyebrow">JOIN TEAM</div>
            <h2>
              Join a team
              <br />
              with a code.
            </h2>
          </div>
          <div className="auth-form-wrap">
            <div className="auth-form">
              <h1>Log in to join</h1>
              <p className="sub">
                Log in (or create an account) and we'll bring
                you right back here to join the team.
              </p>
              <button
                className="btn btn-gold btn-block"
                onClick={() => goto("login")}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="view active">
      <div className="auth-wrap">
        <div className="auth-side">
          <div className="eyebrow">JOIN TEAM</div>
          <h2>
            Join a team
            <br />
            with a code.
          </h2>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-form">
            {status === "joining" && (
              <h1>Joining the team...</h1>
            )}

            {status === "success" && (
              <>
                <h1>You're in</h1>
                <p className="sub">{message}</p>
                <button
                  className="btn btn-gold btn-block"
                  onClick={() => goto("app")}
                >
                  Go to SyncBoard
                </button>
              </>
            )}

            {status === "error" && (
              <>
                <h1>Couldn't join team</h1>
                <div className="auth-error">{message}</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginTop: 16,
                  }}
                >
                  <button
                    className="btn btn-gold btn-block"
                    onClick={() => {
                      setStatus("idle");
                      setMessage("");
                    }}
                  >
                    Try again
                  </button>
                  <button
                    className="btn btn-ghost btn-block"
                    onClick={() => goto("app")}
                  >
                    Go to SyncBoard
                  </button>
                </div>
              </>
            )}

            {status === "idle" && (
              <>
                <h1>Enter join code</h1>
                <p className="sub">
                  Enter the 6-character code shared by your
                  team owner.
                </p>

                <div className="field">
                  <label>Join Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) =>
                      setCode(
                        e.target.value
                          .toUpperCase()
                          .slice(0, 6)
                      )
                    }
                    placeholder="e.g. A3K9X2"
                    maxLength={6}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleJoin();
                      }
                    }}
                    style={{
                      fontFamily: "monospace",
                      fontSize: "1.2rem",
                      letterSpacing: "0.2em",
                      textAlign: "center",
                    }}
                  />
                </div>

                <button
                  className="btn btn-gold btn-block"
                  onClick={handleJoin}
                  style={{ marginTop: 20 }}
                >
                  Join Team
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

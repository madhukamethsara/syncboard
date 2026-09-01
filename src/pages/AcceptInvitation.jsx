import { useEffect, useState } from "react";
import { useApp } from "../AppContext";
import { acceptTeamInvitation } from "../api/teamApi";

// Rendered when the URL is /invitations/:token/accept (the link sent by
// the backend's team invitation email). The accept endpoint requires the
// user to be logged in, so if they aren't yet, we ask them to log in
// first - goto("login") keeps this token pending and App.jsx sends them
// straight back here once afterAuth() fires.
export default function AcceptInvitation({ token, goto }) {
  const { currentUser, authLoading, toast } = useApp();
  const [status, setStatus] = useState("checking"); // checking | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (authLoading || !currentUser) {
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        const data = await acceptTeamInvitation(token);

        if (!cancelled) {
          setStatus("success");
          setMessage(
            data.team?.name
              ? `You've joined ${data.team.name}.`
              : "You've joined the team."
          );
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setMessage(error.message || "This invitation is invalid or has expired");
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [token, authLoading, currentUser]);

  return (
    <section className="view active">
      <div className="auth-wrap">
        <div className="auth-side">
          <div className="eyebrow">TEAM INVITATION</div>
          <h2>
            You've been
            <br />
            invited to join
            <br />
            a team.
          </h2>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-form">
            {!authLoading && !currentUser && (
              <>
                <h1>Log in to accept</h1>
                <p className="sub">
                  Log in (or create an account with the invited email) and
                  we'll bring you right back here.
                </p>
                <button
                  className="btn btn-gold btn-block"
                  onClick={() => goto("login")}
                >
                  Log in
                </button>
              </>
            )}

            {(authLoading || (currentUser && status === "checking")) && (
              <h1>Joining the team…</h1>
            )}

            {currentUser && status === "success" && (
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

            {currentUser && status === "error" && (
              <>
                <h1>Couldn't accept invitation</h1>
                <div className="auth-error">{message}</div>
                <button
                  className="btn btn-gold btn-block"
                  onClick={() => {
                    toast("Dismissed");
                    goto("app");
                  }}
                >
                  Continue to SyncBoard
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

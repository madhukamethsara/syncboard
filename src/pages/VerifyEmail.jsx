import { useEffect, useState } from "react";
import { verifyEmail } from "../api/authApi";

// Rendered when the URL is /verify-email/:token (the link sent by the
// backend's verification email). Calls the API once on mount and shows
// the result, then lets the user head to the login page.
export default function VerifyEmail({ token, goto }) {
  const [status, setStatus] = useState("checking"); // checking | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        await verifyEmail(token);

        if (!cancelled) {
          setStatus("success");
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setMessage(error.message || "Verification link is invalid or has expired");
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <section className="view active">
      <div className="auth-wrap">
        <div className="auth-side">
          <div className="eyebrow">EMAIL VERIFICATION</div>
          <h2>
            Almost there —
            <br />
            just confirming
            <br />
            it's really you.
          </h2>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-form">
            {status === "checking" && <h1>Verifying your email…</h1>}

            {status === "success" && (
              <>
                <h1>Email verified</h1>
                <p className="sub">Your account is ready. You can log in now.</p>
                <button
                  className="btn btn-gold btn-block"
                  onClick={() => goto("login")}
                >
                  Go to login
                </button>
              </>
            )}

            {status === "error" && (
              <>
                <h1>Verification failed</h1>
                <div className="auth-error">{message}</div>
                <button
                  className="btn btn-gold btn-block"
                  onClick={() => goto("login")}
                >
                  Back to login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

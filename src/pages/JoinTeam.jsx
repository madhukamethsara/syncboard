import { useState, useRef, useEffect, useCallback } from "react";
import { useApp } from "../AppContext";
import { joinTeamByCode } from "../api/teamApi";

const CODE_LENGTH = 6;

export default function JoinTeam({ initialCode, goto }) {
  const { currentUser, authLoading, toast, refreshBoards } = useApp();

  const [code, setCode] = useState(() => {
    if (initialCode) {
      return initialCode.toUpperCase().slice(0, CODE_LENGTH).split("").concat(Array(CODE_LENGTH).fill("")).slice(0, CODE_LENGTH);
    }
    return Array(CODE_LENGTH).fill("");
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [animatingIndex, setAnimatingIndex] = useState(-1);

  const inputRefs = useRef([]);

  const handleSubmit = useCallback(async () => {
    const trimmed = code.join("").trim().toUpperCase();

    if (trimmed.length !== CODE_LENGTH) {
      toast("Please enter all 6 characters");
      return;
    }

    try {
      setStatus("joining");
      const data = await joinTeamByCode(trimmed);
      refreshBoards();
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
  }, [code, toast]);

  useEffect(() => {
    if (activeIndex < CODE_LENGTH && inputRefs.current[activeIndex]) {
      inputRefs.current[activeIndex].focus();
    }
  }, [activeIndex]);

  useEffect(() => {
    if (status === "idle" && code.every((c) => c !== "")) {
      handleSubmit();
    }
  }, [code, status, handleSubmit]);

  useEffect(() => {
    if (status === "success") {
      let delay = 0;
      for (let i = 0; i < CODE_LENGTH; i++) {
        setTimeout(() => setAnimatingIndex(i), delay);
        delay += 80;
      }
      const timer = setTimeout(() => goto("app"), 3000);
      return () => clearTimeout(timer);
    }
  }, [status, goto]);

  const handleInput = (index, value) => {
    if (status === "joining" || status === "success") return;

    const char = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(-1);
    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);

    if (char && index < CODE_LENGTH - 1) {
      setActiveIndex(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (status === "joining" || status === "success") return;

    if (e.key === "Backspace") {
      e.preventDefault();
      const newCode = [...code];
      if (code[index]) {
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        newCode[index - 1] = "";
        setCode(newCode);
        setActiveIndex(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      setActiveIndex(index + 1);
    } else if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handlePaste = (e) => {
    if (status === "joining" || status === "success") return;

    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, CODE_LENGTH);

    if (pasted.length === 0) return;

    const newCode = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);
    setActiveIndex(Math.min(pasted.length, CODE_LENGTH - 1));
  };

  const handleReset = () => {
    setCode(Array(CODE_LENGTH).fill(""));
    setActiveIndex(0);
    setStatus("idle");
    setMessage("");
    setAnimatingIndex(-1);
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
              <>
                <h1>Joining the team...</h1>
                <div className="otp-loading">
                  <div className="otp-spinner"></div>
                </div>
              </>
            )}

            {status === "success" && (
              <>
                <h1 className="otp-success-title">You're in!</h1>
                <p className="sub">{message}</p>
                <div className="otp-input-group">
                  {code.map((char, i) => (
                    <div
                      key={i}
                      className={`otp-input-box otp-success-box ${
                        i <= animatingIndex ? "success" : ""
                      }`}
                    >
                      {char}
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-gold btn-block"
                  onClick={() => goto("app")}
                  style={{ marginTop: 16 }}
                >
                  Go to SyncBoard
                </button>
              </>
            )}

            {status === "error" && (
              <>
                <h1>Couldn't join team</h1>
                <div className="auth-error">{message}</div>
                <div className="otp-input-group shake">
                  {code.map((char, i) => (
                    <div key={i} className="otp-input-box error">
                      {char}
                    </div>
                  ))}
                </div>
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
                    onClick={handleReset}
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

                <div className="otp-input-group">
                  {code.map((char, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text"
                      maxLength={1}
                      className={`otp-input-box ${
                        char ? "filled" : ""
                      } ${activeIndex === i ? "active" : ""}`}
                      value={char}
                      onChange={(e) => handleInput(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={handlePaste}
                      onFocus={() => setActiveIndex(i)}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                <p className="otp-helper" onClick={handlePaste}>
                  Paste a code from clipboard
                </p>

                <button
                  className="btn btn-gold btn-block"
                  onClick={handleSubmit}
                  disabled={code.some((c) => !c)}
                  style={{ marginTop: 8 }}
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
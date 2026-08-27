import { useState } from "react";
import { useApp } from "../AppContext";

import {
  updateCurrentUser,
  changeCurrentUserPassword,
} from "../api/userapi";

export default function Profile() {
  const { currentUser, setCurrentUser, toast } = useApp();

  const [name, setName] = useState(currentUser.name || "");
  const [email] = useState(currentUser.email || "");
  const [avatar, setAvatar] = useState(currentUser.avatar || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      const data = await updateCurrentUser({
        name,
        avatar,
      });

      setCurrentUser(data.user);

      toast("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      toast(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast("Please fill all password fields");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast("New passwords do not match");
        return;
      }

      setPasswordLoading(true);

      const data = await changeCurrentUserPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      toast(data.message || "Password changed successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password change error:", error);
      toast(error.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="page-pad view active">
      <div className="page-title-row">
        <div>
          <h1>Profile</h1>
          <p className="sub">Your personal account details.</p>
        </div>
      </div>

      {!currentUser.isEmailVerified && (
        <div className="panel" style={{ marginBottom: 20 }}>
          <strong>Email verification required</strong>

          <p style={{ marginTop: 6 }}>
            Please check your email and verify your account.
          </p>
        </div>
      )}

      <div
        className="grid-2"
        style={{
          gridTemplateColumns: "0.9fr 1.1fr",
          alignItems: "start",
        }}
      >
        <div
          className="panel"
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "220px",
              overflow: "hidden",
              borderRadius: "10px",
              marginBottom: "18px",
              background: "#1a1d27",
            }}
          >
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={`${currentUser.name} profile`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  fontWeight: "bold",
                  background: currentUser.color || "#555",
                }}
              >
                {currentUser.initials ||
                  currentUser.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h3
            style={{
              margin: "0 0 4px",
            }}
          >
            {currentUser.name}
          </h3>

          <p
            style={{
              color: "var(--text-faint)",
              fontSize: 13,
              margin: "0 0 10px",
            }}
          >
            {currentUser.email}
          </p>

          <div
            style={{
              marginBottom: 16,
            }}
          >
            {currentUser.isEmailVerified ? (
              <span className="verification-badge verified">
                ✓ Verified
              </span>
            ) : (
              <span className="verification-badge unverified">
                Not verified
              </span>
            )}
          </div>
        </div>

        <div className="panel">
          <h3>Account details</h3>

          <div className="field">
            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Email</label>

            <input
              type="email"
              value={email}
              disabled
            />
          </div>

          <div className="field">
            <label>Avatar URL</label>

            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.png"
            />
          </div>

          <button
            className="btn btn-gold"
            style={{
              marginTop: 10,
              marginBottom: 24,
            }}
            onClick={handleSaveProfile}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save profile"}
          </button>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border)",
              margin: "10px 0 24px",
            }}
          />

          <h3>Change password</h3>

          <div className="field">
            <label>Current password</label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="field-grid">
            <div className="field">
              <label>New password</label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="field">
              <label>Confirm password</label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            className="btn btn-ghost"
            style={{
              marginTop: 10,
              marginBottom: 24,
            }}
            onClick={handleChangePassword}
            disabled={passwordLoading}
          >
            {passwordLoading ? "Changing..." : "Change password"}
          </button>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border)",
              margin: "10px 0 24px",
            }}
          />

          <h3>Notifications</h3>

          <div className="settings-row">
            <div>
              <div className="sr-label">
                Email notifications
              </div>

              <div className="sr-desc">
                Task assignments and due-date reminders
              </div>
            </div>

            <div
              className={`toggle${emailNotif ? " on" : ""}`}
              onClick={() => setEmailNotif(!emailNotif)}
            />
          </div>

          <div className="settings-row">
            <div>
              <div className="sr-label">
                Push notifications
              </div>

              <div className="sr-desc">
                Real-time alerts on this device
              </div>
            </div>

            <div
              className={`toggle${pushNotif ? " on" : ""}`}
              onClick={() => setPushNotif(!pushNotif)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
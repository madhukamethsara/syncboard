import { useApp } from "../AppContext";

export default function Settings() {
  const {
    theme,
    setTheme,
    notificationsEnabled,
    setNotificationsEnabled,
    compactSidebar,
    setCompactSidebar,
    toast,
  } = useApp();

  function handleThemeChange(selectedTheme) {
    setTheme(selectedTheme);
    toast(`Theme changed to ${selectedTheme}`);
  }

  return (
    <div className="page-pad view active">
      <div className="page-title-row">
        <div>
          <h1>Settings</h1>
          <p className="sub">Workspace preferences.</p>
        </div>
      </div>

      <div
        className="panel"
        style={{ maxWidth: 640 }}
      >
        <h3>Theme</h3>

        <div className="theme-swatch-row">
          <button
            type="button"
            className={`theme-swatch ${
              theme === "dark" ? "active" : ""
            }`}
            style={{
              background: "#12141C",
            }}
            onClick={() =>
              handleThemeChange("dark")
            }
            title="Dark"
          />

          <button
            type="button"
            className={`theme-swatch ${
              theme === "light" ? "active" : ""
            }`}
            style={{
              background: "#F4F1EA",
            }}
            onClick={() =>
              handleThemeChange("light")
            }
            title="Light"
          />

          <button
            type="button"
            className={`theme-swatch ${
              theme === "system" ? "active" : ""
            }`}
            style={{
              background:
                "linear-gradient(90deg, #12141C 50%, #F4F1EA 50%)",
            }}
            onClick={() =>
              handleThemeChange("system")
            }
            title="System"
          />
        </div>
      </div>

      <div
        className="panel"
        style={{
          maxWidth: 640,
          marginTop: 16,
        }}
      >
        <h3>Preferences</h3>

        <div className="settings-row">
          <div>
            <div className="sr-label">
              Notifications
            </div>

            <div className="sr-desc">
              Task assignments and reminders
            </div>
          </div>

          <button
            type="button"
            className={`toggle ${
              notificationsEnabled ? "on" : ""
            }`}
            onClick={() =>
              setNotificationsEnabled(
                !notificationsEnabled
              )
            }
            aria-label="Toggle notifications"
          />
        </div>

        <div className="settings-row">
          <div>
            <div className="sr-label">
              Compact sidebar
            </div>

            <div className="sr-desc">
              Use a smaller navigation sidebar
            </div>
          </div>

          <button
            type="button"
            className={`toggle ${
              compactSidebar ? "on" : ""
            }`}
            onClick={() =>
              setCompactSidebar(
                !compactSidebar
              )
            }
            aria-label="Toggle compact sidebar"
          />
        </div>
      </div>

      <div
        className="panel"
        style={{
          maxWidth: 640,
          marginTop: 16,
        }}
      >
        <h3>Account</h3>

        <div className="settings-row">
          <div>
            <div className="sr-label">
              Deactivate account
            </div>

            <div className="sr-desc">
              Hide your profile and pause
              notifications
            </div>
          </div>

          <button
            className="btn btn-ghost btn-sm"
            disabled
            title="Backend support required"
          >
            Deactivate
          </button>
        </div>

        <div className="settings-row">
          <div>
            <div className="sr-label">
              Delete account
            </div>

            <div className="sr-desc">
              Permanently remove your account
              and data
            </div>
          </div>

          <button
            className="btn btn-danger btn-sm"
            disabled
            title="Backend support required"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
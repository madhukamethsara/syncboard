import { useApp } from "../AppContext";

const NAV_MAIN = [
  { key: "dashboard", label: "Dashboard", icon: "▤" },
  { key: "boards", label: "Boards", icon: "▥" },
  { key: "calendar", label: "Calendar", icon: "▦" },
  { key: "team", label: "Teams", icon: "◎" },
  { key: "analytics", label: "Analytics", icon: "◈" },
];

const NAV_PERSONAL = [
  { key: "notifications", label: "Notifications", icon: "◍" },
  { key: "settings", label: "Settings", icon: "✦" },
];

export default function Sidebar({
  activeView,
  gotoApp,
}) {
  const {
    currentUser,
    compactSidebar,
  } = useApp();

  return (
    <aside
      className={`sidebar${
        compactSidebar ? " compact" : ""
      }`}
    >
      <div className="sidebar-brand">
        <svg
          width="20"
          height="20"
          viewBox="0 0 26 26"
        >
          <circle
            cx="13"
            cy="13"
            r="11"
            fill="none"
            stroke="#E3A64A"
            strokeWidth="1.5"
          />

          <path
            d="M4 13 Q13 4 22 13 Q13 22 4 13"
            fill="none"
            stroke="#4FB8AC"
            strokeWidth="1.5"
          />
        </svg>

        <span className="sidebar-brand-text">
          SyncBoard
        </span>
      </div>

      <div className="side-thread"></div>

      <div className="nav-group">
        {NAV_MAIN.map((n) => (
          <div
            key={n.key}
            className={`nav-item${
              activeView === n.key
                ? " active"
                : ""
            }`}
            onClick={() =>
              gotoApp(n.key)
            }
            title={
              compactSidebar
                ? n.label
                : undefined
            }
          >
            <span className="nav-dot"></span>

            <span className="nav-icon">
              {n.icon}
            </span>

            <span className="nav-label">
              {n.label}
            </span>
          </div>
        ))}
      </div>

      <div className="nav-group">
        <div className="nav-group-label">
          Personal
        </div>

        {NAV_PERSONAL.map((n) => (
          <div
            key={n.key}
            className={`nav-item${
              activeView === n.key
                ? " active"
                : ""
            }`}
            onClick={() =>
              gotoApp(n.key)
            }
            title={
              compactSidebar
                ? n.label
                : undefined
            }
          >
            <span className="nav-dot"></span>

            <span className="nav-icon">
              {n.icon}
            </span>

            <span className="nav-label">
              {n.label}
            </span>
          </div>
        ))}
      </div>

      <div className="sidebar-bottom">
        <div
          className="side-user"
          onClick={() =>
            gotoApp("profile")
          }
          title={
            compactSidebar
              ? "View profile"
              : undefined
          }
        >
          <div
            className="avatar"
            style={{
              background:
                currentUser?.color ||
                "#E3A64A",
              position: "relative",
            }}
          >
            {currentUser?.initials ||
              currentUser?.name
                ?.slice(0, 2)
                .toUpperCase() ||
              "U"}
          </div>

          <div className="side-user-info">
            <div className="u-name">
              {currentUser?.name ||
                "User"}
            </div>

            <div className="u-role">
              View profile
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
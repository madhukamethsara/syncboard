import { useApp } from "../AppContext";

export default function Avatar({
  userId,
  user: providedUser,
  size = 32,
  showOnline = false,
  title = true,
}) {
  const { userById } = useApp();

  const id =
    typeof userId === "object"
      ? userId?._id || userId?.id
      : userId;

  const user =
    providedUser ||
    (typeof userId === "object" ? userId : null) ||
    userById(id);

  const name =
    user?.name?.trim() ||
    user?.email?.trim() ||
    "Unknown User";

  const initials = getInitials(name);

  const avatarUrl =
    typeof user?.avatar === "string"
      ? user.avatar.trim()
      : "";

  return (
    <div
      className="avatar"
      title={title ? name : undefined}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        fontSize: Math.max(10, Math.round(size * 0.34)),
        position: "relative",
        overflow: "visible",
      }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <span
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {initials}
        </span>
      )}

      {showOnline && user?.online && (
        <span
          className="avatar-online"
          aria-label="Online"
        />
      )}
    </div>
  );
}

function getInitials(name) {
  if (!name) {
    return "?";
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}
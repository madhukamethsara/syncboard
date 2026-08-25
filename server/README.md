# Loom API — Express + MongoDB

REST API backing the Loom frontend. Auth is JWT-based (`Authorization: Bearer <token>`).

## Setup

```bash
cp .env.example .env   # set MONGO_URI and JWT_SECRET
npm install
npm run seed            # wipes and repopulates the database with demo data
npm run dev              # nodemon-style watch mode via `node --watch`
# or
npm start                 # plain node
```

Environment variables (`.env`):

| Variable     | Default                              | Notes                              |
|--------------|---------------------------------------|-------------------------------------|
| `PORT`       | `4000`                                | HTTP port                           |
| `MONGO_URI`  | `mongodb://127.0.0.1:27017/loom`      | Any MongoDB connection string       |
| `JWT_SECRET` | `dev-secret-change-me`                | **Change this in production**       |

## Data model

- **User** — name, email, passwordHash, initials, color, role (`Owner`/`Admin`/`Member`), online
- **Team** — name, members (User refs)
- **Board** — name, desc, team (nullable Team ref, `null` = personal board), color, owner (User ref)
- **Task** — board ref, title, desc, priority (`Low`/`Medium`/`High`), status (`todo`/`doing`/`done`), due (`YYYY-MM-DD` string), assignee (User ref), labels[], attachments[], comments[] (embedded: user, text, createdAt)
- **Activity** — user ref, board ref, task ref, text (feed entries, e.g. "moved **X** to Doing")
- **Notification** — user ref (recipient), icon, text, read

## Auth

| Method | Path                | Body                          | Notes                          |
|--------|----------------------|--------------------------------|----------------------------------|
| POST   | `/api/auth/register` | `{ name, email, password }`   | Creates a user, returns `{ token, user }` |
| POST   | `/api/auth/login`    | `{ email, password }`          | Returns `{ token, user }`       |
| GET    | `/api/auth/me`        | —                               | Returns the current user (requires token) |

All routes below require `Authorization: Bearer <token>`.

## Users

| Method | Path         | Notes            |
|--------|--------------|-------------------|
| GET    | `/api/users` | List all users    |

## Teams

| Method | Path                              | Body                    | Notes                          |
|--------|-------------------------------------|--------------------------|----------------------------------|
| GET    | `/api/teams`                        | —                         | List all teams                 |
| POST   | `/api/teams`                        | `{ name, members? }`     | Create a team                  |
| PUT    | `/api/teams/:id`                    | `{ name?, members? }`    | Update a team                  |
| POST   | `/api/teams/:id/invite`             | `{ email? }`               | Demo-only invite (no email sent) |
| DELETE | `/api/teams/:id/members/:userId`    | —                         | Remove a member                |

## Boards

| Method | Path                | Body                                  | Notes                                   |
|--------|----------------------|-----------------------------------------|-------------------------------------------|
| GET    | `/api/boards`        | —                                        | List all boards                          |
| POST   | `/api/boards`        | `{ name, desc?, team?, color? }`        | Create a board                           |
| PUT    | `/api/boards/:id`    | `{ name?, desc?, team?, color? }`       | Update a board                           |
| DELETE | `/api/boards/:id`    | —                                        | Deletes the board **and all its tasks**  |

## Tasks

| Method | Path                          | Body                                                                 | Notes                                             |
|--------|---------------------------------|------------------------------------------------------------------------|------------------------------------------------------|
| GET    | `/api/tasks?board=<id>`        | —                                                                        | List tasks, optionally filtered by board             |
| POST   | `/api/tasks`                    | `{ board, title, desc?, priority?, status?, due?, assignee?, labels?, attachments? }` | Creates a task, logs activity, notifies assignee     |
| PUT    | `/api/tasks/:id`                | any of the fields above                                                | Full edit; logs activity on status/assignee changes |
| PATCH  | `/api/tasks/:id/status`         | `{ status }`                                                             | Lightweight endpoint for Kanban drag-and-drop        |
| DELETE | `/api/tasks/:id`                | —                                                                        | Deletes the task, logs activity                      |
| POST   | `/api/tasks/:id/comments`      | `{ text }`                                                               | Adds a comment, logs activity, notifies assignee      |

## Activity feed

| Method | Path                                 | Notes                                  |
|--------|----------------------------------------|-------------------------------------------|
| GET    | `/api/activity?board=<id>&limit=20`   | Most recent activity first (default limit 20, max 100) |

## Notifications

| Method | Path                            | Notes                                  |
|--------|-----------------------------------|-------------------------------------------|
| GET    | `/api/notifications`             | Notifications for the current user       |
| PATCH  | `/api/notifications/read-all`    | Marks all of the current user's notifications as read |

## Error format

All errors are returned as `{ "error": "message" }` with an appropriate HTTP status code (400, 401, 404, 409, 500).

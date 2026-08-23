# Loom — React + Vite

A React/Vite port of the Loom project-planning demo (originally a single HTML file).

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

## Build

```bash
npm run build
```

## Structure

- `src/data/dummyData.js` — all dummy data (users, teams, boards, tasks, activity, notifications)
- `src/AppContext.jsx` — global app state (React Context) and actions (create/edit/delete tasks & boards, comments, etc.)
- `src/pages/` — top-level views: Landing, Login, Register, Dashboard, Boards, Kanban, Calendar, Team, Analytics, Notifications, Profile, Settings
- `src/components/` — shared UI: Sidebar, Topbar, AppShell, Avatar, Toast, TaskModal, BoardModal, TaskDrawer
- `src/index.css` — all styles (ported 1:1 from the original CSS, using the same CSS custom properties)

This is still a dummy-data demo (no backend) — all state lives in memory via React state/Context and resets on reload.

---

Old template notes below (kept for reference):

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

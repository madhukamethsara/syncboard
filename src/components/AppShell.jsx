import {
  useEffect,
  useState,
} from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TaskModal from "./TaskModal";
import BoardModal from "./BoardModal";
import TaskDrawer from "./TaskDrawer";

import Dashboard from "../pages/Dashboard";
import Boards from "../pages/Boards";
import Kanban from "../pages/Kanban";
import Calendar from "../pages/Calendar";
import Team from "../pages/Team";
import Analytics from "../pages/Analytics";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

export default function AppShell({
  logout,
}) {
  const [view, setView] = useState(
    () =>
      localStorage.getItem(
        "syncboard-view"
      ) || "dashboard"
  );

  const [
    currentBoardId,
    setCurrentBoardId,
  ] = useState(
    () =>
      localStorage.getItem(
        "syncboard-current-board"
      ) || null
  );

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    taskModalOpen,
    setTaskModalOpen,
  ] = useState(false);

  const [
    editingTaskId,
    setEditingTaskId,
  ] = useState(null);

  const [
    defaultStatus,
    setDefaultStatus,
  ] = useState("todo");

  const [
    boardModalOpen,
    setBoardModalOpen,
  ] = useState(false);

  const [
    editingBoardId,
    setEditingBoardId,
  ] = useState(null);

  const [
    drawerTaskId,
    setDrawerTaskId,
  ] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      "syncboard-view",
      view
    );
  }, [view]);

  useEffect(() => {
    if (currentBoardId) {
      localStorage.setItem(
        "syncboard-current-board",
        currentBoardId
      );
    } else {
      localStorage.removeItem(
        "syncboard-current-board"
      );
    }
  }, [currentBoardId]);

  function gotoApp(v) {
    setView(v);
  }

  function openBoard(id) {
    setCurrentBoardId(id);
    setView("kanban");
  }

  function openTaskModal(
    taskId,
    status
  ) {
    setEditingTaskId(
      taskId || null
    );

    setDefaultStatus(
      status || "todo"
    );

    setTaskModalOpen(true);
  }

  function closeTaskModal() {
    setTaskModalOpen(false);
  }

  function openBoardModal(
    boardId
  ) {
    setEditingBoardId(
      boardId || null
    );

    setBoardModalOpen(true);
  }

  function closeBoardModal() {
    setBoardModalOpen(false);
  }

  function openDrawer(taskId) {
    setDrawerTaskId(taskId);
  }

  function closeDrawer() {
    setDrawerTaskId(null);
  }

  function handleSearch(q) {
    setSearchTerm(q);
  }

  return (
    <div className="app-shell active">
      <Sidebar
        activeView={view}
        gotoApp={gotoApp}
      />

      <main className="main">
        <Topbar
          gotoApp={gotoApp}
          openTaskModal={
            openTaskModal
          }
          logout={logout}
          onSearch={handleSearch}
        />

        {view ===
          "dashboard" && (
          <Dashboard
            gotoApp={gotoApp}
            openBoard={openBoard}
            openDrawer={openDrawer}
            openTaskModal={
              openTaskModal
            }
            openBoardModal={
              openBoardModal
            }
          />
        )}

        {view === "boards" && (
          <Boards
            openBoard={openBoard}
            openBoardModal={
              openBoardModal
            }
          />
        )}

        {view === "kanban" && (
          <Kanban
            currentBoardId={
              currentBoardId
            }
            gotoApp={gotoApp}
            openTaskModal={
              openTaskModal
            }
            openDrawer={
              openDrawer
            }
            openBoardModal={
              openBoardModal
            }
            searchTerm={
              searchTerm
            }
          />
        )}

        {view ===
          "calendar" && (
          <Calendar
            openDrawer={
              openDrawer
            }
          />
        )}

        {view === "team" && (
          <Team />
        )}

        {view ===
          "analytics" && (
          <Analytics />
        )}

        {view ===
          "notifications" && (
          <Notifications />
        )}

        {view ===
          "profile" && (
          <Profile />
        )}

        {view ===
          "settings" && (
          <Settings />
        )}
      </main>

      {taskModalOpen && (
        <TaskModal
          editingTaskId={
            editingTaskId
          }
          defaultStatus={
            defaultStatus
          }
          currentBoardId={
            currentBoardId
          }
          onClose={
            closeTaskModal
          }
        />
      )}

      {boardModalOpen && (
        <BoardModal
          editingBoardId={
            editingBoardId
          }
          onClose={
            closeBoardModal
          }
          onSaved={(newId) => {
            if (newId) {
              setCurrentBoardId(
                newId
              );
            }
          }}
        />
      )}

      {drawerTaskId && (
        <TaskDrawer
          taskId={
            drawerTaskId
          }
          onClose={
            closeDrawer
          }
          onEdit={(id) =>
            openTaskModal(id)
          }
          onDeleted={() => {}}
        />
      )}
    </div>
  );
}
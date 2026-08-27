import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  USERS,
  TEAMS,
  BOARDS as INITIAL_BOARDS,
  INITIAL_TASKS,
  ACTIVITY,
  NOTIFICATIONS,
} from "./data/dummyData";

import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
} from "./api/authApi";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [boards, setBoards] = useState(INITIAL_BOARDS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const toastTimer = useRef(null);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    setCurrentUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await registerUser({
      name,
      email,
      password,
    });

    return data.user;
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    setToastShow(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastShow(false), 2400);
  }, []);

  const userById = useCallback((id) => USERS.find((u) => u.id === id), []);
  const boardById = useCallback(
    (id) => boards.find((b) => b.id === id),
    [boards],
  );
  const teamById = useCallback((id) => TEAMS.find((t) => t.id === id), []);
  const tasksForBoard = useCallback(
    (id) => tasks.filter((t) => t.board === id),
    [tasks],
  );

  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await getCurrentUser();
        setCurrentUser(data.user);
      } catch {
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    }

    checkAuth();
  }, []);

  const boardProgress = useCallback(
    (boardId) => {
      const ts = tasks.filter((t) => t.board === boardId);
      if (!ts.length) return 0;
      const done = ts.filter((t) => t.status === "done").length;
      return Math.round((done / ts.length) * 100);
    },
    [tasks],
  );

  const saveTask = useCallback(
    (data, editingTaskId, currentBoardId) => {
      if (editingTaskId) {
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTaskId ? { ...t, ...data } : t)),
        );
        toast("Task updated");
      } else {
        setTasks((prev) => [
          ...prev,
          {
            id: "k" + Date.now(),
            board: currentBoardId,
            attachments: [],
            comments: [],
            ...data,
          },
        ]);
        toast("Task created");
      }
    },
    [toast],
  );

  const deleteTask = useCallback(
    (taskId) => {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast("Task deleted");
    },
    [toast],
  );

  const moveTask = useCallback((taskId, status) => {
    let moved = null;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.status !== status) {
          moved = { ...t, status };
          return moved;
        }
        return t;
      }),
    );
    return moved;
  }, []);

  const addComment = useCallback(
    (taskId, text) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                comments: [
                  ...t.comments,
                  { user: currentUser.id, text, time: "now" },
                ],
              }
            : t,
        ),
      );
    },
    [currentUser],
  );

  const saveBoard = useCallback(
    (data, editingBoardId) => {
      const palette = ["#E3A64A", "#4FB8AC", "#6C93E8", "#E2687C", "#6FC28B"];
      let newId = null;
      if (editingBoardId) {
        setBoards((prev) =>
          prev.map((b) => (b.id === editingBoardId ? { ...b, ...data } : b)),
        );
        toast("Board updated");
      } else {
        newId = "b" + Date.now();
        setBoards((prev) => [
          ...prev,
          { id: newId, ...data, color: palette[prev.length % palette.length] },
        ]);
      }
      return newId;
    },
    [toast],
  );

  const deleteBoard = useCallback(
    (boardId) => {
      setTasks((prev) => prev.filter((t) => t.board !== boardId));
      setBoards((prev) => prev.filter((b) => b.id !== boardId));
      toast("Board deleted");
    },
    [toast],
  );

  const value = {
    currentUser,
    setCurrentUser,
    authLoading,

    login,
    register,
    logout,

    users: USERS,
    teams: TEAMS,
    boards,
    tasks,

    ACTIVITY,
    NOTIFICATIONS,

    toast,
    toastMsg,
    toastShow,

    userById,
    boardById,
    teamById,
    tasksForBoard,
    boardProgress,

    saveTask,
    deleteTask,
    moveTask,
    addComment,
    saveBoard,
    deleteBoard,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const updateCurrentUser = async (updates) => {
  const response = await fetch("http://localhost:5000/api/users/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile");
  }

  return data;
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

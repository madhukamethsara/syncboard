import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { USERS, TEAMS, ACTIVITY, NOTIFICATIONS } from "./data/dummyData";

import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
} from "./api/authApi";

import {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard as deleteBoardApi,
} from "./api/boardApi";

import { getColumns } from "./api/columnApi";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask as deleteTaskApi,
  addTaskComment,
} from "./api/taskApi";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);

  const [boards, setBoards] = useState([]);

  const [boardsLoading, setBoardsLoading] = useState(true);

  const [columnsByBoard, setColumnsByBoard] = useState({});

  const [columnsLoading, setColumnsLoading] = useState(false);

  const [tasks, setTasks] = useState([]);

  const [tasksLoading, setTasksLoading] = useState(false);

  const [toastMsg, setToastMsg] = useState("");

  const [toastShow, setToastShow] = useState(false);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("syncboard-theme") || "dark",
  );

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => localStorage.getItem("syncboard-notifications") !== "false",
  );

  const [compactSidebar, setCompactSidebar] = useState(
    () => localStorage.getItem("syncboard-compact-sidebar") === "true",
  );

  const toastTimer = useRef(null);

  const login = async (email, password) => {
    const data = await loginUser({
      email,
      password,
    });

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
    setBoards([]);
    setColumnsByBoard({});
    setTasks([]);

    localStorage.removeItem("syncboard-current-board");

    localStorage.removeItem("syncboard-view");
  };

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    setToastShow(true);

    clearTimeout(toastTimer.current);

    toastTimer.current = setTimeout(() => {
      setToastShow(false);
    }, 2400);
  }, []);

  const userById = useCallback(
    (id) => USERS.find((user) => user.id === id || user._id === id),
    [],
  );

  const boardById = useCallback(
    (id) => boards.find((board) => board._id === id),
    [boards],
  );

  const teamById = useCallback(
    (id) => TEAMS.find((team) => team.id === id || team._id === id),
    [],
  );

  const tasksForBoard = useCallback(
    (boardId) => {
      return tasks.filter((task) => {
        const taskBoardId =
          typeof task.board === "object" ? task.board?._id : task.board;

        return taskBoardId === boardId;
      });
    },
    [tasks],
  );

  const columnsForBoard = useCallback(
    (boardId) => {
      return columnsByBoard[boardId] || [];
    },
    [columnsByBoard],
  );

  const loadColumns = useCallback(
    async (boardId) => {
      if (!boardId) {
        return [];
      }

      try {
        setColumnsLoading(true);

        const data = await getColumns(boardId);

        const columns = data.columns || data;

        setColumnsByBoard((prev) => ({
          ...prev,
          [boardId]: columns,
        }));

        console.log("REAL COLUMNS:", columns);

        return columns;
      } catch (error) {
        console.error("FAILED TO LOAD COLUMNS:", error);

        toast(error.message);

        setColumnsByBoard((prev) => ({
          ...prev,
          [boardId]: [],
        }));

        return [];
      } finally {
        setColumnsLoading(false);
      }
    },
    [toast],
  );

  const loadTasks = useCallback(
    async (boardId) => {
      if (!boardId) {
        return [];
      }

      try {
        setTasksLoading(true);

        const data = await getTasks(boardId);

        const boardTasks = data.tasks || data;

        setTasks((prev) => {
          const otherTasks = prev.filter((task) => {
            const taskBoardId =
              typeof task.board === "object" ? task.board?._id : task.board;

            return taskBoardId !== boardId;
          });

          return [...otherTasks, ...boardTasks];
        });

        console.log("REAL TASKS:", boardTasks);

        return boardTasks;
      } catch (error) {
        console.error("FAILED TO LOAD TASKS:", error);

        toast(error.message);

        return [];
      } finally {
        setTasksLoading(false);
      }
    },
    [toast],
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

  useEffect(() => {
    async function loadBoards() {
      if (!currentUser) {
        setBoards([]);
        setBoardsLoading(false);

        return;
      }

      try {
        setBoardsLoading(true);

        const data = await getBoards();

        setBoards(data.boards || []);

        console.log("REAL BOARDS:", data.boards);
      } catch (error) {
        console.error("FAILED TO LOAD BOARDS:", error);

        setBoards([]);
      } finally {
        setBoardsLoading(false);
      }
    }

    loadBoards();
  }, [currentUser]);

  useEffect(() => {
    const root = document.documentElement;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme() {
      if (theme === "system") {
        root.setAttribute("data-theme", mediaQuery.matches ? "dark" : "light");
      } else {
        root.setAttribute("data-theme", theme);
      }
    }

    applyTheme();

    if (theme === "system") {
      mediaQuery.addEventListener("change", applyTheme);
    }

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("syncboard-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(
      "syncboard-notifications",
      String(notificationsEnabled),
    );
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem("syncboard-compact-sidebar", String(compactSidebar));
  }, [compactSidebar]);

  useEffect(() => {
    return () => {
      clearTimeout(toastTimer.current);
    };
  }, []);

  const boardProgress = useCallback(
    (boardId) => {
      const boardTasks = tasksForBoard(boardId);

      if (!boardTasks.length) {
        return 0;
      }

      const boardColumns = columnsForBoard(boardId);

      const doneColumn = boardColumns.find(
        (column) => column.name?.trim().toLowerCase() === "done",
      );

      if (!doneColumn) {
        return 0;
      }

      const doneTasks = boardTasks.filter((task) => {
        const columnId =
          typeof task.column === "object" ? task.column?._id : task.column;

        return columnId === doneColumn._id;
      }).length;

      return Math.round((doneTasks / boardTasks.length) * 100);
    },
    [tasksForBoard, columnsForBoard],
  );

  const saveTask = useCallback(
    async (data, editingTaskId, currentBoardId) => {
      try {
        if (editingTaskId) {
          const response = await updateTask(editingTaskId, data);

          const updatedTask = response.task || response;

          setTasks((prev) =>
            prev.map((task) =>
              task._id === editingTaskId ? updatedTask : task,
            ),
          );

          toast("Task updated");

          return updatedTask;
        }

        const response = await createTask({
          ...data,
          boardId: currentBoardId,
        });

        const newTask = response.task || response;

        setTasks((prev) => [...prev, newTask]);

        toast("Task created");

        return newTask;
      } catch (error) {
        toast(error.message);

        throw error;
      }
    },
    [toast],
  );

  const deleteTask = useCallback(
    async (taskId) => {
      try {
        await deleteTaskApi(taskId);

        setTasks((prev) => prev.filter((task) => task._id !== taskId));

        toast("Task deleted");
      } catch (error) {
        toast(error.message);

        throw error;
      }
    },
    [toast],
  );

  const moveTask = useCallback(
    async (taskId, columnId) => {
      try {
        const response = await updateTask(taskId, {
          columnId,
        });

        const updatedTask = response.task || response;

        setTasks((prev) =>
          prev.map((task) => (task._id === taskId ? updatedTask : task)),
        );

        return updatedTask;
      } catch (error) {
        toast(error.message);

        throw error;
      }
    },
    [toast],
  );

  const addComment = useCallback(
    async (taskId, text) => {
      try {
        const response = await addTaskComment(taskId, text);

        const newComment = response.comment;

        setTasks((prev) =>
          prev.map((task) =>
            task._id === taskId
              ? {
                  ...task,
                  comments: [...(task.comments || []), newComment],
                }
              : task,
          ),
        );

        toast("Comment added");

        return newComment;
      } catch (error) {
        toast(error.message);

        throw error;
      }
    },
    [toast],
  );
  const saveBoard = useCallback(
    async (data, editingBoardId) => {
      try {
        if (editingBoardId) {
          const response = await updateBoard(editingBoardId, {
            name: data.name,
            description: data.description,
          });

          const updatedBoard = response.board || response;

          setBoards((prev) =>
            prev.map((board) =>
              board._id === editingBoardId ? updatedBoard : board,
            ),
          );

          toast("Board updated");

          return updatedBoard._id;
        }

        const response = await createBoard({
          name: data.name,

          description: data.description || "",

          teamId: data.teamId,
        });

        const newBoard = response.board || response;

        setBoards((prev) => [...prev, newBoard]);

        toast("Board created");

        return newBoard._id;
      } catch (error) {
        toast(error.message);

        throw error;
      }
    },
    [toast],
  );

  const deleteBoard = useCallback(
    async (boardId) => {
      try {
        await deleteBoardApi(boardId);

        setBoards((prev) => prev.filter((board) => board._id !== boardId));

        setTasks((prev) =>
          prev.filter((task) => {
            const taskBoardId =
              typeof task.board === "object" ? task.board?._id : task.board;

            return taskBoardId !== boardId;
          }),
        );

        setColumnsByBoard((prev) => {
          const next = {
            ...prev,
          };

          delete next[boardId];

          return next;
        });

        toast("Board deleted");
      } catch (error) {
        toast(error.message);

        throw error;
      }
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
    boardsLoading,

    tasks,
    tasksLoading,
    tasksForBoard,
    loadTasks,

    columnsByBoard,
    columnsLoading,
    columnsForBoard,
    loadColumns,

    ACTIVITY,
    NOTIFICATIONS,

    toast,
    toastMsg,
    toastShow,

    userById,
    boardById,
    teamById,

    boardProgress,

    saveTask,
    deleteTask,
    moveTask,
    addComment,

    saveBoard,
    deleteBoard,

    theme,
    setTheme,

    notificationsEnabled,
    setNotificationsEnabled,

    compactSidebar,
    setCompactSidebar,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

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

  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }

  return ctx;
}

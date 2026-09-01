import { useMemo } from "react";

import { useApp } from "../AppContext";

import {
  priorityColor,
  fmtDate,
} from "../utils";

export default function Dashboard({
  gotoApp,
  openBoard,
  openDrawer,
  openTaskModal,
  openBoardModal,
}) {
  const {
    currentUser,
    boards,
    tasks,
    boardProgress,
    tasksForBoard,
    columnsForBoard,
  } = useApp();

  const currentUserId =
    currentUser?._id ||
    currentUser?.id ||
    "";

  const dashBoards =
    boards.slice(0, 4);

  const assignedTasks =
    useMemo(() => {
      return tasks.filter((task) => {
        const assignedId =
          typeof task.assignedTo ===
          "object"
            ? task.assignedTo?._id
            : task.assignedTo;

        return (
          assignedId ===
          currentUserId
        );
      });
    }, [
      tasks,
      currentUserId,
    ]);

  const incompleteAssignedTasks =
    useMemo(() => {
      return assignedTasks.filter(
        (task) => {
          const columnId =
            typeof task.column ===
            "object"
              ? task.column?._id
              : task.column;

          const boardId =
            typeof task.board ===
            "object"
              ? task.board?._id
              : task.board;

          const columns =
            columnsForBoard(
              boardId
            );

          const column =
            columns.find(
              (item) =>
                item._id ===
                columnId
            );

          return (
            column?.name
              ?.toLowerCase() !==
            "done"
          );
        }
      );
    }, [
      assignedTasks,
      columnsForBoard,
    ]);

  const assignedList =
    incompleteAssignedTasks
      .slice(0, 5);

  const dueThisWeek =
    useMemo(() => {
      const now =
        new Date();

      const end =
        new Date();

      end.setDate(
        now.getDate() + 7
      );

      return assignedTasks.filter(
        (task) => {
          if (!task.dueDate) {
            return false;
          }

          const due =
            new Date(
              task.dueDate
            );

          return (
            due >= now &&
            due <= end
          );
        }
      ).length;
    }, [assignedTasks]);

  const completedCount =
    useMemo(() => {
      return tasks.filter(
        (task) => {
          const boardId =
            typeof task.board ===
            "object"
              ? task.board?._id
              : task.board;

          const columnId =
            typeof task.column ===
            "object"
              ? task.column?._id
              : task.column;

          const columns =
            columnsForBoard(
              boardId
            );

          const column =
            columns.find(
              (item) =>
                item._id ===
                columnId
            );

          return (
            column?.name
              ?.toLowerCase() ===
            "done"
          );
        }
      ).length;
    }, [
      tasks,
      columnsForBoard,
    ]);

  const completionRate =
    tasks.length > 0
      ? Math.round(
          (completedCount /
            tasks.length) *
            100
        )
      : 0;

  const recentTasks =
    useMemo(() => {
      return [...tasks]
        .sort((a, b) => {
          const dateA =
            new Date(
              a.updatedAt ||
                a.createdAt ||
                0
            );

          const dateB =
            new Date(
              b.updatedAt ||
                b.createdAt ||
                0
            );

          return dateB - dateA;
        })
        .slice(0, 4);
    }, [tasks]);

  const teamMembers =
    useMemo(() => {
      const memberMap =
        new Map();

      function addUser(user) {
        if (
          !user ||
          typeof user !==
            "object"
        ) {
          return;
        }

        const id =
          user._id ||
          user.id;

        if (!id) {
          return;
        }

        memberMap.set(
          id,
          user
        );
      }

      boards.forEach(
        (board) => {
          if (
            !board.team ||
            typeof board.team !==
              "object"
          ) {
            return;
          }

          addUser(
            board.team.owner
          );

          if (
            Array.isArray(
              board.team.members
            )
          ) {
            board.team.members.forEach(
              (member) => {
                addUser(
                  member.user
                );
              }
            );
          }
        }
      );

      return Array.from(
        memberMap.values()
      );
    }, [boards]);

  const teamCount =
    useMemo(() => {
      const teamIds =
        new Set();

      boards.forEach(
        (board) => {
          if (
            board.team &&
            typeof board.team ===
              "object"
          ) {
            const id =
              board.team._id ||
              board.team.id;

            if (id) {
              teamIds.add(id);
            }
          }
        }
      );

      return teamIds.size;
    }, [boards]);

  return (
    <div className="page-pad view active">

      <div className="page-title-row">
        <div>
          <h1>
            Welcome back,{" "}
            {currentUser?.name
              ?.split(" ")[0] ||
              "User"}
          </h1>

          <p className="sub">
            Here's what's moving across your boards today.
          </p>
        </div>
      </div>

      <div
        className="grid-4"
        style={{
          marginBottom: 22,
        }}
      >
        <div className="stat-card">
          <div className="label">
            MY BOARDS
          </div>

          <div className="value">
            {boards.length}
          </div>

          <div className="delta up">
            Active boards
          </div>
        </div>

        <div className="stat-card">
          <div className="label">
            ASSIGNED TASKS
          </div>

          <div className="value">
            {assignedTasks.length}
          </div>

          <div className="delta down">
            {dueThisWeek} due this week
          </div>
        </div>

        <div className="stat-card">
          <div className="label">
            TEAM MEMBERS
          </div>

          <div className="value">
            {teamMembers.length}
          </div>

          <div className="delta up">
            Across {teamCount}{" "}
            {teamCount === 1
              ? "team"
              : "teams"}
          </div>
        </div>

        <div className="stat-card">
          <div className="label">
            COMPLETION RATE
          </div>

          <div className="value">
            {completionRate}%
          </div>

          <div className="delta up">
            {completedCount} completed tasks
          </div>
        </div>
      </div>

      <div
        className="grid-2"
        style={{
          gridTemplateColumns:
            "1.3fr 1fr",
          alignItems: "start",
        }}
      >
        <div>
          <div className="section-sub-title">
            My Boards
          </div>

          <div className="grid-2">
            {dashBoards.map(
              (board) => {
                const boardId =
                  board._id ||
                  board.id;

                const pct =
                  boardProgress(
                    boardId
                  );

                const boardTasks =
                  tasksForBoard(
                    boardId
                  );

                return (
                  <div
                    className="board-card"
                    key={boardId}
                    onClick={() =>
                      openBoard(
                        boardId
                      )
                    }
                  >
                    <div
                      className="bc-strip"
                      style={{
                        background:
                          "var(--gold)",
                      }}
                    />

                    <h3>
                      {board.name}
                    </h3>

                    <p>
                      {board.description ||
                        "No description"}
                    </p>

                    <div className="progress-bar">
                      <div
                        style={{
                          width: `${pct}%`,
                          background:
                            "var(--gold)",
                        }}
                      />
                    </div>

                    <div className="bc-meta">
                      <span>
                        {pct}% complete
                      </span>

                      <span>
                        {boardTasks.length} tasks
                      </span>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <div
            className="panel"
            style={{
              marginTop: 16,
            }}
          >
            <h3>
              Quick actions
            </h3>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn btn-ghost btn-sm"
                onClick={() =>
                  gotoApp(
                    "boards"
                  )
                }
              >
                + New Task
              </button>

              <button
                className="btn btn-ghost btn-sm"
                onClick={() =>
                  openBoardModal()
                }
              >
                + New Board
              </button>

              <button
                className="btn btn-ghost btn-sm"
                onClick={() =>
                  gotoApp(
                    "calendar"
                  )
                }
              >
                📅 View Calendar
              </button>

              <button
                className="btn btn-ghost btn-sm"
                onClick={() =>
                  gotoApp("team")
                }
              >
                👥 Invite Member
              </button>
            </div>
          </div>
        </div>

        <div>
          <div
            className="panel"
            style={{
              marginBottom: 16,
            }}
          >
            <h3>
              Assigned to me

              <span
                className="see-all"
                onClick={() =>
                  gotoApp(
                    "boards"
                  )
                }
              >
                See all
              </span>
            </h3>

            <div className="task-list-mini">
              {assignedList.length >
              0 ? (
                assignedList.map(
                  (task) => (
                    <div
                      className="mini-task"
                      key={
                        task._id
                      }
                      onClick={() =>
                        openDrawer(
                          task._id
                        )
                      }
                    >
                      <div
                        className="p-tab"
                        style={{
                          background:
                            priorityColor(
                              task.priority
                            ),
                        }}
                      />

                      <div className="mt-title">
                        {task.title}
                      </div>

                      <div className="mt-due">
                        {task.dueDate
                          ? fmtDate(
                              task.dueDate
                            )
                          : "No due date"}
                      </div>
                    </div>
                  )
                )
              ) : (
                <div
                  style={{
                    fontSize: 13,
                    color:
                      "var(--text-muted)",
                    padding:
                      "10px 0",
                  }}
                >
                  No tasks assigned to you.
                </div>
              )}
            </div>
          </div>

          <div
            className="panel"
            style={{
              marginBottom: 16,
            }}
          >
            <h3>
              Recent tasks
            </h3>

            <div>
              {recentTasks.length >
              0 ? (
                recentTasks.map(
                  (task) => (
                    <div
                      className="activity-row"
                      key={
                        task._id
                      }
                      onClick={() =>
                        openDrawer(
                          task._id
                        )
                      }
                      style={{
                        cursor:
                          "pointer",
                      }}
                    >
                      <div className="activity-time mono">
                        {task.priority ||
                          "medium"}
                      </div>

                      <div className="activity-text">
                        {task.title}
                      </div>
                    </div>
                  )
                )
              ) : (
                <div
                  style={{
                    fontSize: 13,
                    color:
                      "var(--text-muted)",
                    padding:
                      "10px 0",
                  }}
                >
                  No recent tasks.
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <h3>
              Workspace summary
            </h3>

            <div
              style={{
                display: "grid",
                gap: 10,
              }}
            >
              <div className="activity-row">
                <div className="activity-text">
                  Boards
                </div>

                <strong>
                  {boards.length}
                </strong>
              </div>

              <div className="activity-row">
                <div className="activity-text">
                  Teams
                </div>

                <strong>
                  {teamCount}
                </strong>
              </div>

              <div className="activity-row">
                <div className="activity-text">
                  Team members
                </div>

                <strong>
                  {teamMembers.length}
                </strong>
              </div>

              <div className="activity-row">
                <div className="activity-text">
                  Tasks
                </div>

                <strong>
                  {tasks.length}
                </strong>
              </div>

              <div className="activity-row">
                <div className="activity-text">
                  Completed
                </div>

                <strong>
                  {completedCount}
                </strong>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
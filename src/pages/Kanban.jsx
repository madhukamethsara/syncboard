import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useApp } from "../AppContext";

import Avatar from "../components/Avatar";

import {
  priorityColor,
  fmtDate,
} from "../utils";

export default function Kanban({
  currentBoardId,
  gotoApp,
  openTaskModal,
  openDrawer,
  openBoardModal,
  searchTerm,
}) {
  const {
    boardById,

    tasksForBoard,
    loadTasks,
    tasksLoading,

    columnsForBoard,
    loadColumns,
    columnsLoading,

    users,

    moveTask,
    deleteBoard,
    toast,
  } = useApp();

  const board =
    boardById(currentBoardId);

  const columns =
    columnsForBoard(
      currentBoardId
    );

  const boardTasks =
    tasksForBoard(
      currentBoardId
    );

  const [search, setSearch] =
    useState("");

  const [
    fPriority,
    setFPriority,
  ] = useState("");

  const [
    fAssignee,
    setFAssignee,
  ] = useState("");

  const [
    draggedId,
    setDraggedId,
  ] = useState(null);

  const [
    dragOverCol,
    setDragOverCol,
  ] = useState(null);

  const effectiveSearch =
    searchTerm || search;

  useEffect(() => {
    if (!currentBoardId) {
      return;
    }

    loadColumns(
      currentBoardId
    );

    loadTasks(
      currentBoardId
    );
  }, [
    currentBoardId,
    loadColumns,
    loadTasks,
  ]);

  const filtered =
    useMemo(() => {
      return boardTasks.filter(
        (task) => {
          if (
            effectiveSearch &&
            !task.title
              ?.toLowerCase()
              .includes(
                effectiveSearch.toLowerCase()
              )
          ) {
            return false;
          }

          if (
            fPriority &&
            task.priority !==
              fPriority
          ) {
            return false;
          }

          if (fAssignee) {
            const assignedId =
              typeof task.assignedTo ===
              "object"
                ? task.assignedTo
                    ?._id
                : task.assignedTo;

            if (
              assignedId !==
              fAssignee
            ) {
              return false;
            }
          }

          return true;
        }
      );
    }, [
      boardTasks,
      effectiveSearch,
      fPriority,
      fAssignee,
    ]);

  async function handleDrop(
    columnId
  ) {
    setDragOverCol(null);

    if (!draggedId) {
      return;
    }

    const task =
      boardTasks.find(
        (item) =>
          item._id ===
          draggedId
      );

    if (!task) {
      setDraggedId(null);
      return;
    }

    const currentColumnId =
      typeof task.column ===
      "object"
        ? task.column?._id
        : task.column;

    if (
      currentColumnId ===
      columnId
    ) {
      setDraggedId(null);
      return;
    }

    try {
      const moved =
        await moveTask(
          draggedId,
          columnId
        );

      const destination =
        columns.find(
          (column) =>
            column._id ===
            columnId
        );

      toast(
        `Moved "${
          moved.title
        }" to ${
          destination?.name ||
          "column"
        }`
      );
    } catch (error) {
      console.error(
        "FAILED TO MOVE TASK:",
        error
      );
    } finally {
      setDraggedId(null);
    }
  }

  async function handleDeleteBoard() {
    const confirmed =
      window.confirm(
        "Delete this board and all its tasks?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBoard(
        currentBoardId
      );

      gotoApp("boards");
    } catch (error) {
      console.error(
        "FAILED TO DELETE BOARD:",
        error
      );
    }
  }

  if (!board) {
    return (
      <div className="page-pad view active">
        <button
          className="btn btn-ghost btn-sm"
          style={{
            marginBottom: 16,
          }}
          onClick={() =>
            gotoApp("boards")
          }
        >
          ← All boards
        </button>

        <div className="empty-state">
          <h4>
            Board not found
          </h4>
        </div>
      </div>
    );
  }

  if (
    columnsLoading ||
    tasksLoading
  ) {
    return (
      <div className="page-pad view active">
        <button
          className="btn btn-ghost btn-sm"
          style={{
            marginBottom: 16,
          }}
          onClick={() =>
            gotoApp("boards")
          }
        >
          ← All boards
        </button>

        <div className="empty-state">
          <h4>
            Loading board...
          </h4>
        </div>
      </div>
    );
  }

  return (
    <div className="page-pad view active">
      <button
        className="btn btn-ghost btn-sm"
        style={{
          marginBottom: 16,
        }}
        onClick={() =>
          gotoApp("boards")
        }
      >
        ← All boards
      </button>

      <div className="board-header">
        <h1>
          <span>
            {board.name}
          </span>
        </h1>

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <button
            className="btn btn-ghost btn-sm"
            onClick={() =>
              openBoardModal(
                currentBoardId
              )
            }
          >
            Edit board
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={
              handleDeleteBoard
            }
          >
            Delete board
          </button>

          <button
            className="btn btn-gold btn-sm"
            onClick={() => {
              const firstColumn =
                columns[0];

              if (!firstColumn) {
                toast(
                  "Create a column first"
                );

                return;
              }

              openTaskModal(
                null,
                firstColumn._id
              );
            }}
          >
            + Add Task
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <input
          className="search-sm"
          placeholder="Search task..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <select
          className="select-sm"
          value={fPriority}
          onChange={(e) =>
            setFPriority(
              e.target.value
            )
          }
        >
          <option value="">
            All priorities
          </option>

          <option value="high">
            High
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="low">
            Low
          </option>
        </select>

        <select
          className="select-sm"
          value={fAssignee}
          onChange={(e) =>
            setFAssignee(
              e.target.value
            )
          }
        >
          <option value="">
            All assignees
          </option>

          {users.map(
            (user) => (
              <option
                key={
                  user._id ||
                  user.id
                }
                value={
                  user._id ||
                  user.id
                }
              >
                {user.name}
              </option>
            )
          )}
        </select>
      </div>

      {columns.length === 0 ? (
        <div className="empty-state">
          <h4>
            No columns yet
          </h4>

          <p>
            This board does
            not have any
            columns.
          </p>
        </div>
      ) : (
        <div className="kanban-wrap">
          {columns.map(
            (column) => {
              const colTasks =
                filtered.filter(
                  (task) => {
                    const taskColumnId =
                      typeof task.column ===
                      "object"
                        ? task
                            .column
                            ?._id
                        : task.column;

                    return (
                      taskColumnId ===
                      column._id
                    );
                  }
                );

              return (
                <div
                  key={
                    column._id
                  }
                  className={`kanban-col${
                    dragOverCol ===
                    column._id
                      ? " drag-over"
                      : ""
                  }`}
                  onDragOver={(
                    e
                  ) => {
                    e.preventDefault();

                    setDragOverCol(
                      column._id
                    );
                  }}
                  onDragLeave={() =>
                    setDragOverCol(
                      null
                    )
                  }
                  onDrop={(
                    e
                  ) => {
                    e.preventDefault();

                    handleDrop(
                      column._id
                    );
                  }}
                >
                  <div className="kcol-head">
                    <div className="kc-title">
                      <span
                        className="kcol-dot"
                        style={{
                          background:
                            "var(--gold)",
                        }}
                      />

                      {
                        column.name
                      }
                    </div>

                    <span className="kcol-count">
                      {
                        colTasks.length
                      }
                    </span>
                  </div>

                  <div className="kcol-body">
                    {colTasks.map(
                      (task) => {
                        const assignedId =
                          typeof task.assignedTo ===
                          "object"
                            ? task
                                .assignedTo
                                ?._id
                            : task.assignedTo;

                        return (
                          <div
                            key={
                              task._id
                            }
                            className={`task-card${
                              draggedId ===
                              task._id
                                ? " dragging"
                                : ""
                            }`}
                            draggable
                            onDragStart={() =>
                              setDraggedId(
                                task._id
                              )
                            }
                            onDragEnd={() => {
                              setDraggedId(
                                null
                              );

                              setDragOverCol(
                                null
                              );
                            }}
                            onClick={() =>
                              openDrawer(
                                task._id
                              )
                            }
                          >
                            <div
                              className="tcard-tab"
                              style={{
                                background:
                                  priorityColor(
                                    task.priority
                                  ),
                              }}
                            />

                            <div className="t-title">
                              {
                                task.title
                              }
                            </div>

                            {task.description && (
                              <div
                                style={{
                                  fontSize:
                                    12,
                                  color:
                                    "var(--text-muted)",
                                  marginTop:
                                    6,
                                }}
                              >
                                {
                                  task.description
                                }
                              </div>
                            )}

                            {Array.isArray(
                              task.labels
                            ) &&
                              task.labels
                                .length >
                                0 && (
                                <div className="t-labels">
                                  {task.labels.map(
                                    (
                                      label
                                    ) => (
                                      <span
                                        className="label-chip"
                                        key={
                                          label
                                        }
                                      >
                                        {
                                          label
                                        }
                                      </span>
                                    )
                                  )}
                                </div>
                              )}

                            <div className="t-foot">
                              <div className="t-foot-left">
                                {task.dueDate && (
                                  <span className="t-due">
                                    📅{" "}
                                    {fmtDate(
                                      task.dueDate
                                    )}
                                  </span>
                                )}

                                {Array.isArray(
                                  task.comments
                                ) &&
                                  task
                                    .comments
                                    .length >
                                    0 && (
                                    <span className="t-meta-icon">
                                      💬{" "}
                                      {
                                        task
                                          .comments
                                          .length
                                      }
                                    </span>
                                  )}

                                {Array.isArray(
                                  task.attachments
                                ) &&
                                  task
                                    .attachments
                                    .length >
                                    0 && (
                                    <span className="t-meta-icon">
                                      📎{" "}
                                      {
                                        task
                                          .attachments
                                          .length
                                      }
                                    </span>
                                  )}
                              </div>

                              {assignedId && (
                                <Avatar
                                  userId={
                                    assignedId
                                  }
                                  size={
                                    22
                                  }
                                />
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>

                  <div
                    className="add-task-col-btn"
                    onClick={() =>
                      openTaskModal(
                        null,
                        column._id
                      )
                    }
                  >
                    + Add task
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useApp } from "../AppContext";

const EMPTY = {
  title: "",
  description: "",
  priority: "medium",
  columnId: "",
  dueDate: "",
  assignedTo: "",
  labels: "",
  attachments: "",
};

function getUserId(user) {
  if (!user) {
    return "";
  }

  if (typeof user === "string") {
    return user;
  }

  return user._id || user.id || "";
}

function addUniqueUser(map, user) {
  if (!user || typeof user !== "object") {
    return;
  }

  const id = getUserId(user);

  if (!id) {
    return;
  }

  const existing = map.get(id) || {};

  map.set(id, {
    ...existing,
    ...user,
    _id: user._id || existing._id || id,
  });
}

export default function TaskModal({
  editingTaskId,
  defaultStatus,
  currentBoardId,
  onClose,
}) {
  const {
    tasks,
    currentUser,
    boardById,
    columnsForBoard,
    saveTask,
    toast,
  } = useApp();

  const board =
    boardById(currentBoardId);

  const columns =
    columnsForBoard(
      currentBoardId
    );

  const [form, setForm] =
    useState(EMPTY);

  const [saving, setSaving] =
    useState(false);

  const assignableUsers =
    useMemo(() => {
      const userMap =
        new Map();

      if (!board) {
        addUniqueUser(
          userMap,
          currentUser
        );

        return Array.from(
          userMap.values()
        );
      }

      const team =
        board.team;

      const isTeamBoard =
        team &&
        typeof team ===
          "object";

      if (!isTeamBoard) {
        if (
          board.createdBy &&
          typeof board.createdBy ===
            "object"
        ) {
          addUniqueUser(
            userMap,
            board.createdBy
          );
        } else {
          addUniqueUser(
            userMap,
            currentUser
          );
        }
      } else {
        addUniqueUser(
          userMap,
          team.owner
        );

        if (
          Array.isArray(
            team.members
          )
        ) {
          team.members.forEach(
            (member) => {
              addUniqueUser(
                userMap,
                member.user
              );
            }
          );
        }

        addUniqueUser(
          userMap,
          board.createdBy
        );
      }

      if (editingTaskId) {
        const editingTask =
          tasks.find(
            (task) =>
              task._id ===
              editingTaskId
          );

        if (
          editingTask?.assignedTo &&
          typeof editingTask.assignedTo ===
            "object"
        ) {
          addUniqueUser(
            userMap,
            editingTask.assignedTo
          );
        }
      }

      return Array.from(
        userMap.values()
      );
    }, [
      board,
      currentUser,
      editingTaskId,
      tasks,
    ]);

  useEffect(() => {
    if (editingTaskId) {
      const task =
        tasks.find(
          (item) =>
            item._id ===
            editingTaskId
        );

      if (!task) {
        return;
      }

      const columnId =
        typeof task.column ===
        "object"
          ? task.column?._id
          : task.column;

      const assignedTo =
        typeof task.assignedTo ===
        "object"
          ? task.assignedTo?._id
          : task.assignedTo;

      let dueDate = "";

      if (task.dueDate) {
        dueDate =
          new Date(
            task.dueDate
          )
            .toISOString()
            .split("T")[0];
      }

      setForm({
        title:
          task.title || "",

        description:
          task.description ||
          "",

        priority:
          task.priority ||
          "medium",

        columnId:
          columnId || "",

        dueDate,

        assignedTo:
          assignedTo || "",

        labels:
          Array.isArray(
            task.labels
          )
            ? task.labels.join(
                ", "
              )
            : "",

        attachments:
          Array.isArray(
            task.attachments
          )
            ? task.attachments.join(
                "\n"
              )
            : "",
      });

      return;
    }

    const defaultColumnId =
      defaultStatus ||
      columns[0]?._id ||
      "";

    const currentUserId =
      getUserId(
        currentUser
      );

    const canAssignCurrentUser =
      assignableUsers.some(
        (user) =>
          getUserId(user) ===
          currentUserId
      );

    setForm({
      ...EMPTY,

      columnId:
        defaultColumnId,

      assignedTo:
        canAssignCurrentUser
          ? currentUserId
          : "",
    });
  }, [
    editingTaskId,
    defaultStatus,
    currentBoardId,
    tasks,
    columns,
    currentUser,
    assignableUsers,
  ]);

  function update(
    field,
    value
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSave() {
    const title =
      form.title.trim();

    if (!title) {
      toast(
        "Task title is required"
      );

      return;
    }

    if (!form.columnId) {
      toast(
        "Please select a column"
      );

      return;
    }

    const labels =
      form.labels
        .split(",")
        .map((label) =>
          label.trim()
        )
        .filter(Boolean)
        .slice(0, 10);

    const attachments =
      form.attachments
        .split("\n")
        .map((attachment) =>
          attachment.trim()
        )
        .filter(Boolean)
        .slice(0, 10);

    const invalidAttachment =
      attachments.find(
        (attachment) => {
          try {
            const url =
              new URL(
                attachment
              );

            return ![
              "http:",
              "https:",
            ].includes(
              url.protocol
            );
          } catch {
            return true;
          }
        }
      );

    if (invalidAttachment) {
      toast(
        "Attachments must be valid http or https URLs"
      );

      return;
    }

    try {
      setSaving(true);

      const taskData = {
        title,

        description:
          form.description.trim(),

        priority:
          form.priority,

        columnId:
          form.columnId,

        assignedTo:
          form.assignedTo ||
          null,

        dueDate:
          form.dueDate ||
          null,

        labels,

        attachments,
      };

      await saveTask(
        taskData,
        editingTaskId,
        currentBoardId
      );

      onClose();
    } catch (error) {
      console.error(
        "FAILED TO SAVE TASK:",
        error
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay active">
      <div className="modal">
        <div className="modal-head">
          <h3>
            {editingTaskId
              ? "Edit Task"
              : "Create Task"}
          </h3>

          <button
            className="modal-close"
            onClick={onClose}
            disabled={saving}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>
              Task title
            </label>

            <input
              type="text"
              placeholder="e.g. Design login screen"
              value={
                form.title
              }
              onChange={(e) =>
                update(
                  "title",
                  e.target.value
                )
              }
            />
          </div>

          <div className="field">
            <label>
              Description
            </label>

            <textarea
              placeholder="Add more detail..."
              value={
                form.description
              }
              onChange={(e) =>
                update(
                  "description",
                  e.target.value
                )
              }
            />
          </div>

          <div className="field">
            <label>
              Labels
            </label>

            <input
              type="text"
              placeholder="e.g. frontend, urgent, design"
              value={
                form.labels
              }
              onChange={(e) =>
                update(
                  "labels",
                  e.target.value
                )
              }
            />

            <div
              style={{
                fontSize: 11,
                color:
                  "var(--text-faint)",
                marginTop: 5,
              }}
            >
              Separate labels with commas
            </div>
          </div>

          <div className="field">
            <label>
              Attachments
            </label>

            <textarea
              placeholder={
                "https://example.com/design.pdf\nhttps://example.com/document"
              }
              value={
                form.attachments
              }
              onChange={(e) =>
                update(
                  "attachments",
                  e.target.value
                )
              }
              rows={3}
            />

            <div
              style={{
                fontSize: 11,
                color:
                  "var(--text-faint)",
                marginTop: 5,
              }}
            >
              Add one URL per line. Maximum 10 attachments.
            </div>
          </div>

          <div className="field-grid">
            <div className="field">
              <label>
                Priority
              </label>

              <select
                value={
                  form.priority
                }
                onChange={(e) =>
                  update(
                    "priority",
                    e.target.value
                  )
                }
              >
                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>
              </select>
            </div>

            <div className="field">
              <label>
                Column
              </label>

              <select
                value={
                  form.columnId
                }
                onChange={(e) =>
                  update(
                    "columnId",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select column
                </option>

                {columns.map(
                  (column) => (
                    <option
                      key={
                        column._id
                      }
                      value={
                        column._id
                      }
                    >
                      {
                        column.name
                      }
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="field-grid">
            <div className="field">
              <label>
                Due date
              </label>

              <input
                type="date"
                value={
                  form.dueDate
                }
                onChange={(e) =>
                  update(
                    "dueDate",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="field">
              <label>
                Assignee
              </label>

              <select
                value={
                  form.assignedTo
                }
                onChange={(e) =>
                  update(
                    "assignedTo",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Unassigned
                </option>

                {assignableUsers.map(
                  (user) => {
                    const userId =
                      getUserId(
                        user
                      );

                    return (
                      <option
                        key={
                          userId
                        }
                        value={
                          userId
                        }
                      >
                        {user.name ||
                          user.email ||
                          "Unknown User"}
                      </option>
                    );
                  }
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            className="btn btn-gold"
            onClick={
              handleSave
            }
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save task"}
          </button>
        </div>
      </div>
    </div>
  );
}
import {
  useEffect,
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
};

export default function TaskModal({
  editingTaskId,
  defaultStatus,
  currentBoardId,
  onClose,
}) {
  const {
    users,
    tasks,
    currentUser,
    columnsForBoard,
    saveTask,
    toast,
  } = useApp();

  const columns =
    columnsForBoard(
      currentBoardId
    );

  const [form, setForm] =
    useState(EMPTY);

  const [saving, setSaving] =
    useState(false);

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
      });

      return;
    }

    const defaultColumnId =
      defaultStatus ||
      columns[0]?._id ||
      "";

    setForm({
      ...EMPTY,

      columnId:
        defaultColumnId,

      assignedTo:
        currentUser?._id ||
        currentUser?.id ||
        "",
    });
  }, [
    editingTaskId,
    defaultStatus,
    currentBoardId,
    tasks,
    columns,
    currentUser,
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

                {users.map(
                  (user) => {
                    const userId =
                      user._id ||
                      user.id;

                    return (
                      <option
                        key={
                          userId
                        }
                        value={
                          userId
                        }
                      >
                        {
                          user.name
                        }
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
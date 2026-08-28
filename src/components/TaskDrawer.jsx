import { useState } from "react";

import { useApp } from "../AppContext";

import Avatar from "./Avatar";

import { fmtDate } from "../utils";

export default function TaskDrawer({ taskId, onClose, onEdit, onDeleted }) {
  const {
    tasks,
    boardById,
    columnsForBoard,
    userById,
    addComment,
    deleteTask,
  } = useApp();

  const [commentText, setCommentText] = useState("");

  const task = tasks.find((item) => item._id === taskId);

  if (!task) {
    return null;
  }

  const boardId = typeof task.board === "object" ? task.board?._id : task.board;

  const board = boardById(boardId);

  const columns = columnsForBoard(boardId);

  const columnId =
    typeof task.column === "object" ? task.column?._id : task.column;

  const column =
    columns.find((item) => item._id === columnId) ||
    (typeof task.column === "object" ? task.column : null);

  const assignedId =
    typeof task.assignedTo === "object"
      ? task.assignedTo?._id
      : task.assignedTo;

  const assignedUser =
    typeof task.assignedTo === "object"
      ? task.assignedTo
      : userById(assignedId);

  const comments = Array.isArray(task.comments) ? task.comments : [];

  const labels = Array.isArray(task.labels) ? task.labels : [];

  const attachments = Array.isArray(task.attachments) ? task.attachments : [];

  async function handlePost() {
    const text = commentText.trim();

    if (!text) {
      return;
    }

    await addComment(taskId, text);

    setCommentText("");
  }

  async function handleDelete() {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    try {
      await deleteTask(taskId);

      onClose();

      if (onDeleted) {
        onDeleted();
      }
    } catch (error) {
      console.error("FAILED TO DELETE TASK:", error);
    }
  }

  return (
    <>
      <div className="drawer-overlay active" onClick={onClose} />

      <div className="drawer active">
        <div className="drawer-head">
          <button
            className="modal-close"
            style={{
              float: "right",
            }}
            onClick={onClose}
          >
            ✕
          </button>

          <div className="eyebrow">{board ? board.name.toUpperCase() : ""}</div>

          <h2
            style={{
              fontSize: 20,
              margin: 0,
            }}
          >
            {task.title}
          </h2>
        </div>

        <div className="drawer-body">
          <div className="drawer-section">
            <h4>Description</h4>

            <p
              style={{
                fontSize: 13.5,
                color: "var(--text-muted)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {task.description || "No description provided."}
            </p>
          </div>

          <div className="drawer-section">
            <h4>Details</h4>

            <div className="detail-grid">
              <div className="detail-item">
                <div className="di-label">Priority</div>

                <div className="di-val">
                  <span className={`pill pill-${task.priority}`}>
                    {task.priority
                      ? task.priority.charAt(0).toUpperCase() +
                        task.priority.slice(1)
                      : "Medium"}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="di-label">Column</div>

                <div className="di-val">{column?.name || "Unknown"}</div>
              </div>

              <div className="detail-item">
                <div className="di-label">Due date</div>

                <div className="di-val">
                  {task.dueDate ? fmtDate(task.dueDate) : "No due date"}
                </div>
              </div>

              <div className="detail-item">
                <div className="di-label">Assignee</div>

                <div className="di-val">
                  {assignedId ? (
                    <>
                      <Avatar userId={assignedId} size={20} />{" "}
                      {assignedUser?.name || "User"}
                    </>
                  ) : (
                    "Unassigned"
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="drawer-section">
            <h4>Labels</h4>

            <div
              className="t-labels"
              style={{
                paddingLeft: 0,
              }}
            >
              {labels.length ? (
                labels.map((label) => (
                  <span className="label-chip" key={label}>
                    {label}
                  </span>
                ))
              ) : (
                <span
                  style={{
                    color: "var(--text-faint)",
                    fontSize: 12,
                  }}
                >
                  No labels
                </span>
              )}
            </div>
          </div>

          <div className="drawer-section">
            <h4>Attachments</h4>

            <div>
              {attachments.length ? (
                attachments.map((attachment) => (
                  <div className="attachment-row" key={attachment}>
                    <div className="a-icon">📄</div>

                    {attachment}
                  </div>
                ))
              ) : (
                <div
                  className="empty-state"
                  style={{
                    padding: "16px 0",
                  }}
                >
                  <p>No attachments yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="drawer-section">
            <h4>Comments</h4>

            <div>
              {comments.length ? (
                comments.map((comment, index) => {
                  const commentUser =
                    typeof comment.user === "object" ? comment.user : null;

                  return (
                    <div className="comment" key={comment._id || index}>
                      <Avatar
                        userId={commentUser?._id || comment.user}
                        size={28}
                      />

                      <div className="c-body">
                        <div className="c-head">
                          <span className="c-name">
                            {commentUser?.name || "User"}
                          </span>

                          <span className="c-time">
                            {comment.createdAt
                              ? new Date(comment.createdAt).toLocaleString()
                              : ""}
                          </span>
                        </div>

                        <div className="c-text">{comment.text}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p
                  style={{
                    fontSize: 12.5,
                    color: "var(--text-faint)",
                  }}
                >
                  No comments yet — be the first to comment.
                </p>
              )}
            </div>

            <div className="comment-input">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePost();
                  }
                }}
              />

              <button className="btn btn-gold btn-sm" onClick={handlePost}>
                Post
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                onClose();
                onEdit(taskId);
              }}
            >
              Edit task
            </button>

            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              Delete task
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

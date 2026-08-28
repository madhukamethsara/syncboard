import { useEffect, useState } from "react";

import { useApp } from "../AppContext";

import { getTeams } from "../api/teamApi";

export default function BoardModal({
  editingBoardId,
  onClose,
  onSaved,
}) {
  const {
    boards,
    saveBoard,
    toast,
  } = useApp();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [team, setTeam] = useState("");

  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadTeams() {
      try {
        setTeamsLoading(true);

        const data = await getTeams();

        setTeams(data.teams || []);
      } catch (error) {
        console.error("Failed to load teams:", error);

        toast(error.message);
      } finally {
        setTeamsLoading(false);
      }
    }

    loadTeams();
  }, [toast]);

  useEffect(() => {
    if (editingBoardId) {
      const board = boards.find(
        (b) => b._id === editingBoardId
      );

      if (board) {
        setName(board.name || "");
        setDesc(board.description || "");

        if (typeof board.team === "object") {
          setTeam(board.team?._id || "");
        } else {
          setTeam(board.team || "");
        }
      }
    } else {
      setName("");
      setDesc("");
      setTeam("");
    }
  }, [editingBoardId, boards]);

  async function handleSave() {
    const trimmedName = name.trim();
    const trimmedDescription = desc.trim();

    if (!trimmedName) {
      toast("Board name is required");
      return;
    }

    try {
      setSaving(true);

      let boardId;

      if (editingBoardId) {
        boardId = await saveBoard(
          {
            name: trimmedName,
            description: trimmedDescription,
          },
          editingBoardId
        );
      } else {
        boardId = await saveBoard(
          {
            name: trimmedName,
            description: trimmedDescription,
            teamId: team || null,
          },
          null
        );
      }

      onClose();

      if (onSaved) {
        onSaved(boardId);
      }
    } catch (error) {
      console.error("Failed to save board:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay active">
      <div
        className="modal"
        style={{ width: 440 }}
      >
        <div className="modal-head">
          <h3>
            {editingBoardId
              ? "Edit Board"
              : "Create Board"}
          </h3>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>Board name</label>

            <input
              type="text"
              placeholder="e.g. Backend Sprint"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          <div className="field">
            <label>Description</label>

            <textarea
              placeholder="What is this board for?"
              value={desc}
              onChange={(e) =>
                setDesc(e.target.value)
              }
            />
          </div>

          <div className="field">
            <label>Team</label>

            <select
              value={team}
              onChange={(e) =>
                setTeam(e.target.value)
              }
              disabled={
                teamsLoading ||
                editingBoardId
              }
            >
              <option value="">
                {teamsLoading
                  ? "Loading teams..."
                  : "Personal (no team)"}
              </option>

              {teams.map((t) => (
                <option
                  key={t._id}
                  value={t._id}
                >
                  {t.name}
                </option>
              ))}
            </select>
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
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save board"}
          </button>
        </div>
      </div>
    </div>
  );
}
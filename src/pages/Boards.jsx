import { useState } from "react";
import { useApp } from "../AppContext";

import Avatar from "../components/Avatar";

export default function Boards({ openBoard, openBoardModal }) {
  const {
    boards,
    boardsLoading,
    boardProgress,
    currentUser,
  } = useApp();

  const [selectedTeam, setSelectedTeam] = useState("all");

  const palette = [
    "#E3A64A",
    "#4FB8AC",
    "#6C93E8",
    "#E2687C",
    "#6FC28B",
  ];

  const teams = [
    ...new Map(
      boards
        .filter((b) => b.team)
        .map((b) => [b.team._id, b.team])
    ).values(),
  ];

  const filteredBoards = boards.filter((board) => {
    if (selectedTeam === "all") return true;
    if (selectedTeam === "personal") return !board.team;
    return board.team?._id === selectedTeam;
  });

  if (boardsLoading) {
    return (
      <div className="page-pad view active">
        <p>Loading boards...</p>
      </div>
    );
  }

  return (
    <div className="page-pad view active">

      <div className="page-title-row">

        <div>
          <h1>Boards</h1>

          <p className="sub">
            Every board you're part of, personal and team.
          </p>
        </div>

        <button
          className="btn btn-gold"
          onClick={() => openBoardModal()}
        >
          + Create Board
        </button>

      </div>

      <div className="filter-bar">
        <select
          className="select-sm"
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          <option value="all">All Teams</option>
          <option value="personal">Personal</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>

        <span className="board-count">
          {filteredBoards.length}{" "}
          {filteredBoards.length === 1 ? "board" : "boards"}
        </span>
      </div>

      <div className="grid-3">

        {filteredBoards.map((b, index) => {
          const boardId = b._id;

          const pct = boardProgress(boardId);

          const team = b.team || null;

          const boardColor =
            palette[index % palette.length];

          let memberIds = [];

          if (team?.members) {
            memberIds = team.members.map((member) => {
              if (typeof member.user === "object") {
                return member.user?._id;
              }

              return member.user;
            });
          } else if (currentUser) {
            memberIds = [
              currentUser._id || currentUser.id,
            ];
          }

          return (
            <div
              className="board-card"
              key={boardId}
              onClick={() => openBoard(boardId)}
            >

              <div
                className="bc-strip"
                style={{
                  background: boardColor,
                }}
              ></div>

              <h3>{b.name}</h3>

              <p>
                {b.description || "No description"}
              </p>

              <div className="progress-bar">

                <div
                  style={{
                    width: `${pct}%`,
                    background: boardColor,
                  }}
                ></div>

              </div>

              <div className="bc-meta">

                <span>
                  {team?.name || "Personal"}
                </span>

                <div className="avatar-stack">

                  {memberIds
                    .filter(Boolean)
                    .slice(0, 4)
                    .map((id) => (
                      <Avatar
                        key={id}
                        userId={id}
                        size={22}
                      />
                    ))}

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {!boards.length && (
        <p className="sub">
          No boards yet. Create your first board.
        </p>
      )}

      {boards.length > 0 && filteredBoards.length === 0 && (
        <p className="sub">
          No boards found for this filter.
        </p>
      )}

    </div>
  );
}
import { useApp } from '../AppContext';
import Avatar from '../components/Avatar';

export default function Boards({ openBoard, openBoardModal }) {
  const { boards, teamById, boardProgress, currentUser } = useApp();

  return (
    <div className="page-pad view active">
      <div className="page-title-row">
        <div><h1>Boards</h1><p className="sub">Every board you're part of, personal and team.</p></div>
        <button className="btn btn-gold" onClick={() => openBoardModal()}>+ Create Board</button>
      </div>
      <div className="grid-3">
        {boards.map((b) => {
          const pct = boardProgress(b.id);
          const team = b.team ? teamById(b.team) : null;
          const memberIds = team ? team.members : [currentUser.id];
          return (
            <div className="board-card" key={b.id} onClick={() => openBoard(b.id)}>
              <div className="bc-strip" style={{ background: b.color }}></div>
              <h3>{b.name}</h3>
              <p>{b.desc}</p>
              <div className="progress-bar"><div style={{ width: `${pct}%`, background: b.color }}></div></div>
              <div className="bc-meta">
                <span>{team ? team.name : 'Personal'}</span>
                <div className="avatar-stack">
                  {memberIds.slice(0, 4).map((id) => <Avatar key={id} userId={id} size={22} />)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

import { useApp } from "../AppContext";

import {
  getTeams,
  getTeamById,
  sendTeamInvitation,
  updateMemberRole,
  createTeam,
} from "../api/teamApi";

export default function Team() {
  const { ACTIVITY, toast } = useApp();

  const [teams, setTeams] = useState([]);
  const [currentTeamId, setCurrentTeamId] = useState(null);
  const [team, setTeam] = useState(null);

  const [loading, setLoading] = useState(true);

  // =========================
  // INVITE MEMBER STATES
  // =========================

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteLoading, setInviteLoading] = useState(false);

  // =========================
  // CREATE TEAM STATES
  // =========================

  const [createOpen, setCreateOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // =========================
  // LOAD TEAMS
  // =========================

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);

      const data = await getTeams();

      setTeams(data.teams);

      if (data.teams.length > 0) {
        const firstTeamId = data.teams[0]._id;

        setCurrentTeamId(firstTeamId);

        await loadTeam(firstTeamId);
      } else {
        setCurrentTeamId(null);
        setTeam(null);
      }
    } catch (error) {
      console.error("Load teams error:", error);
      toast(error.message || "Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD ONE TEAM
  // =========================

  const loadTeam = async (teamId) => {
    try {
      const data = await getTeamById(teamId);

      setTeam(data.team);
      setCurrentTeamId(teamId);
    } catch (error) {
      console.error("Load team error:", error);
      toast(error.message || "Failed to load team");
    }
  };

  // =========================
  // CREATE TEAM
  // =========================

  const handleCreateTeam = async () => {
    try {
      if (!teamName.trim()) {
        toast("Please enter a team name");
        return;
      }

      setCreateLoading(true);

      const data = await createTeam(teamName.trim());

      toast(data.message || "Team created successfully");

      setTeamName("");
      setCreateOpen(false);

      // Reload all teams
      const teamsData = await getTeams();

      setTeams(teamsData.teams);

      // Automatically select newly created team
      if (data.team?._id) {
        await loadTeam(data.team._id);
      }
    } catch (error) {
      console.error("Create team error:", error);
      toast(error.message || "Failed to create team");
    } finally {
      setCreateLoading(false);
    }
  };

  // =========================
  // SEND INVITATION
  // =========================

  const handleSendInvitation = async () => {
    try {
      if (!inviteEmail.trim()) {
        toast("Please enter an email address");
        return;
      }

      if (!currentTeamId) {
        toast("Please select a team");
        return;
      }

      setInviteLoading(true);

      const data = await sendTeamInvitation(
        currentTeamId,
        inviteEmail.trim(),
        inviteRole
      );

      toast(data.message || "Invitation sent");

      setInviteEmail("");
      setInviteRole("member");
      setInviteOpen(false);
    } catch (error) {
      console.error("Invite error:", error);
      toast(error.message || "Failed to send invitation");
    } finally {
      setInviteLoading(false);
    }
  };

  // =========================
  // CHANGE MEMBER ROLE
  // =========================

  const handleRoleChange = async (member, role) => {
    try {
      await updateMemberRole(
        currentTeamId,
        member.user._id,
        role
      );

      toast("Role updated");

      await loadTeam(currentTeamId);
    } catch (error) {
      console.error("Role update error:", error);
      toast(error.message || "Failed to update role");
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="page-pad view active">
        <p>Loading teams...</p>
      </div>
    );
  }

  return (
    <div className="page-pad view active">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-title-row">
        <div>
          <h1>Teams</h1>

          <p className="sub">
            Manage members, roles and team workspaces.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <button
            className="btn btn-ghost"
            onClick={() => setCreateOpen(true)}
          >
            + Create Team
          </button>

          <button
            className="btn btn-gold"
            onClick={() => setInviteOpen(true)}
            disabled={!team}
          >
            + Invite Member
          </button>
        </div>
      </div>

      {/* =========================
          TEAM / MEMBER GRID
      ========================= */}

      <div
        className="grid-2"
        style={{
          gridTemplateColumns: "1fr 1.3fr",
          alignItems: "start",
        }}
      >

        {/* =========================
            TEAM LIST
        ========================= */}

        <div className="panel">
          <h3>Teams</h3>

          {teams.length === 0 ? (
            <div>
              <p className="sub">
                You are not part of any teams yet.
              </p>

              <button
                className="btn btn-gold btn-sm"
                onClick={() => setCreateOpen(true)}
              >
                Create your first team
              </button>
            </div>
          ) : (
            <div>
              {teams.map((t) => (
                <div
                  className="mini-task"
                  style={{
                    marginBottom: 8,
                    cursor: "pointer",
                    opacity:
                      currentTeamId === t._id ? 1 : 0.8,
                  }}
                  key={t._id}
                  onClick={() => loadTeam(t._id)}
                >
                  <div
                    className="p-tab"
                    style={{
                      background: "var(--teal)",
                    }}
                  />

                  <div className="mt-title">
                    {t.name}
                  </div>

                  <div className="mt-due">
                    {t.members.length}{" "}
                    {t.members.length === 1
                      ? "member"
                      : "members"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* =========================
            MEMBER LIST
        ========================= */}

        <div className="panel">
          {!team ? (
            <p className="sub">
              Select or create a team.
            </p>
          ) : (
            <>
              <h3>
                Members — <span>{team.name}</span>
              </h3>

              <div>
                {team.members.map((member) => {
                  const user = member.user;

                  const isOwner =
                    member.role === "owner";

                  return (
                    <div
                      className="member-row"
                      key={member._id}
                    >

                      {/* Avatar */}

                      <div
                        className="avatar"
                        style={{
                          width: 38,
                          height: 38,
                          overflow: "hidden",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          user.name
                            ?.charAt(0)
                            .toUpperCase()
                        )}
                      </div>

                      {/* User information */}

                      <div className="member-info">
                        <div className="m-name">
                          {user.name}
                        </div>

                        <div className="m-email">
                          {user.email}
                        </div>
                      </div>

                      {/* Member actions */}

                      <div className="m-actions">
                        <span
                          className={`pill pill-${member.role}`}
                        >
                          {member.role}
                        </span>

                        <select
                          className="select-sm"
                          value={member.role}
                          disabled={isOwner}
                          onChange={(e) =>
                            handleRoleChange(
                              member,
                              e.target.value
                            )
                          }
                        >
                          {isOwner && (
                            <option value="owner">
                              Owner
                            </option>
                          )}

                          <option value="admin">
                            Admin
                          </option>

                          <option value="member">
                            Member
                          </option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* =========================
          TEAM ACTIVITY
      ========================= */}

      <div
        className="panel"
        style={{
          marginTop: 16,
        }}
      >
        <h3>Team activity</h3>

        <div>
          {ACTIVITY.map((a, i) => (
            <div
              className="activity-row"
              key={i}
            >
              <div className="activity-time mono">
                {a.time}
              </div>

              <div
                className="activity-text"
                dangerouslySetInnerHTML={{
                  __html: `${a.user} ${a.text}`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* =========================
          CREATE TEAM POPUP
      ========================= */}

      {createOpen && (
        <div
          className="modal-overlay"
          onClick={() => setCreateOpen(false)}
        >
          <div
            className="panel invite-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Create Team</h3>

            <p className="sub">
              Create a new workspace for your team.
            </p>

            <div className="field">
              <label>Team name</label>

              <input
                type="text"
                value={teamName}
                onChange={(e) =>
                  setTeamName(e.target.value)
                }
                placeholder="SyncBoard Dev Team"
                autoFocus
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setCreateOpen(false);
                  setTeamName("");
                }}
                disabled={createLoading}
              >
                Cancel
              </button>

              <button
                className="btn btn-gold"
                onClick={handleCreateTeam}
                disabled={createLoading}
              >
                {createLoading
                  ? "Creating..."
                  : "Create Team"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          INVITE MEMBER POPUP
      ========================= */}

      {inviteOpen && (
        <div
          className="modal-overlay"
          onClick={() => setInviteOpen(false)}
        >
          <div
            className="panel invite-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Invite Member</h3>

            <p className="sub">
              Invite someone to join{" "}
              <strong>{team?.name}</strong>.
            </p>

            <div className="field">
              <label>Email</label>

              <input
                type="email"
                value={inviteEmail}
                onChange={(e) =>
                  setInviteEmail(e.target.value)
                }
                placeholder="member@example.com"
              />
            </div>

            <div className="field">
              <label>Role</label>

              <select
                value={inviteRole}
                onChange={(e) =>
                  setInviteRole(e.target.value)
                }
              >
                <option value="member">
                  Member
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setInviteOpen(false);
                  setInviteEmail("");
                  setInviteRole("member");
                }}
                disabled={inviteLoading}
              >
                Cancel
              </button>

              <button
                className="btn btn-gold"
                onClick={handleSendInvitation}
                disabled={inviteLoading}
              >
                {inviteLoading
                  ? "Sending..."
                  : "Send Invite"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useEffect, useMemo, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useApp } from '../AppContext';

export default function Analytics() {
  const {
    tasks,
    boards,
    boardsLoading,
    boardProgress,
    tasksForBoard,
    columnsForBoard,
    loadTasks,
    loadColumns,
  } = useApp();

  const donutRef = useRef(null);
  const barRef = useRef(null);
  const teamRef = useRef(null);
  const chartInstances = useRef({});

  // `tasks`/columns in context are only populated for boards the user has
  // opened in Kanban view (loadTasks/loadColumns are only otherwise called
  // from there). Analytics needs every board's data to report accurate
  // totals, so fetch anything missing as soon as the board list is ready.
  useEffect(() => {
    if (boardsLoading) {
      return;
    }

    boards.forEach((board) => {
      loadTasks(board._id);
      loadColumns(board._id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardsLoading, boards]);

  // A task counts as "done" when it sits in a column literally named
  // "Done" - the real Task model has no separate status field, so this
  // mirrors the same logic boardProgress() already uses per-board.
  const isTaskDone = (task, boardId) => {
    const boardColumns = columnsForBoard(boardId);
    const doneColumn = boardColumns.find(
      (column) => column.name?.trim().toLowerCase() === 'done',
    );

    if (!doneColumn) {
      return false;
    }

    const columnId =
      typeof task.column === 'object' ? task.column?._id : task.column;

    return columnId === doneColumn._id;
  };

  const completed = useMemo(
    () =>
      boards.reduce((count, board) => {
        const boardTasks = tasksForBoard(board._id);
        return count + boardTasks.filter((t) => isTaskDone(t, board._id)).length;
      }, 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [boards, tasks],
  );
  const pending = tasks.length - completed;
  const completion = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  // Build the per-member breakdown from whoever is actually assigned to a
  // real task, instead of a hardcoded fake roster - the previous version
  // compared against dummy users (id 'u1'...) that never match a real
  // MongoDB assignedTo id, so every bar was always zero.
  const perMember = useMemo(() => {
    const counts = new Map();

    tasks.forEach((task) => {
      if (!task.assignedTo) {
        return;
      }

      const id =
        typeof task.assignedTo === 'object' ? task.assignedTo._id : task.assignedTo;

      const name =
        typeof task.assignedTo === 'object'
          ? task.assignedTo.name || 'Unknown'
          : 'Unknown';

      const existing = counts.get(id) || { name: name.split(' ')[0], count: 0 };
      existing.count += 1;
      counts.set(id, existing);
    });

    return Array.from(counts.values());
  }, [tasks]);

  useEffect(() => {
    Object.values(chartInstances.current).forEach((c) => c && c.destroy());

    chartInstances.current.donut = new Chart(donutRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Pending'],
        datasets: [{ data: [completed, pending], backgroundColor: ['#6FC28B', '#E3A64A'], borderWidth: 0 }],
      },
      options: { plugins: { legend: { labels: { color: '#9096AB' } } }, cutout: '68%' },
    });

    chartInstances.current.bar = new Chart(barRef.current, {
      type: 'bar',
      data: {
        labels: perMember.map((m) => m.name),
        datasets: [{ label: 'Tasks', data: perMember.map((m) => m.count), backgroundColor: '#4FB8AC', borderRadius: 5 }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#9096AB' }, grid: { display: false } },
          y: { ticks: { color: '#9096AB' }, grid: { color: '#2E3344' } },
        },
      },
    });

    const teamProgress = boards.map((b) => ({ name: b.name, pct: boardProgress(b._id) }));
    chartInstances.current.team = new Chart(teamRef.current, {
      type: 'bar',
      data: {
        labels: teamProgress.map((t) => t.name),
        datasets: [{ label: '% complete', data: teamProgress.map((t) => t.pct), backgroundColor: '#E3A64A', borderRadius: 5 }],
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { max: 100, ticks: { color: '#9096AB' }, grid: { color: '#2E3344' } },
          y: { ticks: { color: '#9096AB' }, grid: { display: false } },
        },
      },
    });

    return () => {
      Object.values(chartInstances.current).forEach((c) => c && c.destroy());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, perMember, boards, completed, pending]);

  return (
    <div className="page-pad view active">
      <div className="page-title-row"><div><h1>Analytics</h1><p className="sub">Progress across all your boards and teams.</p></div></div>
      <div className="grid-4" style={{ marginBottom: 22 }}>
        <div className="stat-card"><div className="label">TOTAL TASKS</div><div className="value">{tasks.length}</div></div>
        <div className="stat-card"><div className="label">COMPLETED</div><div className="value" style={{ color: 'var(--green)' }}>{completed}</div></div>
        <div className="stat-card"><div className="label">PENDING</div><div className="value" style={{ color: 'var(--gold)' }}>{pending}</div></div>
        <div className="stat-card"><div className="label">COMPLETION</div><div className="value">{completion}%</div></div>
      </div>
      <div className="grid-2">
        <div className="panel"><h3>Completed vs Pending</h3><div className="chart-wrap"><canvas ref={donutRef}></canvas></div></div>
        <div className="panel"><h3>Tasks per member</h3><div className="chart-wrap"><canvas ref={barRef}></canvas></div></div>
      </div>
      <div className="panel" style={{ marginTop: 16 }}><h3>Team progress</h3><div className="chart-wrap" style={{ height: 180 }}><canvas ref={teamRef}></canvas></div></div>
    </div>
  );
}

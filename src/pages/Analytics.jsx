import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useApp } from '../AppContext';

export default function Analytics() {
  const { tasks, users, boards, boardProgress } = useApp();
  const donutRef = useRef(null);
  const barRef = useRef(null);
  const teamRef = useRef(null);
  const chartInstances = useRef({});

  const completed = tasks.filter((t) => t.status === 'done').length;
  const pending = tasks.length - completed;
  const completion = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  useEffect(() => {
    Object.values(chartInstances.current).forEach((c) => c && c.destroy());

    chartInstances.current.donut = new Chart(donutRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Pending'],
        datasets: [{ data: [completed || 90, pending || 35], backgroundColor: ['#6FC28B', '#E3A64A'], borderWidth: 0 }],
      },
      options: { plugins: { legend: { labels: { color: '#9096AB' } } }, cutout: '68%' },
    });

    const perMember = users.map((u) => ({ name: u.name.split(' ')[0], count: tasks.filter((t) => t.assignee === u.id).length }));
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

    const teamProgress = boards.map((b) => ({ name: b.name, pct: boardProgress(b.id) }));
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
  }, [tasks, users, boards]);

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

export const USERS = [
  { id: 'u1', name: 'Madhuka Perera', email: 'madhuka@loom.app', initials: 'MP', color: '#E3A64A', online: true, role: 'Owner' },
  { id: 'u2', name: 'Sarah Fernando', email: 'sarah@loom.app', initials: 'SF', color: '#4FB8AC', online: true, role: 'Admin' },
  { id: 'u3', name: 'John Silva', email: 'john@loom.app', initials: 'JS', color: '#6C93E8', online: true, role: 'Member' },
  { id: 'u4', name: 'Amaya Weerasinghe', email: 'amaya@loom.app', initials: 'AW', color: '#E2687C', online: false, role: 'Member' },
  { id: 'u5', name: 'Kasun Jayawardena', email: 'kasun@loom.app', initials: 'KJ', color: '#6FC28B', online: true, role: 'Member' },
];

export const TEAMS = [
  { id: 't1', name: 'Software Engineering', members: ['u1', 'u2', 'u3', 'u5'] },
  { id: 't2', name: 'Marketing Team', members: ['u1', 'u4', 'u2'] },
];

export const BOARDS = [
  { id: 'b1', name: 'Personal Board', desc: 'My own tasks and errands', team: null, color: '#E3A64A' },
  { id: 'b2', name: 'Software Engineering Project', desc: 'Main sprint board for the SE team', team: 't1', color: '#4FB8AC' },
  { id: 'b3', name: 'Final Year Research', desc: 'Thesis milestones and writing', team: null, color: '#6C93E8' },
  { id: 'b4', name: 'Marketing Team', desc: 'Campaign planning board', team: 't2', color: '#E2687C' },
];

export const INITIAL_TASKS = [
  { id: 'k1', board: 'b2', title: 'Design Login UI', desc: 'Create the high-fidelity design for the login and register screens, matching the Loom brand palette.', priority: 'High', due: '2026-08-12', assignee: 'u1', labels: ['Frontend', 'Design'], status: 'todo', attachments: ['login-mock.png'], comments: [{ user: 'u2', text: 'Looks good, can we try a darker accent?', time: '10:02' }] },
  { id: 'k2', board: 'b2', title: 'Set up API auth endpoints', desc: 'Implement JWT-based login and register endpoints.', priority: 'High', due: '2026-08-14', assignee: 'u3', labels: ['Backend'], status: 'todo', attachments: [], comments: [] },
  { id: 'k3', board: 'b2', title: 'Kanban drag and drop', desc: 'Implement drag and drop between To Do, Doing and Done columns.', priority: 'Medium', due: '2026-08-18', assignee: 'u1', labels: ['Frontend', 'Feature'], status: 'doing', attachments: [], comments: [{ user: 'u1', text: 'Started on the drag events today.', time: '09:14' }] },
  { id: 'k4', board: 'b2', title: 'Write unit tests for board service', desc: 'Cover board creation, edit and delete.', priority: 'Low', due: '2026-08-22', assignee: 'u5', labels: ['Testing'], status: 'doing', attachments: [], comments: [] },
  { id: 'k5', board: 'b2', title: 'Project kickoff doc', desc: 'Draft the kickoff document for stakeholders.', priority: 'Medium', due: '2026-08-05', assignee: 'u2', labels: ['Docs'], status: 'done', attachments: ['kickoff.pdf'], comments: [{ user: 'u1', text: 'Great summary, approved.', time: '14:20' }] },
  { id: 'k6', board: 'b2', title: 'Set up CI pipeline', desc: 'GitHub Actions for lint, test and build.', priority: 'Medium', due: '2026-08-03', assignee: 'u3', labels: ['DevOps'], status: 'done', attachments: [], comments: [] },
  { id: 'k7', board: 'b1', title: 'Book dentist appointment', desc: '', priority: 'Low', due: '2026-08-13', assignee: 'u1', labels: ['Personal'], status: 'todo', attachments: [], comments: [] },
  { id: 'k8', board: 'b1', title: 'Read 2 chapters of Clean Code', desc: '', priority: 'Medium', due: '2026-08-16', assignee: 'u1', labels: ['Learning'], status: 'doing', attachments: [], comments: [] },
  { id: 'k9', board: 'b1', title: 'Renew gym membership', desc: '', priority: 'Low', due: '2026-08-09', assignee: 'u1', labels: ['Personal'], status: 'done', attachments: [], comments: [] },
  { id: 'k10', board: 'b3', title: 'Literature review draft', desc: 'First draft of chapter 2.', priority: 'High', due: '2026-08-25', assignee: 'u1', labels: ['Writing'], status: 'todo', attachments: ['draft-ch2.docx'], comments: [] },
  { id: 'k11', board: 'b3', title: 'Collect survey responses', desc: 'Target 100 responses by end of month.', priority: 'Medium', due: '2026-08-28', assignee: 'u1', labels: ['Research'], status: 'doing', attachments: [], comments: [] },
  { id: 'k12', board: 'b4', title: 'Design Q3 campaign banner', desc: 'Social + web banner set.', priority: 'High', due: '2026-08-15', assignee: 'u4', labels: ['Design'], status: 'todo', attachments: [], comments: [] },
  { id: 'k13', board: 'b4', title: 'Schedule newsletter', desc: '', priority: 'Medium', due: '2026-08-11', assignee: 'u2', labels: ['Content'], status: 'doing', attachments: [], comments: [] },
  { id: 'k14', board: 'b4', title: 'Review analytics from July', desc: '', priority: 'Low', due: '2026-08-06', assignee: 'u4', labels: ['Reports'], status: 'done', attachments: [], comments: [] },
];

export const ACTIVITY = [
  { time: '9:30', user: 'John', text: 'created task <b>Set up API auth endpoints</b>' },
  { time: '10:00', user: 'Sarah', text: 'moved <b>Design Login UI</b> to Doing' },
  { time: '11:10', user: 'Kasun', text: 'completed <b>Set up CI pipeline</b>' },
  { time: '13:40', user: 'Madhuka', text: 'commented on <b>Kanban drag and drop</b>' },
  { time: '15:05', user: 'Amaya', text: 'uploaded a file to <b>Design Q3 campaign banner</b>' },
];

export const NOTIFICATIONS = [
  { icon: '🔁', text: '<b>John</b> moved a task to Doing', time: '5 min ago' },
  { icon: '📌', text: '<b>Sarah</b> assigned you a task', time: '22 min ago' },
  { icon: '💬', text: 'New comment on <b>Kanban drag and drop</b>', time: '1 hr ago' },
  { icon: '✅', text: 'Task <b>Set up CI pipeline</b> completed', time: '3 hr ago' },
  { icon: '⏰', text: 'Deadline tomorrow: <b>Book dentist appointment</b>', time: '5 hr ago' },
];

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDB } from './db.js';
import mongoose from 'mongoose';
import User from './models/User.js';
import Team from './models/Team.js';
import Board from './models/Board.js';
import Task from './models/Task.js';
import Activity from './models/Activity.js';
import Notification from './models/Notification.js';

const USERS = [
  { name: 'Madhuka Perera', email: 'madhuka@loom.app', initials: 'MP', color: '#E3A64A', online: true, role: 'Owner' },
  { name: 'Sarah Fernando', email: 'sarah@loom.app', initials: 'SF', color: '#4FB8AC', online: true, role: 'Admin' },
  { name: 'John Silva', email: 'john@loom.app', initials: 'JS', color: '#6C93E8', online: true, role: 'Member' },
  { name: 'Amaya Weerasinghe', email: 'amaya@loom.app', initials: 'AW', color: '#E2687C', online: false, role: 'Member' },
  { name: 'Kasun Jayawardena', email: 'kasun@loom.app', initials: 'KJ', color: '#6FC28B', online: true, role: 'Member' },
];

const DEFAULT_PASSWORD = 'password';

async function run() {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Board.deleteMany({}),
    Task.deleteMany({}),
    Activity.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  console.log('Creating users...');
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const userDocs = await User.insertMany(USERS.map((u) => ({ ...u, passwordHash })));
  const byEmail = Object.fromEntries(userDocs.map((u) => [u.email, u]));
  const [madhuka, sarah, john, amaya, kasun] = [
    byEmail['madhuka@loom.app'],
    byEmail['sarah@loom.app'],
    byEmail['john@loom.app'],
    byEmail['amaya@loom.app'],
    byEmail['kasun@loom.app'],
  ];

  console.log('Creating teams...');
  const teamSE = await Team.create({ name: 'Software Engineering', members: [madhuka._id, sarah._id, john._id, kasun._id] });
  const teamMkt = await Team.create({ name: 'Marketing Team', members: [madhuka._id, amaya._id, sarah._id] });

  console.log('Creating boards...');
  const boardPersonal = await Board.create({ name: 'Personal Board', desc: 'My own tasks and errands', team: null, color: '#E3A64A', owner: madhuka._id });
  const boardSE = await Board.create({ name: 'Software Engineering Project', desc: 'Main sprint board for the SE team', team: teamSE._id, color: '#4FB8AC', owner: madhuka._id });
  const boardResearch = await Board.create({ name: 'Final Year Research', desc: 'Thesis milestones and writing', team: null, color: '#6C93E8', owner: madhuka._id });
  const boardMkt = await Board.create({ name: 'Marketing Team', desc: 'Campaign planning board', team: teamMkt._id, color: '#E2687C', owner: madhuka._id });

  console.log('Creating tasks...');
  const taskDefs = [
    { board: boardSE._id, title: 'Design Login UI', desc: 'Create the high-fidelity design for the login and register screens, matching the Loom brand palette.', priority: 'High', due: '2026-08-12', assignee: madhuka._id, labels: ['Frontend', 'Design'], status: 'todo', attachments: ['login-mock.png'], comments: [{ user: sarah._id, text: 'Looks good, can we try a darker accent?' }] },
    { board: boardSE._id, title: 'Set up API auth endpoints', desc: 'Implement JWT-based login and register endpoints.', priority: 'High', due: '2026-08-14', assignee: john._id, labels: ['Backend'], status: 'todo', attachments: [], comments: [] },
    { board: boardSE._id, title: 'Kanban drag and drop', desc: 'Implement drag and drop between To Do, Doing and Done columns.', priority: 'Medium', due: '2026-08-18', assignee: madhuka._id, labels: ['Frontend', 'Feature'], status: 'doing', attachments: [], comments: [{ user: madhuka._id, text: 'Started on the drag events today.' }] },
    { board: boardSE._id, title: 'Write unit tests for board service', desc: 'Cover board creation, edit and delete.', priority: 'Low', due: '2026-08-22', assignee: kasun._id, labels: ['Testing'], status: 'doing', attachments: [], comments: [] },
    { board: boardSE._id, title: 'Project kickoff doc', desc: 'Draft the kickoff document for stakeholders.', priority: 'Medium', due: '2026-08-05', assignee: sarah._id, labels: ['Docs'], status: 'done', attachments: ['kickoff.pdf'], comments: [{ user: madhuka._id, text: 'Great summary, approved.' }] },
    { board: boardSE._id, title: 'Set up CI pipeline', desc: 'GitHub Actions for lint, test and build.', priority: 'Medium', due: '2026-08-03', assignee: john._id, labels: ['DevOps'], status: 'done', attachments: [], comments: [] },
    { board: boardPersonal._id, title: 'Book dentist appointment', desc: '', priority: 'Low', due: '2026-08-13', assignee: madhuka._id, labels: ['Personal'], status: 'todo', attachments: [], comments: [] },
    { board: boardPersonal._id, title: 'Read 2 chapters of Clean Code', desc: '', priority: 'Medium', due: '2026-08-16', assignee: madhuka._id, labels: ['Learning'], status: 'doing', attachments: [], comments: [] },
    { board: boardPersonal._id, title: 'Renew gym membership', desc: '', priority: 'Low', due: '2026-08-09', assignee: madhuka._id, labels: ['Personal'], status: 'done', attachments: [], comments: [] },
    { board: boardResearch._id, title: 'Literature review draft', desc: 'First draft of chapter 2.', priority: 'High', due: '2026-08-25', assignee: madhuka._id, labels: ['Writing'], status: 'todo', attachments: ['draft-ch2.docx'], comments: [] },
    { board: boardResearch._id, title: 'Collect survey responses', desc: 'Target 100 responses by end of month.', priority: 'Medium', due: '2026-08-28', assignee: madhuka._id, labels: ['Research'], status: 'doing', attachments: [], comments: [] },
    { board: boardMkt._id, title: 'Design Q3 campaign banner', desc: 'Social + web banner set.', priority: 'High', due: '2026-08-15', assignee: amaya._id, labels: ['Design'], status: 'todo', attachments: [], comments: [] },
    { board: boardMkt._id, title: 'Schedule newsletter', desc: '', priority: 'Medium', due: '2026-08-11', assignee: sarah._id, labels: ['Content'], status: 'doing', attachments: [], comments: [] },
    { board: boardMkt._id, title: 'Review analytics from July', desc: '', priority: 'Low', due: '2026-08-06', assignee: amaya._id, labels: ['Reports'], status: 'done', attachments: [], comments: [] },
  ];
  const tasks = await Task.insertMany(taskDefs);

  console.log('Creating activity feed...');
  const taskByTitle = Object.fromEntries(tasks.map((t) => [t.title, t]));
  await Activity.insertMany([
    { user: john._id, board: boardSE._id, task: taskByTitle['Set up API auth endpoints']._id, text: 'created task <b>Set up API auth endpoints</b>' },
    { user: sarah._id, board: boardSE._id, task: taskByTitle['Design Login UI']._id, text: 'moved <b>Design Login UI</b> to Doing' },
    { user: kasun._id, board: boardSE._id, task: taskByTitle['Set up CI pipeline']._id, text: 'completed <b>Set up CI pipeline</b>' },
    { user: madhuka._id, board: boardSE._id, task: taskByTitle['Kanban drag and drop']._id, text: 'commented on <b>Kanban drag and drop</b>' },
    { user: amaya._id, board: boardMkt._id, task: taskByTitle['Design Q3 campaign banner']._id, text: 'uploaded a file to <b>Design Q3 campaign banner</b>' },
  ]);

  console.log('Creating notifications (for Madhuka)...');
  await Notification.insertMany([
    { user: madhuka._id, icon: '🔁', text: '<b>John</b> moved a task to Doing' },
    { user: madhuka._id, icon: '📌', text: '<b>Sarah</b> assigned you a task' },
    { user: madhuka._id, icon: '💬', text: 'New comment on <b>Kanban drag and drop</b>' },
    { user: madhuka._id, icon: '✅', text: 'Task <b>Set up CI pipeline</b> completed' },
    { user: madhuka._id, icon: '⏰', text: 'Deadline tomorrow: <b>Book dentist appointment</b>' },
  ]);

  console.log('\nSeed complete. Demo accounts (all use password "password"):');
  USERS.forEach((u) => console.log(`  ${u.email}`));

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

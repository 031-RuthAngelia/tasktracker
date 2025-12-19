const fs = require("fs");
const path = require("path");

const command = process.argv[2];
const args = process.argv.slice(3);

const FILE_PATH = path.join(__dirname, "tasks.json");

/* ===== FILE HELPERS ===== */
function readTasks() {
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([]));
  }

  const data = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(data);
}

function writeTasks(tasks) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}

/* ===== ADD TASK ===== */
function addTask(description) {
  if (!description) {
    console.log("❌ Please provide a task!");
    return;
  }

  const tasks = readTasks();

  const newTask = {
    id: tasks.length + 1,
    description: description,
    status: "todo"
  };

  tasks.push(newTask);
  writeTasks(tasks);

  console.log("✅ Task added:", description);
}

/* ===== LIST TASKS ===== */
function listTasks(status) {
  const tasks = readTasks();

  const filteredTasks = status
    ? tasks.filter(task => task.status === status)
    : tasks;

  if (filteredTasks.length === 0) {
    console.log("📭 No tasks found");
    return;
  }

  filteredTasks.forEach(task => {
    console.log(`[${task.id}] ${task.description} (${task.status})`);
  });
}

/* ===== MARK STATUS ===== */
function markTaskStatus(id, status) {
  const tasks = readTasks();
  const task = tasks.find(t => t.id === Number(id));

  if (!task) {
    console.log("❌ Task not found");
    return;
  }

  task.status = status;
  writeTasks(tasks);

  console.log(`✅ Task ${id} marked as ${status}`);
}

/* ===== DELETE TASK ===== */
function deleteTask(id) {
  const tasks = readTasks();
  const newTasks = tasks.filter(task => task.id !== Number(id));

  if (tasks.length === newTasks.length) {
    console.log("❌ Task not found!");
    return;
  }

  writeTasks(newTasks);
  console.log(`🗑️ Task ${id} deleted`);
}

/* ===== COMMAND HANDLER ===== */
if (command === "add") {
  addTask(args.join(" "));
}

if (command === "list") {
  listTasks(args[0]); // todo | done | in-progress
}

if (command === "delete") {
  deleteTask(args[0]);
}

if (command === "done") {
  markTaskStatus(args[0], "done");
}

if (command === "in-progress") {
  markTaskStatus(args[0], "in-progress");
}

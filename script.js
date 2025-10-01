// Task Manager Script
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = '';
  if (tasks.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No tasks yet!';
    li.style.textAlign = 'center';
    li.style.color = '#aaa';
    list.appendChild(li);
    return;
  }
  tasks.forEach((task, idx) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.setAttribute('role', 'listitem');
    // Checkbox
    const label = document.createElement('label');
    label.className = 'task-label';
    label.tabIndex = 0;
    label.setAttribute('aria-label', task.text + (task.completed ? ' completed' : ''));
    // Checkbox input (hidden, for accessibility)
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'visually-hidden';
    checkbox.tabIndex = -1;
    checkbox.setAttribute('aria-hidden', 'true');
    checkbox.addEventListener('change', () => toggleTask(idx));
    label.appendChild(checkbox);
    // Task text
    const span = document.createElement('span');
    span.textContent = task.text;
    label.appendChild(span);
    label.addEventListener('click', () => toggleTask(idx));
    label.addEventListener('keypress', e => {
      if (e.key === 'Enter' || e.key === ' ') toggleTask(idx);
    });
    li.appendChild(label);
    // Actions
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'delete';
    delBtn.setAttribute('aria-label', 'Delete task');
    delBtn.innerHTML = '🗑️';
    delBtn.addEventListener('click', () => deleteTask(idx));
    actions.appendChild(delBtn);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

function addTask(text) {
  tasks.push({ text, completed: false });
  saveTasks();
  renderTasks();
}

function deleteTask(idx) {
  tasks.splice(idx, 1);
  saveTasks();
  renderTasks();
}

function toggleTask(idx) {
  tasks[idx].completed = !tasks[idx].completed;
  saveTasks();
  renderTasks();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    addTask(text);
    input.value = '';
    input.focus();
  }
});

// Initial render
renderTasks();

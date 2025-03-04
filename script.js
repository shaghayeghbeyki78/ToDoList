document.addEventListener('DOMContentLoaded', loadTasks);

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const dateInput = taskForm.querySelector('input[type="date"]');
const taskList = document.getElementById('task-list');
const clearButton = document.getElementById('clear-all');

// تنظیم حداقل تاریخ به امروز
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

taskForm.addEventListener('submit', handleTaskSubmit);
clearButton.addEventListener('click', clearAllTasks);

function handleTaskSubmit(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    const taskDate = dateInput.value;

    // اطمینان از اینکه وظیفه خالی نیست و تاریخ انتخاب شده
    if (!taskText) {
        alert('لطفاً یک وظیفه معتبر وارد کنید.');
        return;
    }
    if (!taskDate) {
        alert('لطفاً یک تاریخ معتبر وارد کنید.');
        return;
    }

    const task = { text: taskText, date: taskDate, completed: false };
    addTaskToDOM(task);
    saveTaskToLocalStorage(task);
    updateClearButtonStatus();
    taskInput.value = '';
    dateInput.value = ''; // خالی کردن ورودی تاریخ
}

function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(addTaskToDOM);
    updateClearButtonStatus();
}

function addTaskToDOM(task) {
    const li = document.createElement('li');
    const checkbox = createCheckbox(task, li);
    const taskLabel = createTaskLabel(task);
    const dateLabel = createDateLabel(task); // اضافه کردن تاریخ
    const editButton = createEditButton(task, taskLabel);
    const removeButton = createRemoveButton(task, li);

    li.append(checkbox, taskLabel, dateLabel, editButton, removeButton);
    li.classList.toggle('completed', task.completed);

    // اضافه کردن رویداد کلیک روی کل عنصر li برای فعال یا غیرفعال کردن وظیفه
    li.addEventListener('click', () => {
        const checkbox = li.querySelector('.task-checkbox');
        checkbox.checked = !checkbox.checked;
        li.classList.toggle('completed', checkbox.checked);
        updateTaskInLocalStorage(task.text, checkbox.checked, task.date);
        editButton.disabled = checkbox.checked;
    });

    taskList.appendChild(li);
}

function createCheckbox(task, li) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = task.completed;

    return checkbox;
}

function createTaskLabel(task) {
    const taskLabel = document.createElement('span');
    taskLabel.textContent = task.text;
    return taskLabel;
}

function createDateLabel(task) {
    const dateLabel = document.createElement('span');
    dateLabel.textContent = ` - تاریخ: ${task.date}`;
    dateLabel.classList.add('task-date'); // اضافه کردن کلاس برای استایل
    return dateLabel;
}

function createEditButton(task, taskLabel) {
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
    editButton.classList.add('edit');
    editButton.disabled = task.completed;

    editButton.onclick = () => {
        const newTaskText = prompt('ویرایش وظیفه:', task.text);
        if (newTaskText) {
            taskLabel.textContent = newTaskText;
            updateTaskInLocalStorage(task.text, task.completed, newTaskText);
            task.text = newTaskText;
        }
    };

    return editButton;
}

function createRemoveButton(task, li) {
    const removeButton = document.createElement('button');
    removeButton.innerHTML = '<i class="fas fa-times"></i>';
    removeButton.classList.add('remove');

    removeButton.onclick = () => {
        li.remove();
        removeTaskFromLocalStorage(task.text);
        updateClearButtonStatus();
    };

    return removeButton;
}

function saveTaskToLocalStorage(task) {
    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function updateTaskInLocalStorage(oldText, completed, newText) {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.map(task =>
        task.text === oldText ? { text: newText || oldText, date: task.date, completed } : task
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function removeTaskFromLocalStorage(taskText) {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function updateClearButtonStatus() {
    const tasks = getTasksFromLocalStorage();
    clearButton.disabled = tasks.length < 2; // غیرفعال کردن دکمه وقتی کمتر از دو وظیفه وجود داشته باشد
}

function clearAllTasks() {
    if (confirm('آیا مطمئن هستید که همه وظایف را پاک کنید؟')) {
        taskList.innerHTML = '';
        localStorage.removeItem('tasks');
        updateClearButtonStatus();
    }
}  

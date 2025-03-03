document.addEventListener('DOMContentLoaded', loadTasks);

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const clearButton = document.getElementById('clear-all');

taskForm.addEventListener('submit', handleTaskSubmit);
clearButton.addEventListener('click', clearAllTasks);

function handleTaskSubmit(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();

    // اطمینان از اینکه وظیفه خالی نیست
    if (!taskText) {
        alert('لطفاً یک وظیفه معتبر وارد کنید.');
        return;
    }

    const task = { text: taskText, completed: false };
    addTaskToDOM(task);
    saveTaskToLocalStorage(task);
    updateClearButtonStatus();
    taskInput.value = '';
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
    const editButton = createEditButton(task, taskLabel);
    const removeButton = createRemoveButton(task, li);

    li.append(checkbox, taskLabel, editButton, removeButton);
    li.classList.toggle('completed', task.completed);

    // اضافه کردن رویداد کلیک روی کل عنصر li برای فعال یا غیرفعال کردن وظیفه
    li.addEventListener('click', () => {
        const checkbox = li.querySelector('.task-checkbox'); // پیدا کردن چک باکس
        checkbox.checked = !checkbox.checked; // تغییر وضعیت چک باکس
        li.classList.toggle('completed', checkbox.checked);
        updateTaskInLocalStorage(task.text, checkbox.checked);
        editButton.disabled = checkbox.checked; // غیرفعال کردن دکمه ویرایش
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

function createEditButton(task, taskLabel) {
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
    editButton.classList.add('edit');
    editButton.disabled = task.completed;

    editButton.onclick = () => {
        const newTaskText = prompt('ویرایش وظیفه:', task.text);
        if (newTaskText) {
            taskLabel.textContent = newTaskText;
            updateTaskInLocalStorage(task.text, false, newTaskText);
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
        task.text === oldText ? { text: newText || oldText, completed } : task
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

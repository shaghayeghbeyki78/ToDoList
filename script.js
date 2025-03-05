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
    const checkbox = createCheckbox(task, li); // فراخوانی با ترتیب صحیح
    const taskLabel = createTaskLabel(task);
    const dateLabel = createDateLabel(task); // اضافه کردن تاریخ
    const editButton = createEditButton(task, taskLabel, task); // ارسال task به createEditButton
    const removeButton = createRemoveButton(task, li);

    li.append(checkbox, taskLabel, dateLabel, editButton, removeButton);
    li.classList.toggle('completed', task.completed);
    editButton.disabled = task.completed; // تنظیم اولیه وضعیت دکمه ویرایش

    // اضافه کردن رویداد کلیک روی label برای فعال یا غیرفعال کردن وظیفه
    taskLabel.addEventListener('click', () => {
        task.completed = !task.completed;
        li.classList.toggle('completed', task.completed);
        checkbox.checked = task.completed;
        editButton.disabled = task.completed; // به‌روزرسانی وضعیت دکمه ویرایش
        updateTaskInLocalStorage(task);
    });

    taskList.appendChild(li);
}


function createCheckbox(task, li) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = task.completed;

    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        li.classList.toggle('completed', task.completed);
        const editButton = li.querySelector('.edit'); // پیدا کردن دکمه ویرایش مربوطه
        if (editButton) {
            editButton.disabled = task.completed; // به‌روزرسانی وضعیت دکمه ویرایش
        }
        updateTaskInLocalStorage(task);
    });

    return checkbox;
}

function createTaskLabel(task) {
    const taskLabel = document.createElement('span');
    taskLabel.textContent = task.text;
    taskLabel.classList.add('task-label'); // اضافه کردن کلاس
    return taskLabel;
}

function createDateLabel(task) {
    const dateLabel = document.createElement('span');
    dateLabel.textContent = ` - تاریخ: ${task.date}`;
    dateLabel.classList.add('task-date'); // اضافه کردن کلاس برای استایل
    return dateLabel;
}

function createEditButton(task, taskLabel) { // دریا��ت task به عنوان آرگومان
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
    editButton.classList.add('edit');
    editButton.disabled = task.completed;

    editButton.onclick = () => {
        const newTaskText = prompt('ویرایش وظیفه:', task.text);
        if (newTaskText) {
            task.text = newTaskText;
            taskLabel.textContent = newTaskText;
            updateTaskInLocalStorage(task);
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

function updateTaskInLocalStorage(updatedTask) {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.map(task => {
        if (task.text === updatedTask.text && task.date === updatedTask.date) {
            return updatedTask;
        }
        return task;
    });
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

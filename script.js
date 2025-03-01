document.addEventListener('DOMContentLoaded', loadTasks); // بارگذاری وظایف از localStorage

document.getElementById('task-form').addEventListener('submit', function (e) {
    e.preventDefault(); // جلوگیری از ارسال فرم

    const input = document.getElementById('task-input');
    const taskText = input.value.trim(); // حذف فضاهای خالی

    // ایجاد عنصر جدید برای وظیفه
    const task = { text: taskText, completed: false };
    addTaskToDOM(task);
    saveTaskToLocalStorage(task);

    input.value = ''; // پاک کردن فیلد ورودی
});

// بارگذاری وظایف از localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(addTaskToDOM);
}

// افزودن وظیفه به DOM
function addTaskToDOM(task) {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', function () {
        li.classList.toggle('completed', checkbox.checked);
        updateTaskInLocalStorage(task.text, checkbox.checked);
    });

    const taskLabel = document.createElement('span');
    taskLabel.textContent = task.text;

    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
    editButton.classList.add('edit');
    editButton.onclick = function () {
        const newTaskText = prompt('ویرایش وظیفه:', task.text);
        if (newTaskText) {
            taskLabel.textContent = newTaskText;
            updateTaskInLocalStorage(task.text, false, newTaskText);
            task.text = newTaskText;
        }
    };

    const removeButton = document.createElement('button');
    removeButton.innerHTML = '<i class="fas fa-times"></i>';
    removeButton.classList.add('remove');
    removeButton.onclick = function () {
        li.remove();
        removeTaskFromLocalStorage(task.text);
    };

    li.appendChild(checkbox);
    li.appendChild(taskLabel);
    li.appendChild(editButton);
    li.appendChild(removeButton);
    document.getElementById('task-list').appendChild(li);
    li.classList.toggle('completed', task.completed);
}

// ذخیره وظیفه در localStorage
function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// بروزرسانی وضعیت وظیفه در localStorage
function updateTaskInLocalStorage(oldText, completed, newText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.map(task => {
        if (task.text === oldText) {
            return { text: newText || oldText, completed };
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

// حذف وظیفه از localStorage
function removeTaskFromLocalStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

// عملکرد دکمه سطل زباله
document.getElementById('clear-all').addEventListener('click', function () {
    if (confirm('آیا مطمئن هستید که همه وظایف را پاک کنید؟')) {
        document.getElementById('task-list').innerHTML = ''; // حذف تمام وظایف
        localStorage.removeItem('tasks'); // پاک کردن localStorage
    }
});

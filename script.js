document.addEventListener("DOMContentLoaded", loadTasks);

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        addTask(input.value);
        input.value = '';
    }
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task.text, task.completed));
}

function addTask(text) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const newTask = { text, completed: false };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    addTaskToDOM(text, false);
}

function addTaskToDOM(text, completed) {
    const li = document.createElement('li');
    li.textContent = text;
    li.className = completed ? 'completed' : '';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'ویرایش';
    editBtn.onclick = () => {
        editTask(li, text);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'حذف';
    deleteBtn.onclick = () => {
        deleteTask(text);
        li.remove();
    };

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = completed ? 'غیرفعال' : 'فعال';
    toggleBtn.onclick = () => {
        toggleTask(text);
        li.classList.toggle('completed');
        toggleBtn.textContent = li.classList.contains('completed') ? 'غیرفعال' : 'فعال';
    };

    li.appendChild(editBtn);
    li.appendChild(toggleBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function editTask(li, oldText) {
    const newText = prompt("ویرایش وظیفه:", oldText);
    if (newText === null) return; // کاربر دکمه لغو را زده است.
    if (newText.trim() === '') {
        alert("متن نمی‌تواند خالی باشد.");
        return;
    }

    // به‌روزرسانی محتوای محلی و به‌روزرسانی UI
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        if (task.text === oldText) {
            task.text = newText;
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    li.firstChild.nodeValue = newText; // به‌روزرسانی متن وظیفه در DOM
}

function deleteTask(text) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== text);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleTask(text) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        if (task.text === text) {
            task.completed = !task.completed;
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}  

document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('task-input');
    const addButton = document.getElementById('add-button');
    const taskList = document.getElementById('task-list');
    const missionPopup = document.getElementById('mission-popup');
    const closePopupBtn = document.getElementById('close-popup');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    renderTasks();

    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({
                id: Date.now(),
                text: text,
                completed: false
            });
            saveTasks();
            renderTasks();
            taskInput.value = '';
            taskInput.focus();
        }
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    function editTask(id) {
        const taskElement = document.getElementById(`task-${id}`);
        const task = tasks.find(t => t.id === id);

        taskElement.classList.add('editing');
        taskElement.innerHTML = `
            <input type="text" class="edit-input" value="${task.text}">
            <div class="task-actions">
                <button class="edit-btn save-btn">Save</button>
                <button class="edit-btn cancel-btn">Cancel</button>
            </div>
        `;

        const editInput = taskElement.querySelector('.edit-input');
        const saveBtn = taskElement.querySelector('.save-btn');
        const cancelBtn = taskElement.querySelector('.cancel-btn');

        editInput.focus();
        
        saveBtn.addEventListener('click', function() {
            saveEdit(id, editInput.value);
        });

        cancelBtn.addEventListener('click', function() {
            taskElement.classList.remove('editing');
            renderTasks();
        });

        editInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveEdit(id, editInput.value);
            }
        });
    }

    function saveEdit(id, newText) {
        if (newText.trim()) {
            const index = tasks.findIndex(task => task.id === id);
            if (index !== -1) {
                tasks[index].text = newText.trim();
                saveTasks();
                renderTasks();
            }
        }
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.id = `task-${task.id}`;
            li.className = 'task-item';
            if (task.completed) {
                li.classList.add('completed');
            }

            const checkbox = document.createElement('input');
            checkbox.type='checkbox';
            checkbox.className = 'task-check';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', function() {
                task.completed = checkbox.checked;
                saveTasks();
                renderTasks();
            });
            li.appendChild(checkbox);

            const p = document.createElement('p');
            p.className = 'task-text';
            p.textContent = task.text;
            li.appendChild(p);

            const actions = document.createElement('div');
            actions.className = 'task-actions';
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => editTask(task.id));
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
            li.appendChild(actions);
            taskList.appendChild(li);
        });

        if (tasks.length > 0 && tasks.every(task => task.completed)) {
            missionPopup.style.display = 'flex';

            setTimeout(() => {
                missionPopup.style.display = 'none';
            }, 5000);
        } else {
            missionPopup.style.display = 'none';
        }
    }

    closePopupBtn.addEventListener('click', function() {
        missionPopup.style.display = 'none'
    });

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const filters = document.getElementById('filters');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = (filter = 'all') => {
        taskList.innerHTML = '';
        tasks
            .filter(task => filter === 'all' || (filter === 'pending' && !task.completed) || (filter === 'completed' && task.completed))
            .forEach((task, index) => {
                const taskItem = document.createElement('li');
                taskItem.className = `task ${task.completed ? 'completed' : ''}`;
                taskItem.innerHTML = `
                    <span>${task.name}</span>
                    <div>
                        <button onclick="toggleComplete(${index})">${task.completed ? 'Desmarcar' : 'Concluir'}</button>
                        <button onclick="editTask(${index})">Editar</button>
                        <button onclick="deleteTask(${index})">Excluir</button>
                    </div>
                `;
                taskList.appendChild(taskItem);
            });
    };

    const addTask = (name) => {
        tasks.push({ name, completed: false });
        saveTasks();
        renderTasks();
    };

    const toggleComplete = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    const editTask = (index) => {
        const newName = prompt('Editar tarefa', tasks[index].name);
        if (newName) {
            tasks[index].name = newName;
            saveTasks();
            renderTasks();
        }
    };

    const deleteTask = (index) => {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskName = taskInput.value.trim();
        if (taskName) {
            addTask(taskName);
            taskInput.value = '';
        }
    });

    filters.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            renderTasks(e.target.dataset.filter);
        }
    });

    renderTasks();
});

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let currentSearch = "";
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const errorMessage = document.getElementById("errorMessage");
const taskCount = document.getElementById("taskCount");
const filterButtons = document.querySelectorAll(".filter-btn");


function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function renderTasks() {
    taskList.textContent = "";
    let filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "active") {
            return task.completed === false;
        }

        if (currentFilter === "completed") {
            return task.completed === true;
        }

        return true;

    });

    filteredTasks = filteredTasks.filter(function(task) {

        return task.title
            .toLowerCase()
            .includes(currentSearch.toLowerCase());

    });

    if (filteredTasks.length === 0) {

        const emptyMessage = document.createElement("li");

        emptyMessage.classList.add("empty-state");

        if (currentSearch !== "") {
            emptyMessage.textContent =
                "Tugas yang dicari tidak ditemukan.";

        } else if (currentFilter === "active") {
            emptyMessage.textContent =
                "Tidak ada tugas aktif.";

        } else if (currentFilter === "completed") {
            emptyMessage.textContent =
                "Belum ada tugas yang selesai.";

        } else {
            emptyMessage.textContent =
                "Belum ada tugas.";

        }
        taskList.appendChild(emptyMessage);
        updateTaskCount();
        return;
    }

    filteredTasks.forEach(function(task) {
        const li = document.createElement("li");
        li.classList.add("task-item");
        if (task.completed) {
            li.classList.add("completed");
        }

        li.dataset.id = task.id;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("complete-checkbox");
        checkbox.checked = task.completed;
        const title = document.createElement("span");
        title.classList.add("task-title")
        title.textContent = task.title;
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.classList.add("edit-btn");
        editButton.dataset.action = "edit";
        editButton.textContent = "Edit";
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList.add("delete-btn");
        deleteButton.dataset.action = "delete";
        deleteButton.textContent = "Hapus";
        li.appendChild(checkbox);
        li.appendChild(title);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);

    });

    updateTaskCount();

}


function addTask(title) {
    const newTask = {
        id: crypto.randomUUID(),
        title: title,
        completed: false

    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();

}


function deleteTask(id) {
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });
    saveTasks();

    renderTasks();

}


function toggleTask(id) {
    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (task) {
        task.completed = !task.completed;
    }

    saveTasks();
    renderTasks();

}


function editTask(id) {
    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    const newTitle = prompt(
        "Masukkan judul tugas baru:",
        task.title
    );

    if (newTitle === null) {
        return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle.length < 3) {

        alert(
            "Judul tugas harus memiliki minimal 3 karakter."
        );

        return;
    }
    task.title = trimmedTitle;
    saveTasks();
    renderTasks();
}


taskForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const title = taskInput.value.trim();
    if (title === "") {
        errorMessage.textContent =
            "Judul tugas tidak boleh kosong.";
        return;
    }

    if (title.length < 3) {
        errorMessage.textContent =
            "Judul tugas harus memiliki minimal 3 karakter.";
        return;
    }
    errorMessage.textContent = "";
    addTask(title);
    taskInput.value = "";
    taskInput.focus();
});


taskList.addEventListener("click", function(event) {
    const taskItem = event.target.closest(".task-item");
    if (!taskItem) {
        return;
    }
    const id = taskItem.dataset.id;
    const action = event.target.dataset.action;
    if (action === "edit") {
        editTask(id);
    }

    if (action === "delete") {
        deleteTask(id);
    }

});


taskList.addEventListener("change", function(event) {

    if (!event.target.classList.contains("complete-checkbox")) {
        return;
    }
    const taskItem = event.target.closest(".task-item");
    const id = taskItem.dataset.id;
    toggleTask(id);

});


filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;
        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();

    });

});


searchInput.addEventListener("input", function() {
    currentSearch = searchInput.value.trim();
    renderTasks();
});


function updateTaskCount() {
    const total = tasks.length;
    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;
    const active = total - completed;
    taskCount.textContent =
        `Total: ${total} | Aktif: ${active} | Selesai: ${completed}`;

}


renderTasks();


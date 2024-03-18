let tasks = [
  {
    id: 1,
    title: " Javascript Documentation",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla magni praesentium, voluptates quae fugiat omnis sed pariatur eos voluptate voluptas quaerat exercitationem velit? Maxime laborum, itaque dolorum magni numquam harum.",
    status: "incomplete",
  },
  {
    id: 2,
    title: " Javascript Documentation 2",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla magni praesentium, voluptates quae fugiat omnis sed pariatur eos voluptate voluptas quaerat exercitationem velit? Maxime laborum, itaque dolorum magni numquam harum.",
    status: "complete",
  },
];

function openModal() {
  document.querySelector("main").style.display = "none";
  document.querySelector(".modal").style.display = "block";
}

function closeModal() {
  document.querySelector("main").style.display = "block";
  document.querySelector(".modal").style.display = "none";

  document.querySelector(".task-id").value = "";
  document.querySelector(".task-title").value = "";
  document.querySelector(".task-description").value = "";
  document.querySelector(".task-status").value = "";

  document.querySelector(".create-or-edit-task-btn").innerText = "Create Task";
}

function createOrEditTask() {
  const action = document.querySelector(".create-or-edit-task-btn").innerText;

  if (action === "Edit Task") {
    editTask();
  } else {
    const title = document.querySelector(".task-title").value;
    const description = document.querySelector(".task-description").value;
    const id = tasks[tasks.length - 1].id + 1;
    tasks.push({ id, title, description, status: "incomplete" });
  }

  closeModal();
  renderUI();
}

function onEdit(id) {
  openModal();
  document.querySelector(".create-or-edit-task-btn").innerText = "Edit Task";
  const task = tasks.find((item) => item.id == id);

  document.querySelector(".task-id").value = task.id;
  document.querySelector(".task-title").value = task.title;
  document.querySelector(".task-description").value = task.description;
  document.querySelector(".task-status").value = task.status;
}

function editTask() {
  const id = parseInt(document.querySelector(".task-id").value);
  const title = document.querySelector(".task-title").value;
  const description = document.querySelector(".task-description").value;
  const status = document.querySelector(".task-status").value;

  const index = tasks.findIndex((task) => task.id == id);
  tasks[index] = { id, title, description, status };

  closeModal();
  renderUI();
}

function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter((task) => task.id != id);
    renderUI();
  }
}

function changeStatus(id, currentStatus) {
  console.log(id, currentStatus);
  const index = tasks.findIndex((task) => task.id == id);
  if (currentStatus === "incomplete") {
    tasks[index] = { ...tasks[index], status: "complete" };
  } else {
    tasks[index] = { ...tasks[index], status: "incomplete" };
  }
  renderUI();
}

let selectedTasks = [];

function handleCheckboxChange(event, taskId) {
  if (event.target.checked) {
    selectedTasks.push(taskId);
  } else {
    const index = selectedTasks.indexOf(taskId);
    if (index !== -1) {
      selectedTasks.splice(index, 1);
    }
  }
  renderUI();
}

function changeSelectedTasksStatus(status) {
  selectedTasks.forEach((taskId) => {
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1) {
      tasks[taskIndex].status = status;
    }
  });

  selectedTasks = [];
  renderUI();
}

function deleteSelectedTasks() {
  if (confirm("Are you sure you want to delete this all selected tasks?")) {
    selectedTasks.forEach((taskId) => {
      tasks = tasks.filter((task) => task.id != taskId);
    });
  }

  selectedTasks = [];
  renderUI();
}

function selectAllTasks() {
  tasks.forEach((task) => {
    if (!selectedTasks.includes(task.id)) {
      selectedTasks.push(task.id);
    }
  });

  renderUI();
}

// perform bulk actions
const bulkActionsSelect = document.getElementById("bulk-actions");
bulkActionsSelect.addEventListener("change", function (event) {
  const selectedOption = event.target.value;

  switch (selectedOption) {
    case "mark-tasks-as-complete":
      changeSelectedTasksStatus("complete");
      break;
    case "mark-tasks-as-incomplete":
      changeSelectedTasksStatus("incomplete");
      break;
    case "delete-selected-tasks":
      deleteSelectedTasks();
      break;
    default:
      break;
  }

  this.selectedIndex = 0;

  renderUI();
});

function getCompletedTasksCount(tasks) {
  const completedTasksCount = tasks.reduce((count, task) => {
    if (task.status === "complete") {
      return count + 1;
    } else {
      return count;
    }
  }, 0);

  return completedTasksCount;
}

function searchTasks(searchQuery) {
  const query = searchQuery.toLowerCase();

  const searchResult = tasks.filter(task => task.title.toLowerCase().includes(query));

  return searchResult;
}

const searchInput = document.querySelector('input[name="search"]');

searchInput.addEventListener('input', function(event) {
  const searchQuery = event.target.value;
  const searchResult = searchTasks(searchQuery);
  // tasks= searchResult;
  
});


function renderUI() {
  document.getElementById("total-tasks").innerText = tasks.length;
  document.getElementById("completed-tasks").innerText = getCompletedTasksCount(tasks);
  console.log(selectedTasks.length);
  if (tasks.length > 1) {
    document.getElementById("delete-all-btn").style.display = "block";
  } else {
    document.getElementById("delete-all-btn").style.display = "none";
  }
  if (selectedTasks.length < 2) {
    bulkActionsSelect.style.display = "none";
  } else {
    bulkActionsSelect.style.display = "block";
  }
  showTasks();
}

function showTasks() {
  let tableElement = document.querySelector(".task-list");
  let elements = "";

  tasks
    .slice()
    .reverse()
    .map(
      (task) =>
        (elements += `
        <div class="task-item">
        
        <div class="title">
          <input onchange="handleCheckboxChange(event, ${task.id})"
          ${selectedTasks.includes(task.id) ? "checked" : ""}
          type="checkbox" name="check-box" id="" />
          <span>${task.title}</span>
        </div>
        <div class="description">
          ${task.description}
        </div>
        <div class="status">
          <span class=" ${
            task.status === "complete" ? "bg-success" : "bg-light"
          }" >${task.status}</span>
        </div>
        <div class="action">
        ${
          task.status === "incomplete"
            ? `<svg onclick="changeStatus(${task.id},'${task.status}');renderUI()" height="20"
        width="20" fill="#4834d4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>`
            : `<svg onclick="changeStatus(${task.id}, '${task.status}');renderUI()" height="20"
        width="20" fill="#4834d4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>`
        }
        
          <svg
            onclick="onEdit(${task.id})"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="20"
            fill="#4834d4"
            viewBox="0 0 512 512"
          >
            <path
              d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"
            />
          </svg>
          <svg
          onclick="deleteTask(${task.id})"
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          width="20"
          fill="#ea2027"
          viewBox="0 0 448 512"
        >
          <path
            d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
          />
        </svg>
        </div>
        
      </div>
      `)
    );
  tableElement.innerHTML = elements;
}

renderUI();

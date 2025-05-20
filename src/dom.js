import ProjectManager from "./projectManager.js";
import Todo from "./todo.js";
import { Storage } from "./storage.js";

const projectsContainer = document.querySelector(".project-list");
const todosContainer = document.querySelector(".todo-modal");
const selectedProjectDomTitle = document.querySelector(".todo-modal-title");

const formProject = document.querySelector(".form-project");
const formTodo = document.querySelector(".form-todo");

const todoDialog = document.querySelector(".dialog-todo");
const newTodoBtn = document.querySelector(".todo-btn");
const closeTodoDialogBtn = document.getElementById("close-todo-dialog-btn");

let currentlyEditingTodo = null;

newTodoBtn.addEventListener("click", () => {
  formTodo.reset();
  currentlyEditingTodo = null;
  todoDialog.showModal();
});

closeTodoDialogBtn.addEventListener("click", () => {
  todoDialog.close();
  currentlyEditingTodo = null;
});

const projectManager = new ProjectManager();

formTodo.addEventListener("submit", (e) => {
  e.preventDefault();
  const activeProject = projectManager.getActiveProject();

  if (currentlyEditingTodo) {
    currentlyEditingTodo.title = formTodo.title.value;
    currentlyEditingTodo.description = formTodo.description.value;
    currentlyEditingTodo.dueDate = formTodo.dueDate.value;
    currentlyEditingTodo.priority = formTodo.priority.value;
    currentlyEditingTodo.notes = formTodo.notes.value;
  } else {
    const todo = new Todo(
      formTodo.title.value,
      formTodo.description.value,
      formTodo.dueDate.value,
      formTodo.priority.value,
      formTodo.notes.value
    );
    activeProject.addTodo(todo);
  }

  Storage.saveProjects(projectManager.projects);
  renderTodos();
  todoDialog.close();
  formTodo.reset();
  currentlyEditingTodo = null;
});

// יצירת פרויקט חדש
formProject.addEventListener("submit", (e) => {
  e.preventDefault();

  const projectName = formProject
    .querySelector("input")
    .value.toLowerCase()
    .trim();
  if (!projectName) return;

  projectManager.addProject(projectName);
  formProject.querySelector("input").value = null;
  renderProjects();
});

// מחיקת פרויקט
const deleteProjectBtn = document.querySelector(".delete-project");
deleteProjectBtn.addEventListener("click", () => {
  const activeProject = projectManager.getActiveProject();
  if (!activeProject) {
    alert("No active project to delete");
    return;
  }

  projectManager.deleteProject(activeProject.id);
  renderProjects();
  renderTodos();
});

// רנדר פרויקטים
function renderProjects() {
  clearElement(projectsContainer);

  projectManager.projects.forEach((project) => {
    const projectElement = document.createElement("li");
    projectElement.classList.add("project");
    projectElement.textContent = project.name;

    if (projectManager.activeProjectId === project.id) {
      projectElement.classList.add("active");
    }

    projectElement.addEventListener("click", () => {
      projectManager.setActiveProject(project);
      renderProjects();
      renderTodos();
    });

    projectsContainer.appendChild(projectElement);
  });

  renderTodos();
}

function renderTodos() {
  const selectedProject = projectManager.getActiveProject();

  if (!selectedProject) {
    todosContainer.style.display = "none";
    return;
  }

  todosContainer.style.display = "block";
  selectedProjectDomTitle.innerText = selectedProject.name;

  const tasksContainer = todosContainer.querySelector(".tasks");
  clearElement(tasksContainer);

  selectedProject.todos.forEach((todo) => {
    const card = createTodoCard(todo);
    tasksContainer.appendChild(card);
  });
}

function createTodoCard(todo) {
  const card = document.createElement("div");
  card.classList.add("todo-card");

  // === Checkbox + Title ===
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.classList.add("todo-checkbox");

  const label = document.createElement("span");
  label.textContent = todo.title;
  if (todo.completed) {
    label.style.textDecoration = "line-through";
    label.style.opacity = "0.6";
  }

  checkbox.addEventListener("change", () => {
    todo.toggleCompleted();
    Storage.saveProjects(projectManager.projects);
    label.style.textDecoration = todo.completed ? "line-through" : "none";
    label.style.opacity = todo.completed ? "0.6" : "1";
  });

  card.append(checkbox, label);

  // === Dialog for details ===
  const dialog = document.createElement("dialog");
  dialog.classList.add("todo-dialog");

  const title = document.createElement("h3");
  title.textContent = todo.title;

  const createDetail = (label, value) => {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    const text = document.createTextNode(value || "—");
    p.append(strong, text);
    return p;
  };

  const description = createDetail("Description", todo.description);
  const dueDate = createDetail("Due Date", todo.dueDate);
  const priority = createDetail("Priority", todo.priority);
  const notes = createDetail("Notes", todo.notes);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.addEventListener("click", () => dialog.close());

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️ Delete Todo";
  deleteBtn.addEventListener("click", () => {
    const activeProject = projectManager.getActiveProject();
    activeProject.removeTodo(todo);
    Storage.saveProjects(projectManager.projects);
    renderTodos();
    dialog.close();
  });

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️ Edit Todo";
  editBtn.addEventListener("click", () => {
    currentlyEditingTodo = todo;

    formTodo.title.value = todo.title;
    formTodo.description.value = todo.description;
    formTodo.dueDate.value = todo.dueDate;
    formTodo.priority.value = todo.priority;
    formTodo.notes.value = todo.notes;

    dialog.close();
    todoDialog.showModal();
  });

  dialog.append(
    title,
    description,
    dueDate,
    priority,
    notes,
    editBtn,
    deleteBtn,
    closeBtn
  );

  card.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() !== "input") {
      dialog.showModal();
    }
  });

  const wrapper = document.createElement("div");
  wrapper.append(card, dialog);
  return wrapper;
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

renderProjects();

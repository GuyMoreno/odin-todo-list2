// dom.js

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

newTodoBtn.addEventListener("click", () => {
  todoDialog.showModal();
});

const closeTodoDialogBtn = document.getElementById("close-todo-dialog-btn");

closeTodoDialogBtn.addEventListener("click", () => {
  todoDialog.close();
});

const projectManager = new ProjectManager();

formTodo.addEventListener("submit", (e) => {
  e.preventDefault();

  const todo = new Todo(
    formTodo.title.value,
    formTodo.description.value,
    formTodo.dueDate.value,
    formTodo.priority.value,
    formTodo.notes.value
  );

  const activeProject = projectManager.getActiveProject();
  activeProject.addTodo(todo);

  Storage.saveProjects(projectManager.projects);
  renderTodos();
  todoDialog.close();

  // TEST if the todo is added to the active project
  console.log("Active Project:", activeProject);
  console.log("New Todo:", todo);
  formTodo.reset();
  todoDialog.close();
});

// event listener for the project's form

formProject.addEventListener("submit", (e) => {
  e.preventDefault();

  // get the value of the input

  const projectName = formProject
    .querySelector("input")
    .value.toLowerCase()
    .trim();
  if (projectName == null || projectName == "") {
    return;
  }

  projectManager.addProject(projectName);
  formProject.querySelector("input").value = null; // clear the input field

  renderProjects(); // rerender the list
  console.log(
    "✅ A project object is successfully logged:",
    projectManager.projects
  );
});

function renderTodos() {
  const selectedProject = projectManager.getActiveProject();

  if (!selectedProject) {
    todosContainer.style.display = "none";
    return;
  }

  todosContainer.style.display = "block";
  selectedProjectDomTitle.innerText = selectedProject.name;

  // ננקה רק את חלק ה-tasks בתוך todosContainer
  const tasksContainer = todosContainer.querySelector(".tasks");
  clearElement(tasksContainer);

  selectedProject.todos.forEach((todo) => {
    const card = createTodoCard(todo);
    tasksContainer.appendChild(card);
  });
}

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

      // TEST if the project is active
      console.log("Project's name:", projectManager.getActiveProject().name);
      console.log("Project's id: ", projectManager.getActiveProject().id);
    });

    projectsContainer.appendChild(projectElement);
  });
  renderTodos();
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

const deleteProjectBtn = document.querySelector(".delete-project");

deleteProjectBtn.addEventListener("click", () => {
  const activeProject = projectManager.getActiveProject();
  if (!activeProject) {
    alert("No active project to delete");
    return;
  }

  projectManager.deleteProject(activeProject.id);
  console.log(projectManager.projects);
  renderProjects();
  renderTodos();
});

renderProjects();

function createTodoCard(todo) {
  const card = document.createElement("div");
  card.classList.add("todo-card");
  card.textContent = todo.title;

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
  closeBtn.classList.add("close-dialog-btn");

  dialog.append(title, description, dueDate, priority, notes, closeBtn);

  card.addEventListener("click", () => dialog.showModal());
  closeBtn.addEventListener("click", () => dialog.close());

  const wrapper = document.createElement("div");
  wrapper.append(card, dialog);
  return wrapper;
}

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

const projectManager = new ProjectManager();

formTodo.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(detailsForm);
  const description = formData.get("description");
  const dueDate = formData.get("dueDate");
  const priority = formData.get("priority");
  const notes = formData.get("notes");

  const todo = new Todo(
    currentTodoTitle,
    description,
    dueDate,
    priority,
    notes
  );
  const activeProject = projectManager.getActiveProject();
  activeProject.addTodo(todo);

  Storage.saveProjects(projectManager.projects);
  renderTodos();
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

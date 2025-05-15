// This module handles the DOM manipulation for the project and todo lists.

import ProjectManager from "./projectManager.js";

const projectsContainer = document.querySelector(".project-list");

const formProject = document.querySelector(".form-project");
const formTodo = document.querySelector(".form-todo");

const projectManager = new ProjectManager();

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

  render(); // rerender the list
  console.log(
    "✅ A project object is successfully logged:",
    projectManager.projects
  );
});

function render() {
  // Clear the list before rendering
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
      render();

      // TEST if the project is active
      console.log("Project's name:", projectManager.getActiveProject().name);
      console.log("Project's id: ", projectManager.getActiveProject().id);
    });

    projectsContainer.appendChild(projectElement);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();

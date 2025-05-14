import Project from "./project.js";

import ProjectManager from "./projectManager.js";

const projectsContainer = document.querySelector(".project-list");

const formProject = document.querySelector(".form-project");
const formTodo = document.querySelector(".form-todo");

const projectManager = new ProjectManager();

// Project list in array...
// let projects = [Inbox, Work, Personal];
// let projects = [
//   //   {
//   //     name: "Inbox",
//   //     todos: ["Buy milk", "Do homework"],
//   //   },
//   //   {
//   //     name: "Work",
//   //     todos: ["Finish report", "Call client"],
//   //   },
// ];

formProject.addEventListener("submit", (e) => {
  e.preventDefault();

  // get the value of the input

  const projectName = formProject.querySelector("input").value;
  if (projectName == null || projectName == "") {
    return;
  }
  const project = projectManager.addProject(projectName);
  formProject.querySelector("input").value = null; // clear the input field

  render(); // rerender the list
  console.log(projectManager.projects);
});

// flag to check if a project is active
// let activeProject = null;

function render() {
  // Clear the list before rendering

  clearElement(projectsContainer);

  projectManager.projects.forEach((project) => {
    const projectElement = document.createElement("li");
    projectElement.classList.add("project");
    projectElement.textContent = project.name;

    if (projectManager.getActiveProject() === project) {
      projectElement.classList.add("active");
    }

    projectElement.addEventListener("click", () => {
      projectManager.setActiveProject(project);
      render();

      // TEST if the project is active
      console.log(projectManager.getActiveProject().name);
    });

    projectsContainer.appendChild(projectElement);
  });
}

//  <li class="project">Work</li>

// clear list every time we render

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();

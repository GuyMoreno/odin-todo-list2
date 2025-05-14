import Project from "./project";

export default class ProjectManager {
  constructor() {
    this._projects = [];
    this.activeProject = null;
  }

  addProject(name) {
    const project = new Project(name);
    this._projects.push(project);
    return project;
  }

  get projects() {
    return [...this._projects];
  }

  setActiveProject(project) {
    this.activeProject = project;
  }

  getActiveProject() {
    return this.activeProject;
  }
}

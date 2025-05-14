import Project from "./project";

export default class ProjectManager {
  constructor() {
    this._projects = [];
    this.activeProjectId = null;
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
    this.activeProjectId = project.id;
  }

  getActiveProject() {
    return this._projects.find((p) => p.id === this.activeProjectId) || null;
  }
}

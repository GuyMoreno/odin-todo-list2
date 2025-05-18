// ProjectManager.js

import Project from "./project";
import { Storage } from "./storage";

const ACTIVE_PROJECT_KEY = "activeProjectId";

export default class ProjectManager {
  constructor() {
    this._projects = Storage.loadProjects();
    this.activeProjectId = localStorage.getItem(ACTIVE_PROJECT_KEY) || null;
  }

  addProject(name) {
    const exists = this._projects.some((project) => project.name === name);
    if (exists) {
      alert("🔔 A project with that name already exists");
      return null;
    }

    const project = new Project(name);
    this._projects.push(project);
    Storage.saveProjects(this._projects);
    return project;
  }

  get projects() {
    return [...this._projects];
  }

  setActiveProject(project) {
    this.activeProjectId = project.id;
    localStorage.setItem(ACTIVE_PROJECT_KEY, this.activeProjectId);
    Storage.saveProjects(this._projects);
  }

  getActiveProject() {
    return this._projects.find((p) => p.id === this.activeProjectId) || null;
  }

  deleteProject(projectId) {
    this._projects = this._projects.filter((p) => p.id !== projectId);

    if (this.activeProjectId === projectId) {
      this.activeProjectId = null;
      localStorage.removeItem(ACTIVE_PROJECT_KEY);
    }
    Storage.saveProjects(this._projects);
  }
}

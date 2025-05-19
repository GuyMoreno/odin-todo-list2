import Project from "./project";
import { Storage } from "./storage";

const ACTIVE_PROJECT_KEY = "activeProjectId";
const DEFAULT_PROJECT_NAME = "inbox";

export default class ProjectManager {
  constructor() {
    this._projects = Storage.loadProjects() || [];

    if (this._projects.length === 0) {
      const inbox = new Project(DEFAULT_PROJECT_NAME);
      this._projects.push(inbox);
      Storage.saveProjects(this._projects);
    }

    this.activeProjectId = localStorage.getItem(ACTIVE_PROJECT_KEY);

    if (
      !this.activeProjectId ||
      !this._projects.some((p) => p.id === this.activeProjectId)
    ) {
      const inboxProject = this._projects.find(
        (p) => p.name === DEFAULT_PROJECT_NAME
      );
      this.activeProjectId = inboxProject.id;
      localStorage.setItem(ACTIVE_PROJECT_KEY, this.activeProjectId);
    }
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
    const projectToDelete = this._projects.find((p) => p.id === projectId);
    if (projectToDelete?.name === DEFAULT_PROJECT_NAME) {
      alert("❌ Can't delete the default 'inbox' project.");
      return;
    }

    this._projects = this._projects.filter((p) => p.id !== projectId);

    if (this.activeProjectId === projectId) {
      const inboxProject = this._projects.find(
        (p) => p.name === DEFAULT_PROJECT_NAME
      );
      this.activeProjectId = inboxProject ? inboxProject.id : null;
      if (this.activeProjectId) {
        localStorage.setItem(ACTIVE_PROJECT_KEY, this.activeProjectId);
      } else {
        localStorage.removeItem(ACTIVE_PROJECT_KEY);
      }
    }

    Storage.saveProjects(this._projects);
  }
}

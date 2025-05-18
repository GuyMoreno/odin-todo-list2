// storage.js
import Project from "./project.js";
import Todo from "./todo.js";

const STORAGE_KEY = "todoProjects";

export const Storage = {
  saveProjects(projects) {
    const json = JSON.stringify(projects);
    localStorage.setItem(STORAGE_KEY, json);
  },

  loadProjects() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const rawProjects = JSON.parse(data);

    return rawProjects.map((p) => {
      const project = new Project(p.name);
      project.id = p.id;

      // 
      project.todos = (p.todos || []).map(
        (t) =>
          new Todo(
            t.title,
            t.description,
            t.dueDate,
            t.priority,
            t.notes,
            t.completed
          )
      );

      return project;
    });
  },
};

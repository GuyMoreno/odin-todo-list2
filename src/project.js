// Project.js

import { generateId } from "./index.js";

class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
    this.id = generateId(); // Generate a unique ID for the project
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(todoToRemove) {
    this.todos = this.todos.filter((t) => t !== todoToRemove);
  }

  getTodos() {
    return this.todos;
  }
}

export default Project;

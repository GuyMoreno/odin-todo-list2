// greeting.js
// export const greeting = "Hello, Odinite!";
// Todo

class Todo {
  constructor(title, description, dueDate, priority, notes, completed = false) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.completed = completed;
  }
  toggleCompleted() {
    this.completed = !this.completed; // Toggle the completed status
  }
}

export default Todo;

// index.js
import "./styles.css";
import "./dom.js";
// import { greeting } from "./todo.js";

// console.log(greeting);

export function generateId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
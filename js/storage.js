// storage.js — Handles reading and writing data to localStorage.

var STORAGE_KEY = "taskflow_tasks";
var THEME_KEY = "taskflow_theme";

/**
 * Returns all saved tasks from localStorage.
 * Returns an empty array if nothing is stored or data is invalid.
 */
function getTasks() {
  try {
    var data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn("Could not read tasks from localStorage:", e);
    return [];
  }
}

/**
 * Saves the entire task array to localStorage.
 */
function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn("Could not save tasks to localStorage:", e);
  }
}

/**
 * Returns the saved theme preference ('light' or 'dark').
 * Defaults to 'light' if nothing is stored.
 */
function getTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

/**
 * Saves the current theme preference to localStorage.
 */
function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

// app.js — Main entry point. Sets up event listeners and ties everything together.

var tasks = [];
var currentFilter = "all";
var currentSearch = "";

// Run when the page loads
document.addEventListener("DOMContentLoaded", function () {
	loadApp();
	setupEventListeners();
});

/**
 * Loads saved data and renders the initial view.
 */
function loadApp() {
	// Load and apply saved theme
	var savedTheme = getTheme();
	applyTheme(savedTheme);

	// Load tasks from storage
	tasks = getTasks();
	refreshView();
}

/**
 * Hooks up all event listeners in one place.
 */
function setupEventListeners() {
	// Add task form
	document.getElementById("taskForm").addEventListener("submit", handleAddTask);

	// Search input
	document.getElementById("searchInput").addEventListener("input", function (e) {
		currentSearch = e.target.value;
		refreshView();
	});

	// Filter buttons
	document.getElementById("filterGroup").addEventListener("click", function (e) {
		if (!e.target.classList.contains("filter-btn")) return;

		// Update active button
		var buttons = document.querySelectorAll(".filter-btn");
		buttons.forEach(function (btn) { btn.classList.remove("active"); });
		e.target.classList.add("active");

		currentFilter = e.target.dataset.filter;
		refreshView();
	});

	// Task list — delegated click handler for checkbox, edit, delete
	document.getElementById("taskList").addEventListener("click", function (e) {
		var card = e.target.closest(".task-card");
		if (!card) return;

		var taskId = card.dataset.id;

		if (e.target.classList.contains("task-checkbox")) {
			handleToggleComplete(taskId);
		} else if (e.target.closest("[data-action='edit']")) {
			handleEditOpen(taskId);
		} else if (e.target.closest("[data-action='delete']")) {
			handleDeleteTask(taskId);
		}
	});

	// Theme toggle
	document.getElementById("themeToggle").addEventListener("click", handleThemeToggle);

	// Edit modal — save
	document.getElementById("editForm").addEventListener("submit", handleEditSave);

	// Edit modal — cancel
	document.getElementById("cancelEdit").addEventListener("click", closeEditModal);

	// Close modal when clicking the overlay background
	document.getElementById("editModal").addEventListener("click", function (e) {
		if (e.target === this) {
			closeEditModal();
		}
	});
}


/* ----------------------------
	 Event Handlers
	 ---------------------------- */

/**
 * Handles adding a new task from the form.
 */
function handleAddTask(e) {
	e.preventDefault();

	var input = document.getElementById("taskInput");
	var text = input.value.trim();

	if (text === "") return;

	var newTask = {
		id: generateId(),
		text: text,
		date: document.getElementById("taskDate").value || "",
		priority: document.getElementById("taskPriority").value,
		completed: false,
		createdAt: Date.now()
	};

	tasks.unshift(newTask);
	saveAndRefresh();

	// Reset form
	input.value = "";
	document.getElementById("taskDate").value = "";
	document.getElementById("taskPriority").value = "medium";
	input.focus();
}

/**
 * Toggles a task between completed and incomplete.
 */
function handleToggleComplete(id) {
	var task = findTaskById(id);
	if (!task) return;

	task.completed = !task.completed;
	saveAndRefresh();
}

/**
 * Deletes a task after a brief confirmation.
 */
function handleDeleteTask(id) {
	tasks = tasks.filter(function (task) {
		return task.id !== id;
	});
	saveAndRefresh();
}

/**
 * Opens the edit modal with the selected task's data.
 */
function handleEditOpen(id) {
	var task = findTaskById(id);
	if (!task) return;
	openEditModal(task);
}

/**
 * Saves changes from the edit modal.
 */
function handleEditSave(e) {
	e.preventDefault();

	var id = document.getElementById("editId").value;
	var task = findTaskById(id);
	if (!task) return;

	var newText = document.getElementById("editText").value.trim();
	if (newText === "") return;

	task.text = newText;
	task.date = document.getElementById("editDate").value || "";
	task.priority = document.getElementById("editPriority").value;

	closeEditModal();
	saveAndRefresh();
}

/**
 * Toggles between light and dark themes.
 */
function handleThemeToggle() {
	var current = getTheme();
	var next = current === "light" ? "dark" : "light";
	saveTheme(next);
	applyTheme(next);
}


/* ----------------------------
	 Helpers
	 ---------------------------- */

/**
 * Finds a task in the array by its ID.
 */
function findTaskById(id) {
	return tasks.find(function (task) {
		return task.id === id;
	});
}

/**
 * Saves tasks to storage and re-renders the view.
 */
function saveAndRefresh() {
	saveTasks(tasks);
	refreshView();
}

/**
 * Filters tasks and updates the DOM.
 */
function refreshView() {
	var visible = filterTasks(tasks, currentFilter, currentSearch);

	renderTasks(visible);
	updateTaskCount(tasks);

	// Update empty state message based on context
	if (visible.length === 0) {
		if (currentSearch) {
			setEmptyMessage("No tasks match your search.");
		} else if (currentFilter === "completed") {
			setEmptyMessage("No completed tasks yet.");
		} else if (currentFilter === "active") {
			setEmptyMessage("All done! Nothing pending.");
		} else {
			setEmptyMessage("No tasks yet. Add one above!");
		}
	}
}
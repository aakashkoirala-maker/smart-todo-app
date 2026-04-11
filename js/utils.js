// utils.js — Pure helper functions with no side effects.

/**
 * Generates a simple unique ID using timestamp + random number.
 * Good enough for a local to-do app.
 */
function generateId() {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Formats a date string (YYYY-MM-DD) into a readable format.
 * Returns empty string if no date is provided.
 */
function formatDate(dateString) {
	if (!dateString) return "";

	var parts = dateString.split("-");
	var year = parseInt(parts[0]);
	var month = parseInt(parts[1]) - 1;
	var day = parseInt(parts[2]);
	var date = new Date(year, month, day);

	var monthNames = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];

	return monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}

/**
 * Checks if a date string is before today.
 */
function isOverdue(dateString) {
	if (!dateString) return false;

	var parts = dateString.split("-");
	var dueDate = new Date(
		parseInt(parts[0]),
		parseInt(parts[1]) - 1,
		parseInt(parts[2])
	);

	var today = new Date();
	today.setHours(0, 0, 0, 0);

	return dueDate < today;
}

/**
 * Filters tasks based on the active filter and search query.
 * Returns a new array — does not modify the original.
 */
function filterTasks(tasks, filter, searchQuery) {
	var result = tasks;

	// Apply status filter
	if (filter === "completed") {
		result = result.filter(function (task) {
			return task.completed;
		});
	} else if (filter === "active") {
		result = result.filter(function (task) {
			return !task.completed;
		});
	}

	// Apply search filter
	if (searchQuery && searchQuery.trim() !== "") {
		var query = searchQuery.toLowerCase().trim();
		result = result.filter(function (task) {
			return task.text.toLowerCase().includes(query);
		});
	}

	return result;
}

// ui.js — All DOM rendering and visual updates live here.

/**
 * Renders the task list into the DOM.
 * Clears the current list and rebuilds it from the provided array.
 */
function renderTasks(tasks) {
	var listEl = document.getElementById("taskList");
	var emptyEl = document.getElementById("emptyState");

	listEl.innerHTML = "";

	if (tasks.length === 0) {
		emptyEl.classList.add("visible");
		return;
	}

	emptyEl.classList.remove("visible");

	tasks.forEach(function (task) {
		var card = createTaskCard(task);
		listEl.appendChild(card);
	});
}

/**
 * Creates a single task card element.
 */
function createTaskCard(task) {
	var li = document.createElement("li");
	li.className = "task-card" + (task.completed ? " completed" : "");
	li.dataset.id = task.id;

	// Checkbox
	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.className = "task-checkbox";
	checkbox.checked = task.completed;
	checkbox.setAttribute("aria-label", "Mark task as " + (task.completed ? "incomplete" : "complete"));

	// Task body
	var body = document.createElement("div");
	body.className = "task-body";

	var text = document.createElement("p");
	text.className = "task-text";
	text.textContent = task.text;
	body.appendChild(text);

	// Meta info (date + priority)
	var meta = document.createElement("div");
	meta.className = "task-meta";

	if (task.date) {
		var dateSpan = document.createElement("span");
		dateSpan.className = "task-date";
		dateSpan.textContent = formatDate(task.date);

		if (!task.completed && isOverdue(task.date)) {
			dateSpan.classList.add("overdue");
			dateSpan.textContent += " (overdue)";
		}

		meta.appendChild(dateSpan);
	}

	var prioritySpan = document.createElement("span");
	prioritySpan.className = "task-priority " + task.priority;
	prioritySpan.textContent = task.priority;
	meta.appendChild(prioritySpan);

	body.appendChild(meta);

	// Action buttons
	var actions = document.createElement("div");
	actions.className = "task-actions";

	var editBtn = document.createElement("button");
	editBtn.className = "action-btn edit";
	editBtn.innerHTML = "✏️";
	editBtn.setAttribute("aria-label", "Edit task");
	editBtn.dataset.action = "edit";

	var deleteBtn = document.createElement("button");
	deleteBtn.className = "action-btn delete";
	deleteBtn.innerHTML = "🗑️";
	deleteBtn.setAttribute("aria-label", "Delete task");
	deleteBtn.dataset.action = "delete";

	actions.appendChild(editBtn);
	actions.appendChild(deleteBtn);

	li.appendChild(checkbox);
	li.appendChild(body);
	li.appendChild(actions);

	return li;
}

/**
 * Updates the task counter text in the header.
 */
function updateTaskCount(tasks) {
	var countEl = document.getElementById("taskCount");
	var total = tasks.length;
	var done = tasks.filter(function (t) { return t.completed; }).length;

	if (total === 0) {
		countEl.textContent = "0 tasks";
	} else {
		countEl.textContent = done + " / " + total + " done";
	}
}

/**
 * Updates the empty state message.
 */
function setEmptyMessage(message) {
	var textEl = document.querySelector(".empty-text");
	if (textEl) {
		textEl.textContent = message;
	}
}

/**
 * Opens the edit modal and fills it with the given task's data.
 */
function openEditModal(task) {
	document.getElementById("editId").value = task.id;
	document.getElementById("editText").value = task.text;
	document.getElementById("editDate").value = task.date || "";
	document.getElementById("editPriority").value = task.priority;
	document.getElementById("editModal").classList.add("open");
}

/**
 * Closes the edit modal.
 */
function closeEditModal() {
	document.getElementById("editModal").classList.remove("open");
}

/**
 * Applies the given theme ('light' or 'dark') to the page.
 */
function applyTheme(theme) {
	if (theme === "dark") {
		document.documentElement.setAttribute("data-theme", "dark");
		document.getElementById("themeIcon").textContent = "☀️";
	} else {
		document.documentElement.removeAttribute("data-theme");
		document.getElementById("themeIcon").textContent = "🌙";
	}
}

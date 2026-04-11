

var taskForm = document.getElementById("taskForm");
var taskInput = document.getElementById("taskInput");
var taskList = document.getElementById("taskList");
var searchInput = document.getElementById("searchInput");
var filterGroup = document.getElementById("filterGroup");

var tasks = [];
var currentFilter = "all";
var currentSearch = "";

taskForm.addEventListener("submit", function (event) {
	event.preventDefault();

	var text = taskInput.value.trim();
	if (!text) return;

	var task = {
		id: Date.now(),
		text: text,
		completed: false
	};

	tasks.push(task);
	console.log(task);
	renderTasks(getFilteredTasks());
	taskForm.reset();
});

searchInput.addEventListener("input", function (event) {
	currentSearch = event.target.value;
	renderTasks(getFilteredTasks());
});

filterGroup.addEventListener("click", function (event) {
	if (!event.target.classList.contains("filter-btn")) return;
	var buttons = filterGroup.querySelectorAll(".filter-btn");
	buttons.forEach(function (btn) { btn.classList.remove("active"); });
	event.target.classList.add("active");
	currentFilter = event.target.dataset.filter;
	renderTasks(getFilteredTasks());
});

function getFilteredTasks() {
	return tasks.filter(function (task) {
		var matchesFilter =
			currentFilter === "all" ||
			(currentFilter === "active" && !task.completed) ||
			(currentFilter === "completed" && task.completed);
		var matchesSearch =
			task.text.toLowerCase().includes(currentSearch.toLowerCase());
		return matchesFilter && matchesSearch;
	});
}

function renderTasks(list) {
	taskList.innerHTML = "";
	(list || tasks).forEach(function (task) {
		var li = document.createElement("li");
		li.className = "task-item";
		if (task.completed) {
			li.classList.add("completed");
		}

		var left = document.createElement("div");
		left.className = "task-item-left";

		var checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.className = "task-checkbox";
		checkbox.checked = !!task.completed;
		checkbox.addEventListener("change", function () {
			task.completed = !task.completed;
			renderTasks(getFilteredTasks());
		});

		var text = document.createElement("span");
		text.textContent = task.text;

		var deleteBtn = document.createElement("button");
		deleteBtn.type = "button";
		deleteBtn.className = "delete-btn";
		deleteBtn.textContent = "Delete";
		deleteBtn.addEventListener("click", function () {
			tasks = tasks.filter(function (t) {
				return t !== task;
			});
			renderTasks(getFilteredTasks());
		});

		left.appendChild(checkbox);
		left.appendChild(text);
		li.appendChild(left);
		li.appendChild(deleteBtn);
		taskList.appendChild(li);
	});
}
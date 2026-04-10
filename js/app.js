var taskForm = document.getElementById("taskForm");
var taskInput = document.getElementById("taskInput");
var taskList = document.getElementById("taskList");

var tasks = [];

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
	renderTasks();
	taskForm.reset();
});

function renderTasks() {
	taskList.innerHTML = "";

	tasks.forEach(function (task) {
		var li = document.createElement("li");
		li.className = "task-item";

		var left = document.createElement("div");
		left.className = "task-item-left";

		var checkbox = document.createElement("input");
		checkbox.type = "checkbox";

		var text = document.createElement("span");
		text.textContent = task.text;

		var deleteBtn = document.createElement("button");
		deleteBtn.type = "button";
		deleteBtn.className = "delete-btn";
		deleteBtn.textContent = "Delete";

		left.appendChild(checkbox);
		left.appendChild(text);
		li.appendChild(left);
		li.appendChild(deleteBtn);
		taskList.appendChild(li);
	});
}
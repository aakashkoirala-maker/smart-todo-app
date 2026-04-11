var STORAGE_KEY = "taskflow_tasks";

function getTasks() {
	try {
		var data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	} catch (e) {
		console.warn("Could not read tasks from localStorage:", e);
		return [];
	}
}

function saveTasks(tasks) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
	} catch (e) {
		console.warn("Could not save tasks to localStorage:", e);
	}
}

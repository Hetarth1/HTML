const bin = document.getElementById("bin");
const completeSound = new Audio("Tick.mp3");

function addTask(text = null) {
  const input = document.getElementById("taskInput");
  const taskText = text || input.value.trim();
  if (taskText === "") return;

  const taskList = document.getElementById("taskList");

  const taskDiv = document.createElement("div");
  taskDiv.className = "task task--animate";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";

  const taskContent = document.createElement("span");
  taskContent.textContent = taskText;

  checkbox.onchange = function () {
    if (checkbox.checked) {
      completeSound.currentTime = 0;
      completeSound.play().catch(() => {});
      taskDiv.classList.add("completed");
      setTimeout(() => {
        taskDiv.classList.add("task--remove");
        setTimeout(() => taskDiv.remove(), 400);
      }, 3000);
    }
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = function () {
    moveToBin(taskText, taskDiv);
  };

  taskDiv.appendChild(checkbox);
  taskDiv.appendChild(taskContent);
  taskDiv.appendChild(deleteBtn);
  taskList.appendChild(taskDiv);

  if (!text) input.value = "";

  setTimeout(() => taskDiv.classList.remove("task--animate"), 300);
}

function moveToBin(text, originalTask) {
  originalTask.classList.add("task--remove");
  setTimeout(() => originalTask.remove(), 300);

  const binTask = document.createElement("div");
  binTask.className = "task";

  const taskContent = document.createElement("span");
  taskContent.textContent = text;

  const restoreBtn = document.createElement("button");
  restoreBtn.textContent = "Restore";
  restoreBtn.className = "restore-btn";
  restoreBtn.onclick = function () {
    binTask.remove();
    addTask(text);
  };

  const deleteForeverBtn = document.createElement("button");
  deleteForeverBtn.textContent = "❌";
  deleteForeverBtn.className = "delete-btn";
  deleteForeverBtn.onclick = function () {
    binTask.remove();
  };

  binTask.appendChild(taskContent);
  binTask.appendChild(restoreBtn);
  binTask.appendChild(deleteForeverBtn);
  bin.appendChild(binTask);
}

document.getElementById("taskInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

document.getElementById("toggleBin").addEventListener("click", function () {
  bin.classList.toggle("hidden");
  this.textContent = bin.classList.contains("hidden") ? "🗑️ View Bin" : "❌ Hide Bin";
});
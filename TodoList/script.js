let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";
let dragIndex = null;

// 添加任务
function addTask() {
  let input = document.getElementById("taskInput");
  let text = input.value.trim();

  if (!text) return alert("请输入内容");

  tasks.push({ text, completed: false });

  saveAndRender();
  input.value = "";
}

// 删除
function deleteTask(index) {
  tasks.splice(index, 1);
  saveAndRender();
}

// 完成切换
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveAndRender();
}

// 筛选
function setFilter(type) {
  filter = type;
  render();
}

// 保存
function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}

// 渲染
function render() {
  let list = document.getElementById("taskList");
  list.innerHTML = "";

  let filtered = tasks.filter(t => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  filtered.forEach((task, index) => {
    let li = document.createElement("li");
    li.draggable = true;

    // 拖拽事件
    li.addEventListener("dragstart", () => {
      dragIndex = index;
    });

    li.addEventListener("dragover", e => {
      e.preventDefault();
    });

    li.addEventListener("drop", () => {
      let temp = tasks[dragIndex];
      tasks.splice(dragIndex, 1);
      tasks.splice(index, 0, temp);
      saveAndRender();
    });

    let span = document.createElement("span");
    span.innerText = task.text;

    if (task.completed) span.classList.add("completed");

    span.onclick = () => toggleTask(index);

    let btn = document.createElement("button");
    btn.innerText = "删除";
    btn.onclick = () => deleteTask(index);

    li.appendChild(span);
    li.appendChild(btn);

    list.appendChild(li);
  });

  updateCount();
}

// 计数
function updateCount() {
  let count = tasks.filter(t => !t.completed).length;
  document.getElementById("count").innerText = `未完成任务：${count}`;
}

// 回车添加
document.getElementById("taskInput").addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

// 初始化
render();
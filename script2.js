document.getElementById("addBtn").addEventListener("click", addTask);
window.onload = () => {
  loadTasks();
  requestNotificationPermission();
  setupAudio();
};

function setupAudio() {
  const soundSelect = document.getElementById("alarmSound");

  // Load saved sound preference
  const savedSound = localStorage.getItem("alarmSound");
  if (savedSound) soundSelect.value = savedSound;

  soundSelect.onchange = () => {
    localStorage.setItem("alarmSound", soundSelect.value);
  };

  document.getElementById("testBuzzerBtn").onclick = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    playBuzzer(true); // Test mode
  };
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskDate = document.getElementById("taskDate");
  const taskTime = document.getElementById("taskTime");
  const taskText = taskInput.value.trim();
  const dueDate = taskDate.value;
  const dueTime = taskTime.value;

  if (taskText === "" || dueDate === "" || dueTime === "") return;

  createTaskElement(taskText, dueDate, dueTime, false);
  saveTasks();

  taskInput.value = "";
  taskTime.value = "";
}

function createTaskElement(text, dueDate, dueTime, completed) {
  const taskList = document.getElementById("taskList");
  const li = document.createElement("li");

  const taskInfo = document.createElement("div");
  taskInfo.className = "task-info";

  const taskSpan = document.createElement("span");
  taskSpan.className = "task-text";
  taskSpan.textContent = text;
  if (completed) taskSpan.classList.add("completed");

  const timestamp = document.createElement("span");
  timestamp.className = "timestamp";
  const displayTime = (dueTime && dueTime !== "undefined") ? ` at ${dueTime}` : "";
  timestamp.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${dueDate}${displayTime}`;

  taskInfo.appendChild(taskSpan);
  taskInfo.appendChild(timestamp);

  const actions = document.createElement("div");
  actions.className = "actions";

  const completeBtn = document.createElement("button");
  completeBtn.className = "complete-btn";
  completeBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  completeBtn.onclick = () => {
    taskSpan.classList.toggle("completed");
    li.dataset.completed = taskSpan.classList.contains("completed");
    saveTasks();
    updateProgress();
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
  deleteBtn.onclick = () => {
    li.style.transform = "translateX(20px)";
    li.style.opacity = "0";
    setTimeout(() => {
      taskList.removeChild(li);
      saveTasks();
      updateProgress();
    }, 300);
  };

  actions.appendChild(completeBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(taskInfo);
  li.appendChild(actions);

  li.dataset.dueDate = dueDate;
  li.dataset.dueTime = dueTime || "";
  li.dataset.completed = completed;

  // Check if overdue
  const now = new Date();
  if (new Date(`${dueDate}T${dueTime || "00:00"}`) < now && !completed) {
    timestamp.classList.add("overdue");
  }

  taskList.appendChild(li);
  updateProgress();
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.querySelector(".task-text").textContent,
      dueDate: li.dataset.dueDate,
      dueTime: li.dataset.dueTime,
      completed: li.dataset.completed === "true"
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(t => {
    createTaskElement(t.text, t.dueDate, t.dueTime, t.completed);
  });
  setInterval(checkDueTasks, 10000);
}

function updateProgress() {
  const tasks = document.querySelectorAll("#taskList li");
  const total = tasks.length;
  const completed = [...tasks].filter(t => t.dataset.completed === "true").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  if (progressBar) progressBar.style.width = percent + "%";
  if (progressText) progressText.textContent = percent + "%";
}

let audioCtx = null;
let buzzerInterval = null;

function checkDueTasks() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM

  const tasks = document.querySelectorAll("#taskList li");
  tasks.forEach(task => {
    const dueDate = task.dataset.dueDate;
    const dueTime = task.dataset.dueTime;
    const completed = task.dataset.completed === "true";

    if (dueDate === today && dueTime === currentTime && !completed) {
      if (!task.dataset.alarmTriggered) {
        notifyTask(task.querySelector(".task-text").textContent);
        playBuzzer();
        task.dataset.alarmTriggered = "true";
      }
    }

    if (new Date(`${dueDate}T${dueTime}`) < now && !completed) {
      task.querySelector(".timestamp").classList.add("overdue");
    }
  });
}

function setupAudio() {
  const soundSelect = document.getElementById("alarmSound");

  // Load saved sound preference
  const savedSound = localStorage.getItem("alarmSound");
  if (savedSound) soundSelect.value = savedSound;

  soundSelect.onchange = () => {
    localStorage.setItem("alarmSound", soundSelect.value);
  };

  document.getElementById("testBuzzerBtn").onclick = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    playBuzzer(true); // Test mode
  };
}

function playBuzzer(isTest = false) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const soundType = document.getElementById("alarmSound").value;

  function startBeep(type) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    switch (type) {
      case 'digital':
        osc.type = "square";
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        break;
      case 'sonar':
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        break;
      case 'chime':
        osc.type = "triangle";
        const now = audioCtx.currentTime;
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
        break;
      case 'classic':
      default:
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    }

    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    return { osc };
  }

  if (buzzerInterval) clearInterval(buzzerInterval);

  const triggerBuzzer = () => {
    const { osc } = startBeep(soundType);
    setTimeout(() => {
      osc.stop();
    }, 150);
  };

  buzzerInterval = setInterval(triggerBuzzer, 500);

  if (isTest) {
    setTimeout(() => {
      stopBuzzer();
      alert(`Buzzer test (${soundType}) complete!`);
    }, 1500);
  } else {
    if (document.getElementById("stopAlarmBtn")) return;

    const stopBtn = document.createElement("button");
    stopBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg> STOP ALARM`;
    stopBtn.id = "stopAlarmBtn";
    // ... styling same as before ...
    stopBtn.style.position = "fixed";
    stopBtn.style.top = "40px";
    stopBtn.style.left = "50%";
    stopBtn.style.transform = "translateX(-50%)";
    stopBtn.style.zIndex = "1000";
    stopBtn.style.padding = "16px 32px";
    stopBtn.style.backgroundColor = "var(--danger)";
    stopBtn.style.color = "white";
    stopBtn.style.fontSize = "1rem";
    stopBtn.style.fontWeight = "800";
    stopBtn.style.borderRadius = "16px";
    stopBtn.style.cursor = "pointer";
    stopBtn.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4)";
    stopBtn.style.display = "flex";
    stopBtn.style.alignItems = "center";
    stopBtn.style.border = "none";

    stopBtn.onclick = () => {
      stopBuzzer();
      document.body.removeChild(stopBtn);
    };

    document.body.appendChild(stopBtn);
  }
}

function stopBuzzer() {
  if (buzzerInterval) {
    clearInterval(buzzerInterval);
    buzzerInterval = null;
  }
}

function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission();
  }
}

function notifyTask(taskText) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Focus Reminder", {
      body: `Time to: ${taskText}`,
      icon: "https://cdn-icons-png.flaticon.com/512/1827/1827349.png"
    });
  } else {
    alert(`REMINDER: ${taskText}`);
  }
}
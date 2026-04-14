// 递归与闭包任务计时器

document.addEventListener('DOMContentLoaded', function () {
  // 获取DOM元素
  const secondsInput = document.getElementById('seconds-input');
  const callbackInput = document.getElementById('callback-input');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');
  const clearLogBtn = document.getElementById('clear-log-btn');
  const startCountEl = document.getElementById('start-count');
  const timerStatusEl = document.getElementById('timer-status');
  const timerSecondsEl = document.getElementById('timer-seconds');
  const timerProgress = document.querySelector('.timer-progress');
  const logOutput = document.getElementById('log-output');
  const consoleOutput = document.getElementById('console-output');

  // 测试按钮
  const testBtn1 = document.getElementById('test-btn-1');
  const testBtn2 = document.getElementById('test-btn-2');
  const testBtn3 = document.getElementById('test-btn-3');
  const testBtn4 = document.getElementById('test-btn-4');

  // 预设按钮
  const presetBtns = document.querySelectorAll('.preset');

  // 计时器状态
  let currentTimer = null;
  let timerInterval = null;
  let remainingSeconds = 0;
  let isPaused = false;
  let timerId = null;

  // 1. 递归倒计时函数
  function countDown(seconds, callback) {
    consoleLog(`开始倒计时: ${seconds}秒`);
    addLog(`开始${seconds}秒倒计时`);

    // 递归出口：当秒数小于0时，调用回调函数
    if (seconds >= 0) {
      // 更新显示
      updateTimerDisplay(seconds);

      // 如果秒数大于0，继续递归
      if (seconds > 0) {
        // 使用setTimeout模拟异步递归，避免栈溢出
        timerId = setTimeout(function () {
          // 递归调用，秒数减1
          countDown(seconds - 1, callback);
        }, 1000);
      } else {
        // 秒数为0，递归结束，调用回调函数
        consoleLog("倒计时结束");
        addLog("倒计时结束");
        if (typeof callback === 'function') {
          callback();
        }
        timerStatusEl.textContent = "已完成";
        timerStatusEl.style.color = "#28a745";
        pauseBtn.disabled = true;
        startBtn.disabled = false;
      }
    }
  }

  // 2. 闭包创建计时器
  function createTimer() {
    // 私有变量，记录倒计时启动次数
    let startCount = 0;

    // 返回一个包含方法的对象
    return {
      // 启动倒计时方法
      start: function (seconds, callback) {
        // 增加启动次数
        startCount++;
        consoleLog(`启动倒计时，当前启动次数: ${startCount}`);

        // 更新启动次数显示
        startCountEl.textContent = startCount;

        // 调用递归倒计时函数
        countDown(seconds, callback);

        // 返回当前实例，支持链式调用
        return this;
      },

      // 获取启动次数方法
      getStartCount: function () {
        consoleLog(`获取启动总次数: ${startCount}`);
        return startCount;
      },

      // 扩展功能：获取私有变量（仅用于演示闭包）
      getPrivateStartCount: function () {
        return startCount;
      },

      // 扩展功能：重置启动次数
      resetStartCount: function () {
        consoleLog(`重置启动次数: ${startCount} -> 0`);
        startCount = 0;
        startCountEl.textContent = 0;
        return this;
      }
    };
  }

  // 创建计时器实例
  let myTimer = createTimer();

  // 更新计时器显示
  function updateTimerDisplay(seconds) {
    timerSecondsEl.textContent = seconds < 10 ? `0${seconds}` : seconds;
    timerStatusEl.textContent = seconds > 0 ? "运行中" : "已完成";
    timerStatusEl.style.color = seconds > 0 ? "#6a11cb" : "#28a745";

    // 更新进度环
    const circumference = 2 * Math.PI * 90; // 半径90
    const offset = circumference - (seconds / parseInt(secondsInput.value)) * circumference;
    timerProgress.style.strokeDashoffset = offset;

    // 更新按钮状态
    startBtn.disabled = seconds > 0;
    pauseBtn.disabled = seconds <= 0;
  }

  // 添加日志
  function addLog(message) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const logItem = document.createElement('div');
    logItem.className = 'log-item';
    logItem.textContent = `[${timeString}] ${message}`;
    logOutput.appendChild(logItem);
    logOutput.scrollTop = logOutput.scrollHeight;
  }

  // 控制台输出
  function consoleLog(message) {
    const line = document.createElement('div');
    line.className = 'console-line';
    line.textContent = `> ${message}`;
    consoleOutput.appendChild(line);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  }

  // 清空控制台
  function clearConsole() {
    consoleOutput.innerHTML = '';
  }

  // 清空日志
  function clearLog() {
    logOutput.innerHTML = '';
    addLog("日志已清空");
  }

  // 开始倒计时
  function startTimer() {
    const seconds = parseInt(secondsInput.value);
    const callbackMsg = callbackInput.value || "时间到！倒计时结束";

    if (isNaN(seconds) || seconds <= 0) {
      alert("请输入有效的秒数！");
      return;
    }

    // 重置状态
    isPaused = false;
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停';

    // 清除之前的定时器
    if (timerId) {
      clearTimeout(timerId);
    }

    // 创建回调函数
    const callback = function () {
      addLog(callbackMsg);
      consoleLog(`回调函数执行: "${callbackMsg}"`);

      // 播放提示音（如果需要）
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
        audio.volume = 0.3;
        audio.play();
      } catch (e) {
        // 忽略音频错误
      }
    };

    // 使用计时器实例启动倒计时
    myTimer.start(seconds, callback);

    // 更新状态
    timerStatusEl.textContent = "运行中";
    timerStatusEl.style.color = "#6a11cb";
    pauseBtn.disabled = false;
  }

  // 暂停/继续倒计时
  function togglePause() {
    if (!isPaused) {
      // 暂停
      clearTimeout(timerId);
      timerId = null;
      isPaused = true;
      pauseBtn.innerHTML = '<i class="fas fa-play"></i> 继续';
      timerStatusEl.textContent = "已暂停";
      timerStatusEl.style.color = "#fd7e14";
      addLog("计时器已暂停");
      consoleLog("计时器已暂停");
    } else {
      // 继续
      isPaused = false;
      pauseBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停';
      timerStatusEl.textContent = "运行中";
      timerStatusEl.style.color = "#6a11cb";
      addLog("计时器继续运行");
      consoleLog("计时器继续运行");

      // 从剩余秒数继续
      countDown(remainingSeconds, function () {
        addLog(callbackInput.value || "时间到！倒计时结束");
      });
    }
  }

  // 重置倒计时
  function resetTimer() {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }

    isPaused = false;
    remainingSeconds = 0;

    // 重置显示
    updateTimerDisplay(0);
    timerSecondsEl.textContent = secondsInput.value < 10 ? `0${secondsInput.value}` : secondsInput.value;

    // 重置进度环
    timerProgress.style.strokeDashoffset = 0;

    // 更新按钮状态
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停';
    pauseBtn.disabled = true;
    startBtn.disabled = false;

    addLog("计时器已重置");
    consoleLog("计时器已重置");
  }

  // 事件监听器
  startBtn.addEventListener('click', startTimer);

  pauseBtn.addEventListener('click', togglePause);

  resetBtn.addEventListener('click', resetTimer);

  clearLogBtn.addEventListener('click', clearLog);

  // 预设按钮事件
  presetBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      secondsInput.value = this.getAttribute('data-seconds');
      addLog(`设置为${this.textContent}倒计时`);
    });
  });

  // 测试按钮事件
  testBtn1.addEventListener('click', function () {
    consoleLog("=== 测试1: 启动3秒倒计时 ===");
    consoleLog("调用: myTimer.start(3, () => console.log('时间到！'))");

    // 模拟测试1：启动3秒倒计时
    secondsInput.value = 3;
    callbackInput.value = "时间到！3秒倒计时结束";
    startTimer();
  });

  testBtn2.addEventListener('click', function () {
    consoleLog("=== 测试2: 启动5秒倒计时 ===");
    consoleLog("调用: myTimer.start(5, () => console.log('5秒时间到！'))");

    // 模拟测试2：启动5秒倒计时
    secondsInput.value = 5;
    callbackInput.value = "5秒时间到！";
    startTimer();
  });

  testBtn3.addEventListener('click', function () {
    consoleLog("=== 测试3: 获取启动总次数 ===");
    consoleLog("调用: myTimer.getStartCount()");

    const count = myTimer.getStartCount();
    consoleLog(`结果: ${count}`);
    consoleLog(`说明: 闭包保护了startCount变量，外部无法直接修改，只能通过getStartCount()方法获取`);
  });

  testBtn4.addEventListener('click', function () {
    consoleLog("=== 测试4: 创建新计时器实例 ===");
    consoleLog("调用: const newTimer = createTimer()");

    // 创建新实例
    const newTimer = createTimer();
    consoleLog("新计时器实例创建成功");
    consoleLog("调用: newTimer.start(2, () => console.log('新计时器结束'))");

    // 使用新实例启动倒计时
    secondsInput.value = 2;
    callbackInput.value = "新计时器倒计时结束";

    // 注意：这里我们使用新的计时器实例
    newTimer.start(2, function () {
      addLog("新计时器倒计时结束");
      consoleLog("新计时器回调: 倒计时结束");
    });

    consoleLog("新计时器启动次数: " + newTimer.getStartCount());
    consoleLog("原计时器启动次数: " + myTimer.getStartCount());
    consoleLog("说明: 每个createTimer()调用都会创建独立的闭包，有独立的startCount变量");
  });

  // 输入框事件
  secondsInput.addEventListener('change', function () {
    const value = parseInt(this.value);
    if (value < 1) this.value = 1;
    if (value > 3600) this.value = 3600;
    updateTimerDisplay(parseInt(this.value));
  });

  // 初始显示
  updateTimerDisplay(parseInt(secondsInput.value));

  // 初始控制台信息
  consoleLog("计时器已初始化");
  consoleLog("创建计时器实例: const myTimer = createTimer();");
  consoleLog("myTimer是一个对象，包含start()和getStartCount()方法");
  consoleLog("startCount变量被闭包保护，无法从外部直接访问");
});
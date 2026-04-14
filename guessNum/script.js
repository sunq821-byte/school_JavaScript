// 游戏状态变量
let gameState = {
    min: 1,
    max: 100,
    maxAttempts: 10,
    attemptsLeft: 10,
    targetNumber: 0,
    isGameActive: false,
    guessHistory: []
};

// DOM 元素
const elements = {
    minValue: document.getElementById('min-value'),
    maxValue: document.getElementById('max-value'),
    maxAttempts: document.getElementById('max-attempts'),
    startGame: document.getElementById('start-game'),
    guessInput: document.getElementById('guess-input'),
    submitGuess: document.getElementById('submit-guess'),
    result: document.getElementById('result'),
    rangeInfo: document.getElementById('range-info'),
    attemptsLeft: document.getElementById('attempts-left'),
    historyList: document.getElementById('history-list')
};

// 初始化事件监听器
function initEventListeners() {
    elements.startGame.addEventListener('click', startGame);
    elements.submitGuess.addEventListener('click', handleGuess);
    elements.guessInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleGuess();
        }
    });
}

// 开始游戏
function startGame() {
    // 获取用户设置的参数
    const min = parseInt(elements.minValue.value);
    const max = parseInt(elements.maxValue.value);
    const maxAttempts = parseInt(elements.maxAttempts.value);
    
    // 验证输入
    if (!validateSettings(min, max, maxAttempts)) {
        return;
    }
    
    // 更新游戏状态
    gameState.min = min;
    gameState.max = max;
    gameState.maxAttempts = maxAttempts;
    gameState.attemptsLeft = maxAttempts;
    gameState.targetNumber = generateRandomNumber(min, max);
    gameState.isGameActive = true;
    gameState.guessHistory = [];
    
    // 更新界面
    updateGameUI();
    clearResult();
    clearHistory();
    
    // 启用输入和提交按钮
    elements.guessInput.disabled = false;
    elements.submitGuess.disabled = false;
    elements.guessInput.focus();
}

// 验证游戏设置
function validateSettings(min, max, maxAttempts) {
    if (isNaN(min) || isNaN(max) || isNaN(maxAttempts)) {
        showResult('请输入有效的数字', 'error');
        return false;
    }
    
    if (min < 0) {
        showResult('最小值不能小于0', 'error');
        return false;
    }
    
    if (max <= min) {
        showResult('最大值必须大于最小值', 'error');
        return false;
    }
    
    if (maxAttempts < 1) {
        showResult('最大猜测次数必须至少为1', 'error');
        return false;
    }
    
    return true;
}

// 生成随机数
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 处理用户猜测
function handleGuess() {
    if (!gameState.isGameActive) {
        return;
    }
    
    const guess = parseInt(elements.guessInput.value);
    
    // 验证输入
    if (!validateGuess(guess)) {
        return;
    }
    
    // 减少剩余次数
    gameState.attemptsLeft--;
    
    // 记录猜测历史
    gameState.guessHistory.push(guess);
    
    // 判断猜测结果
    if (guess === gameState.targetNumber) {
        // 猜对了
        showResult(`恭喜你！猜对了！答案是 ${gameState.targetNumber}。你用了 ${gameState.maxAttempts - gameState.attemptsLeft} 次猜测。`, 'correct');
        endGame();
    } else if (gameState.attemptsLeft === 0) {
        // 次数用完
        showResult(`游戏结束！正确答案是 ${gameState.targetNumber}。`, 'error');
        endGame();
    } else if (guess > gameState.targetNumber) {
        // 猜大了
        showResult(`太大了！还有 ${gameState.attemptsLeft} 次机会。`, 'too-high');
    } else {
        // 猜小了
        showResult(`太小了！还有 ${gameState.attemptsLeft} 次机会。`, 'too-low');
    }
    
    // 更新界面
    updateGameUI();
    updateHistory();
    
    // 清空输入框
    elements.guessInput.value = '';
    elements.guessInput.focus();
}

// 验证用户猜测
function validateGuess(guess) {
    if (isNaN(guess)) {
        showResult('请输入有效的数字', 'error');
        return false;
    }
    
    if (guess < gameState.min || guess > gameState.max) {
        showResult(`请输入 ${gameState.min} 到 ${gameState.max} 之间的数字`, 'error');
        return false;
    }
    
    return true;
}

// 显示结果
function showResult(message, type) {
    elements.result.textContent = message;
    elements.result.className = `result ${type}`;
}

// 清空结果
function clearResult() {
    elements.result.textContent = '';
    elements.result.className = 'result';
}

// 更新游戏界面
function updateGameUI() {
    elements.rangeInfo.textContent = `${gameState.min} - ${gameState.max}`;
    elements.attemptsLeft.textContent = gameState.attemptsLeft;
}

// 更新历史记录
function updateHistory() {
    elements.historyList.innerHTML = '';
    
    gameState.guessHistory.forEach((guess, index) => {
        const li = document.createElement('li');
        li.textContent = `第 ${index + 1} 次：${guess}`;
        elements.historyList.appendChild(li);
    });
    
    // 滚动到底部
    elements.historyList.scrollTop = elements.historyList.scrollHeight;
}

// 清空历史记录
function clearHistory() {
    elements.historyList.innerHTML = '';
}

// 结束游戏
function endGame() {
    gameState.isGameActive = false;
    elements.guessInput.disabled = true;
    elements.submitGuess.disabled = true;
}

// 初始化游戏
function init() {
    initEventListeners();
    updateGameUI();
}

// 启动游戏
init();
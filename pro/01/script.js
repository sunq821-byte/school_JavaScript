// 学生成绩分析工具 - JavaScript功能实现

document.addEventListener('DOMContentLoaded', function () {
  // 获取DOM元素
  const scoresInput = document.getElementById('scores-input');
  const thresholdInput = document.getElementById('threshold-input');
  const analyzeBtn = document.getElementById('analyze-btn');
  const clearBtn = document.getElementById('clear-btn');

  // 1. 使用arguments对象处理不定长参数 - 计算总分
  function getTotal() {
    let total = 0;
    for (let i = 0; i < arguments.length; i++) {
      const score = Number(arguments[i]);
      if (!isNaN(score)) {
        total += score;
      }
    }
    return total;
  }

  // 2. 使用剩余参数(...args)处理不定长参数 - 计算平均值
  function getAverage(...scores) {
    if (scores.length === 0) return 0;

    const total = getTotal(...scores);
    const average = total / scores.length;
    return Math.round(average * 100) / 100;
  }

  // 3. 使用arguments对象 - 获取最大值
  function getMax() {
    if (arguments.length === 0) return null;

    let max = Number(arguments[0]);
    for (let i = 1; i < arguments.length; i++) {
      const score = Number(arguments[i]);
      if (!isNaN(score) && score > max) {
        max = score;
      }
    }
    return max;
  }

  // 4. 使用arguments对象 - 获取最小值
  function getMin() {
    if (arguments.length === 0) return null;

    let min = Number(arguments[0]);
    for (let i = 1; i < arguments.length; i++) {
      const score = Number(arguments[i]);
      if (!isNaN(score) && score < min) {
        min = score;
      }
    }
    return min;
  }

  // 5. 使用剩余参数和阈值 - 统计及格人数
  function countPass(threshold, ...scores) {
    let passCount = 0;
    for (let i = 0; i < scores.length; i++) {
      const score = Number(scores[i]);
      if (!isNaN(score) && score >= threshold) {
        passCount++;
      }
    }
    return passCount;
  }

  // 6. 拓展功能 - 根据分数返回等级
  function getGrade(score) {
    const numScore = Number(score);
    if (isNaN(numScore)) return "无效分数";

    if (numScore >= 90) return "A";
    if (numScore >= 75) return "B";
    if (numScore >= 60) return "C";
    return "D";
  }

  // 解析输入的成绩字符串
  function parseScores(input) {
    if (!input.trim()) return [];

    return input.split(',')
      .map(item => item.trim())
      .filter(item => item !== '')
      .map(item => {
        const num = Number(item);
        return isNaN(num) ? null : num;
      })
      .filter(item => item !== null);
  }

  // 更新结果显示
  function updateResults(scores, threshold) {
    // 更新总人数
    document.getElementById('count-value').textContent = scores.length;

    if (scores.length === 0) {
      // 如果没有有效成绩，清空结果
      document.getElementById('total-value').textContent = '-';
      document.getElementById('average-value').textContent = '-';
      document.getElementById('max-value').textContent = '-';
      document.getElementById('min-value').textContent = '-';
      document.getElementById('pass-value').textContent = '-';

      // 清空成绩表格
      const tableBody = document.getElementById('grades-table-body');
      tableBody.innerHTML = '<tr><td colspan="4" class="no-data">请输入有效的成绩数据</td></tr>';

      return;
    }

    // 计算各项统计结果
    const total = getTotal(...scores);
    const average = getAverage(...scores);
    const max = getMax(...scores);
    const min = getMin(...scores);
    const passCount = countPass(threshold, ...scores);

    // 更新卡片显示
    document.getElementById('total-value').textContent = total;
    document.getElementById('average-value').textContent = average.toFixed(2);
    document.getElementById('max-value').textContent = max;
    document.getElementById('min-value').textContent = min;
    document.getElementById('pass-value').textContent = `${passCount} / ${scores.length}`;

    // 更新成绩表格
    updateGradesTable(scores, threshold);
  }

  // 更新成绩表格
  function updateGradesTable(scores, threshold) {
    const tableBody = document.getElementById('grades-table-body');
    tableBody.innerHTML = '';

    scores.forEach((score, index) => {
      const row = document.createElement('tr');

      // 序号
      const cell1 = document.createElement('td');
      cell1.textContent = index + 1;

      // 分数
      const cell2 = document.createElement('td');
      cell2.textContent = score;

      // 等级
      const cell3 = document.createElement('td');
      const grade = getGrade(score);
      cell3.textContent = grade;
      cell3.className = `grade-${grade}`;

      // 状态
      const cell4 = document.createElement('td');
      const status = score >= threshold ? '及格' : '不及格';
      cell4.textContent = status;
      cell4.className = score >= threshold ? 'status-pass' : 'status-fail';

      row.appendChild(cell1);
      row.appendChild(cell2);
      row.appendChild(cell3);
      row.appendChild(cell4);

      tableBody.appendChild(row);
    });
  }

  // 验证输入是否有效
  function validateInput(scores) {
    if (scores.length === 0) {
      alert('请输入有效的成绩数据！\n\n格式：数字之间用逗号分隔\n示例：85, 92, 58, 77, 63');
      return false;
    }

    // 检查是否有无效的成绩
    const invalidScores = scores.filter(score => score < 0 || score > 100);
    if (invalidScores.length > 0) {
      alert(`发现无效成绩：${invalidScores.join(', ')}\n\n成绩应在0-100分之间`);
      return false;
    }

    return true;
  }

  // 事件监听器
  analyzeBtn.addEventListener('click', function () {
    const inputText = scoresInput.value;
    const threshold = Number(thresholdInput.value) || 60;

    // 解析输入的成绩
    const scores = parseScores(inputText);

    // 验证输入
    if (!validateInput(scores)) {
      return;
    }

    updateResults(scores, threshold);
  });

  clearBtn.addEventListener('click', function () {
    scoresInput.value = '';
    thresholdInput.value = 60;

    // 清空结果
    updateResults([], 60);

    // 聚焦到输入框
    scoresInput.focus();
  });

  // 示例按钮点击事件（如果需要可以添加）
  const exampleBtn = document.createElement('button');
  exampleBtn.className = 'btn tertiary';
  exampleBtn.innerHTML = '<i class="fas fa-file-alt"></i> 使用示例';
  exampleBtn.addEventListener('click', function () {
    scoresInput.value = '85, 92, 58, 77, 63, 41, 88';
    analyzeBtn.click();
  });

  // 将示例按钮添加到按钮组
  const buttonGroup = document.querySelector('.button-group');
  buttonGroup.appendChild(exampleBtn);

  // 输入框回车键支持
  scoresInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      analyzeBtn.click();
    }
  });

  // 页面加载时聚焦到输入框
  scoresInput.focus();
});
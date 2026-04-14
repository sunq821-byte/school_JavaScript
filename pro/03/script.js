// 购物车价格计算器

document.addEventListener('DOMContentLoaded', function () {
  // 获取DOM元素
  const itemNameInput = document.getElementById('item-name');
  const itemPriceInput = document.getElementById('item-price');
  const itemQuantityInput = document.getElementById('item-quantity');
  const addItemBtn = document.getElementById('add-item-btn');
  const addSampleBtn = document.getElementById('add-sample-btn');
  const clearCartBtn = document.getElementById('clear-cart-btn');
  const calculateBtn = document.getElementById('calculate-btn');
  const applyDiscountBtn = document.getElementById('apply-discount-btn');
  const applyCustomBtn = document.getElementById('apply-custom-btn');
  const cartTableBody = document.getElementById('cart-table-body');
  const consoleOutput = document.getElementById('console-output');
  const customDiscountInput = document.getElementById('custom-discount-input');

  // 统计元素
  const itemTypesEl = document.getElementById('item-types');
  const totalItemsEl = document.getElementById('total-items');
  const originalPriceEl = document.getElementById('original-price');
  const discountAmountEl = document.getElementById('discount-amount');
  const finalPriceEl = document.getElementById('final-price');

  // 测试按钮
  const testScenario1Btn = document.getElementById('test-scenario-1');
  const testScenario2Btn = document.getElementById('test-scenario-2');
  const testScenario3Btn = document.getElementById('test-scenario-3');
  const testScenario4Btn = document.getElementById('test-scenario-4');

  // 代码选项卡
  const codeTabs = document.querySelectorAll('.code-tab');

  // 购物车数组，每个商品为对象：{ name: "商品名", price: 单价, quantity: 数量 }
  const cart = [];

  // 优惠策略函数
  // 1. 满200减30（匿名函数）
  const full200Minus30 = function (price) {
    return price > 200 ? price - 30 : price;
  };

  // 2. 打9折（匿名函数）
  const discount90 = function (price) {
    return price * 0.9;
  };

  // 3. 满500减100（函数表达式）
  const full500Minus100 = function (price) {
    if (price >= 500) {
      return price - 100;
    }
    return price;
  };

  // 4. 满1000打85折（函数表达式）
  const full1000Discount85 = function (price) {
    if (price >= 1000) {
      return price * 0.85;
    }
    return price;
  };

  // 添加商品函数
  function addItem(name, price, quantity) {
    // 验证输入
    if (!name || !price || !quantity) {
      consoleLog("错误：请填写完整的商品信息");
      alert("请填写完整的商品信息");
      return false;
    }

    const parsedPrice = parseFloat(price);
    const parsedQuantity = parseInt(quantity);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      consoleLog("错误：价格必须是大于0的数字");
      alert("价格必须是大于0的数字");
      return false;
    }

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      consoleLog("错误：数量必须是大于0的整数");
      alert("数量必须是大于0的整数");
      return false;
    }

    // 添加到购物车数组
    cart.push({
      name: name,
      price: parsedPrice,
      quantity: parsedQuantity
    });

    consoleLog(`添加商品: ${name}, 单价: ¥${parsedPrice.toFixed(2)}, 数量: ${parsedQuantity}`);
    updateCartDisplay();
    return true;
  }

  // 计算总价函数 - 使用reduce方法
  function calcTotal() {
    // 使用reduce方法计算总价，优雅且函数式
    const total = cart.reduce((accumulator, item) => {
      return accumulator + (item.price * item.quantity);
    }, 0);

    consoleLog(`计算总价: ¥${total.toFixed(2)}`);
    return total;
  }

  // 应用优惠函数 - 接收回调函数作为参数
  function applyDiscount(callback) {
    const originalPrice = calcTotal();
    consoleLog(`原总价: ¥${originalPrice.toFixed(2)}`);

    // 回调函数接收原总价，返回折后价
    const finalPrice = callback(originalPrice);
    const discountAmount = originalPrice - finalPrice;

    consoleLog(`应用优惠后: ¥${finalPrice.toFixed(2)} (优惠: ¥${discountAmount.toFixed(2)})`);

    // 更新显示
    updatePriceDisplay(originalPrice, finalPrice, discountAmount);

    return finalPrice;
  }

  // 应用多重优惠（拓展挑战）
  function applyMultipleDiscounts(...callbacks) {
    let price = calcTotal();
    consoleLog(`原总价: ¥${price.toFixed(2)}`);

    callbacks.forEach((callback, index) => {
      const before = price;
      price = callback(price);
      const discount = before - price;
      consoleLog(`优惠${index + 1}后: ¥${price.toFixed(2)} (优惠: ¥${discount.toFixed(2)})`);
    });

    const discountAmount = calcTotal() - price;
    updatePriceDisplay(calcTotal(), price, discountAmount);

    return price;
  }

  // 更新购物车显示
  function updateCartDisplay() {
    // 清空表格
    cartTableBody.innerHTML = '';

    if (cart.length === 0) {
      cartTableBody.innerHTML = '<tr><td colspan="5" class="no-data">购物车为空，请添加商品</td></tr>';
      itemTypesEl.textContent = '0';
      totalItemsEl.textContent = '0';
      return;
    }

    // 计算商品种类和总数
    const itemTypes = cart.length;
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    // 更新统计
    itemTypesEl.textContent = itemTypes;
    totalItemsEl.textContent = totalItems;

    // 添加商品行
    cart.forEach((item, index) => {
      const row = document.createElement('tr');
      const subtotal = item.price * item.quantity;

      row.innerHTML = `
                <td>${item.name}</td>
                <td>¥${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>¥${subtotal.toFixed(2)}</td>
                <td>
                    <button class="remove-btn" data-index="${index}">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </td>
            `;

      cartTableBody.appendChild(row);
    });

    // 添加删除按钮事件监听
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const index = parseInt(this.getAttribute('data-index'));
        removeItem(index);
      });
    });
  }

  // 删除商品
  function removeItem(index) {
    if (index >= 0 && index < cart.length) {
      const removedItem = cart[index];
      consoleLog(`删除商品: ${removedItem.name}, 单价: ¥${removedItem.price.toFixed(2)}, 数量: ${removedItem.quantity}`);
      cart.splice(index, 1);
      updateCartDisplay();

      // 重新计算价格
      calculatePrice();
    }
  }

  // 更新价格显示
  function updatePriceDisplay(originalPrice, finalPrice, discountAmount) {
    originalPriceEl.textContent = `¥${originalPrice.toFixed(2)}`;
    finalPriceEl.textContent = `¥${finalPrice.toFixed(2)}`;
    discountAmountEl.textContent = `¥${discountAmount.toFixed(2)}`;

    // 高亮显示折扣
    if (discountAmount > 0) {
      discountAmountEl.style.color = '#e74c3c';
      discountAmountEl.style.fontWeight = 'bold';
    } else {
      discountAmountEl.style.color = '#666';
      discountAmountEl.style.fontWeight = 'normal';
    }
  }

  // 计算价格
  function calculatePrice() {
    const originalPrice = calcTotal();
    updatePriceDisplay(originalPrice, originalPrice, 0);

    // 重置优惠选择
    document.getElementById('no-discount').checked = true;
  }

  // 应用选择的优惠
  function applySelectedDiscount() {
    const selectedDiscount = document.querySelector('input[name="discount"]:checked').value;

    switch (selectedDiscount) {
      case 'full200Minus30':
        applyDiscount(full200Minus30);
        break;
      case 'discount90':
        applyDiscount(discount90);
        break;
      case 'full500Minus100':
        applyDiscount(full500Minus100);
        break;
      case 'full1000Discount85':
        applyDiscount(full1000Discount85);
        break;
      case 'none':
      default:
        calculatePrice();
        consoleLog("未应用任何优惠");
        break;
    }
  }

  // 应用自定义优惠
  function applyCustomDiscount() {
    const customFunctionStr = customDiscountInput.value.trim();

    if (!customFunctionStr) {
      alert("请输入自定义优惠函数");
      return;
    }

    try {
      // 注意：使用eval有安全风险，这里仅用于演示
      // 在实际应用中，应该使用更安全的方式解析函数
      const customDiscount = eval(`(${customFunctionStr})`);

      if (typeof customDiscount !== 'function') {
        throw new Error("请输入有效的函数表达式");
      }

      consoleLog(`应用自定义优惠函数: ${customFunctionStr}`);
      applyDiscount(customDiscount);

    } catch (error) {
      consoleLog(`错误: ${error.message}`);
      alert(`函数解析错误: ${error.message}\n\n请确保输入有效的JavaScript函数表达式，例如：price => price > 100 ? price - 20 : price`);
    }
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

  // 清空购物车
  function clearCart() {
    if (cart.length === 0) {
      alert("购物车已经是空的");
      return;
    }

    if (confirm(`确定要清空购物车吗？这将删除 ${cart.length} 种商品`)) {
      cart.length = 0;
      consoleLog("购物车已清空");
      updateCartDisplay();
      calculatePrice();
    }
  }

  // 添加示例商品
  function addSampleItems() {
    const sampleItems = [
      { name: "苹果手机", price: 5999.00, quantity: 1 },
      { name: "蓝牙耳机", price: 299.00, quantity: 2 },
      { name: "笔记本电脑", price: 7999.00, quantity: 1 },
      { name: "智能手表", price: 1299.00, quantity: 1 },
      { name: "移动电源", price: 159.00, quantity: 3 }
    ];

    // 先清空购物车
    cart.length = 0;

    // 添加示例商品
    sampleItems.forEach(item => {
      addItem(item.name, item.price, item.quantity);
    });

    consoleLog("已添加示例商品");
    calculatePrice();
  }

  // 事件监听器
  addItemBtn.addEventListener('click', function () {
    const name = itemNameInput.value.trim();
    const price = itemPriceInput.value;
    const quantity = itemQuantityInput.value;

    if (addItem(name, price, quantity)) {
      // 清空输入
      itemNameInput.value = '';
      itemPriceInput.value = '';
      itemQuantityInput.value = '1';
      itemNameInput.focus();

      // 计算价格
      calculatePrice();
    }
  });

  addSampleBtn.addEventListener('click', addSampleItems);

  clearCartBtn.addEventListener('click', clearCart);

  calculateBtn.addEventListener('click', calculatePrice);

  applyDiscountBtn.addEventListener('click', applySelectedDiscount);

  applyCustomBtn.addEventListener('click', applyCustomDiscount);

  // 测试场景1：满200减30
  testScenario1Btn.addEventListener('click', function () {
    consoleLog("=== 测试场景1：满200减30优惠 ===");

    // 清空购物车
    cart.length = 0;

    // 添加商品使总价超过200
    addItem("测试商品A", 150, 1);
    addItem("测试商品B", 80, 1);

    // 选择满200减30优惠
    document.getElementById('discount-1').checked = true;

    // 计算并应用优惠
    calculatePrice();
    setTimeout(() => {
      applyDiscount(full200Minus30);
      consoleLog("测试完成：原总价¥230，应用满200减30后应为¥200");
    }, 100);
  });

  // 测试场景2：打9折
  testScenario2Btn.addEventListener('click', function () {
    consoleLog("=== 测试场景2：打9折优惠 ===");

    // 清空购物车
    cart.length = 0;

    // 添加商品
    addItem("测试商品C", 100, 2);
    addItem("测试商品D", 50, 1);

    // 选择打9折优惠
    document.getElementById('discount-2').checked = true;

    // 计算并应用优惠
    calculatePrice();
    setTimeout(() => {
      applyDiscount(discount90);
      consoleLog("测试完成：原总价¥250，打9折后应为¥225");
    }, 100);
  });

  // 测试场景3：组合优惠
  testScenario3Btn.addEventListener('click', function () {
    consoleLog("=== 测试场景3：组合优惠（拓展挑战）===");

    // 清空购物车
    cart.length = 0;

    // 添加高价值商品
    addItem("高端商品A", 800, 1);
    addItem("高端商品B", 400, 1);

    consoleLog("原总价: ¥1200");
    consoleLog("先满500减100: ¥1100");
    consoleLog("再打85折: ¥935");

    // 应用多重优惠
    applyMultipleDiscounts(full500Minus100, full1000Discount85);

    consoleLog("测试完成：组合优惠后总价应为¥935");
  });

  // 测试场景4：自定义优惠函数
  testScenario4Btn.addEventListener('click', function () {
    consoleLog("=== 测试场景4：自定义优惠函数 ===");

    // 清空购物车
    cart.length = 0;

    // 添加商品
    addItem("自定义测试商品", 300, 1);

    // 设置自定义优惠函数
    customDiscountInput.value = "price => price > 250 ? price * 0.8 : price";

    // 应用自定义优惠
    setTimeout(() => {
      applyCustomDiscount();
      consoleLog("测试完成：原总价¥300，自定义优惠(满250打8折)后应为¥240");
    }, 100);
  });

  // 代码选项卡切换
  codeTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const target = this.getAttribute('data-target');

      // 移除所有active类
      codeTabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.code-snippet').forEach(snippet => {
        snippet.classList.remove('active');
      });

      // 添加active类
      this.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });

  // 回车键添加商品
  itemNameInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      addItemBtn.click();
    }
  });

  // 初始控制台信息
  consoleLog("购物车价格计算器已就绪");
  consoleLog("使用reduce方法计算总价: cart.reduce((total, item) => total + item.price * item.quantity, 0)");
  consoleLog("回调函数示例: applyDiscount(price => price > 200 ? price - 30 : price)");

  // 添加一些初始示例商品
  setTimeout(() => {
    addItem("示例商品1", 99.99, 2);
    addItem("示例商品2", 199.50, 1);
    calculatePrice();
  }, 500);
});
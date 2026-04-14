// 全局变量（第1章：变量声明与赋值）
let userName = '';
let cartItems = [];      // 购物车商品列表
let totalAmount = 0;     // 总金额
let totalQty = 0;        // 总件数

/**
 * 开始购物主函数
 */
function startShopping() {
  // 第1章：alert()
  alert('🎉 欢迎使用小智的购物助手！\n让我们开始愉快购物吧～');

  // 第1章：prompt() 获取用户昵称
  userName = prompt('请输入您的昵称：', '小智');
  if (userName === null || userName.trim() === '') {
    userName = '亲爱的顾客';
  }

  // 更新欢迎区显示
  document.getElementById('userDisplay').innerHTML =
    `👤 当前用户：<strong>${userName}</strong><br>开始添加商品吧！`;

  // 第2章：while 循环 + break + continue
  let continueShopping = true;

  while (continueShopping) {
    // 输入商品名称
    let itemName = prompt('请输入商品名称（如：衬衫、耳机）：');

    if (itemName === null || itemName.toLowerCase() === '退出') {
      break;                    // break 语句退出循环
    }

    // 输入单价（字符串 → 数字转换）
    let priceStr = prompt('请输入商品单价（元）：');
    let price = Number(priceStr);   // Number() 类型转换

    if (isNaN(price) || price <= 0) {
      alert('❌ 单价必须是大于0的数字！');
      continue;                 // continue 跳过本次循环
    }

    // 输入数量
    let qtyStr = prompt('请输入购买数量：');
    let qty = Number(qtyStr);

    if (isNaN(qty) || qty <= 0) {
      alert('❌ 数量必须是大于0的数字！');
      continue;
    }

    // 计算小计（算术运算符）
    let subtotal = price * qty;

    // 添加到购物车（数组）
    cartItems.push({
      name: itemName,
      price: price,
      qty: qty,
      subtotal: subtotal
    });

    // 更新总计（赋值运算符）
    totalAmount += subtotal;
    totalQty += qty;

    // 实时渲染购物车
    renderCart();

    // 是否继续购物（布尔型判断）
    let more = prompt('是否继续添加商品？\n输入“是”继续，其他退出');
    continueShopping = (more === '是');
  }

  // 循环结束后显示最终总结
  showFinalSummary();

  // 显示“继续添加”按钮
  document.getElementById('addMoreBtn').style.display = 'inline-block';
}

/**
 * 渲染购物车表格
 */
function renderCart() {
  const tbody = document.getElementById('cartBody');
  tbody.innerHTML = '';

  // for 循环遍历数组
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${item.qty}</td>
            <td><strong>${item.subtotal.toFixed(2)}</strong></td>
        `;
    tbody.appendChild(row);
  }

  // 显示/隐藏总计区域和空购物车提示
  const totalArea = document.getElementById('totalArea');
  const emptyCart = document.getElementById('emptyCart');

  if (cartItems.length > 0) {
    totalArea.style.display = 'flex';
    emptyCart.style.display = 'none';

    // 更新总计数据
    document.getElementById('totalQty').textContent = totalQty;
    document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);

    // 运费逻辑（if...else 选择结构）
    let shipping = (totalAmount >= 100) ? 0 : 10;
    document.getElementById('shipping').textContent = shipping.toFixed(2);

    let final = totalAmount + shipping;
    document.getElementById('finalAmount').textContent = final.toFixed(2);
  } else {
    totalArea.style.display = 'none';
    emptyCart.style.display = 'block';
  }
}

/**
 * 最终结算弹窗
 */
function showFinalSummary() {
  if (cartItems.length === 0) {
    alert('🛒 购物车为空，没有购买任何商品！');
    return;
  }

  let shipping = (totalAmount >= 100) ? 0 : 10;
  let finalAmount = totalAmount + shipping;

  let message = `🎉 结算成功！\n\n`;
  message += `亲爱的 ${userName}，您本次购物如下：\n\n`;
  message += `📦 总件数：${totalQty} 件\n`;
  message += `💰 商品总金额：${totalAmount.toFixed(2)} 元\n`;

  if (shipping === 0) {
    message += `🎟️ 恭喜！已满100元，运费全免！\n`;
  } else {
    message += `🚚 运费：${shipping.toFixed(2)} 元\n`;
  }

  message += `💳 实付金额：${finalAmount.toFixed(2)} 元\n\n`;
  message += `感谢您的购物！祝您生活愉快～`;

  alert(message);

  // 在控制台输出完整信息
  console.log('%c=== 小智购物助手结算结果 ===', 'color:#00aaff; font-weight:bold');
  console.log('用户：', userName);
  console.log('购物车商品：', cartItems);
  console.log('总件数：', totalQty, '件');
  console.log('总金额：', totalAmount.toFixed(2), '元');
  console.log('运费：', shipping.toFixed(2), '元');
  console.log('实付金额：', finalAmount.toFixed(2), '元');
}

/**
 * 清空购物车
 */
function resetCart() {
  if (confirm('确定要清空整个购物车吗？')) {
    cartItems = [];
    totalAmount = 0;
    totalQty = 0;
    renderCart();
    document.getElementById('addMoreBtn').style.display = 'none';
    alert('🗑️ 购物车已清空，可以重新开始购物了！');
  }
}
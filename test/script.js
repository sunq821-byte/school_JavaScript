document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginForm = document.getElementById('loginForm');
    const cloudSpirit = document.getElementById('cloudSpirit');

    function resetSpirit() {
        cloudSpirit.classList.remove('peeking', 'covering-eyes', 'spinning', 'sad');
    }

    usernameInput.addEventListener('focus', function() {
        resetSpirit();
        cloudSpirit.classList.add('peeking');
    });

    usernameInput.addEventListener('blur', function() {
        if (!passwordInput.matches(':focus')) {
            resetSpirit();
        }
    });

    passwordInput.addEventListener('focus', function() {
        resetSpirit();
        cloudSpirit.classList.add('covering-eyes');
    });

    passwordInput.addEventListener('blur', function() {
        if (!usernameInput.matches(':focus')) {
            resetSpirit();
        }
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        resetSpirit();

        setTimeout(() => {
            if (username === 'admin' && password === '123456') {
                cloudSpirit.classList.add('spinning');
                setTimeout(() => {
                    alert('🎉 登录成功！欢迎回来！');
                    resetSpirit();
                }, 1000);
            } else {
                cloudSpirit.classList.add('sad');
                setTimeout(() => {
                    alert('😢 登录失败！账号或密码错误\n\n测试账号：admin\n测试密码：123456');
                    resetSpirit();
                }, 800);
            }
        }, 300);
    });
});

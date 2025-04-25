// 导入各个模块
document.addEventListener('DOMContentLoaded', () => {
    // 初始化模块顺序很重要，确保依赖关系正确
    
    // 加载工具函数模块
    loadModule('js/utils.js')
    .then(() => loadModule('js/core.js'))
    .then(() => loadModule('js/chart.js'))
    .then(() => loadModule('js/case.js'))
    .then(() => loadModule('js/filter.js'))
    .then(() => loadModule('js/chat.js'))
    .then(() => {
        console.log('所有模块加载完成，开始初始化应用');
        // 所有模块加载完成后调用初始化函数
        if (typeof initApp === 'function') {
            initApp();
        } else {
            console.error('initApp函数未定义，初始化失败');
        }
    })
    .catch(error => {
        console.error('模块加载失败:', error);
        alert('应用程序初始化失败，请刷新页面重试。');
    });
});

/**
 * 动态加载JavaScript模块
 * @param {String} path - 模块文件路径
 * @returns {Promise} 加载完成的Promise
 */
function loadModule(path) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = path;
        script.onload = () => {
            console.log(`模块 ${path} 已加载`);
            resolve();
        };
        script.onerror = () => {
            reject(new Error(`无法加载模块 ${path}`));
        };
        document.head.appendChild(script);
    });
} 
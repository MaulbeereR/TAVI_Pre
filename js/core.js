// DOM元素
const caseListEl = document.getElementById('case-list');                   // 病例列表容器
const totalCasesEl = document.getElementById('total-cases');               // 总病例数显示元素
const filteredCasesEl = document.getElementById('filtered-cases');         // 筛选后病例数显示元素
const leakRateEl = document.getElementById('leak-rate');                   // 瓣周漏率显示元素
const deathRateEl = document.getElementById('death-rate');                 // 死亡率显示元素
const applyFilterBtn = document.getElementById('apply-filter');            // 应用筛选按钮
const resetFilterBtn = document.getElementById('reset-filter');            // 重置筛选按钮
const sortByMatchBtn = document.getElementById('sort-by-match');           // 按匹配度排序按钮
const sortByAgeBtn = document.getElementById('sort-by-age');               // 按年龄排序按钮
const sortByYearBtn = document.getElementById('sort-by-year');             // 按年份排序按钮
const valveDiameterHeaderEl = document.getElementById('valve-diameter-header');     // 瓣膜直径筛选器标题
const valveDiameterDropdownEl = document.getElementById('valve-diameter-dropdown'); // 瓣膜直径下拉选项
const valveTypeHeaderEl = document.getElementById('valve-type-header');             // 瓣膜类型筛选器标题
const valveTypeDropdownEl = document.getElementById('valve-type-dropdown');         // 瓣膜类型下拉选项
const chatInputEl = document.getElementById('chat-input');                 // 聊天输入框
const sendMessageBtn = document.getElementById('send-message');            // 发送消息按钮
const chatMessagesEl = document.getElementById('chat-messages');           // 聊天消息容器
const clearChatBtn = document.getElementById('clear-chat');                // 清空聊天按钮

// 图表实例
let valveTypeChart;          // 瓣膜类型分布图表实例
let valveDiameterChart;      // 瓣膜直径分布图表实例
let prePostComparisonChart;  // 术前术后对比图表实例

// 当前筛选后的病例
let filteredCases = [];

// 排序状态
let sortStates = {
    match: { ascending: true },  // 匹配度排序状态
    age: { ascending: true },    // 年龄排序状态
    year: { ascending: true }    // 年份排序状态
};

// 分页变量
let currentPage = 1;         // 当前页码
const casesPerPage = 50;     // 每页显示的病例数量

// GPT配置
const gptConfig = {
    model: "gpt-4o-mini",
    temperature: 0.01,
    max_tokens: 15000,
    api_base: "https://admin-m99nr154-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2025-01-01-preview",
    api_version: "2025-01-01-preview"
};

// 聊天历史
let chatHistory = [];

// 初始化应用
// 注意：这个函数会在app.js中所有模块加载完成后调用
function initApp() {
    // 初始化数据
    initializeData();
    
    // 绑定事件
    bindEvents();
    
    // 初始化图表
    initializeCharts();
}

/**
 * 初始化数据
 * 加载病例数据并设置初始显示
 */
function initializeData() {
    // 设置总病例数
    totalCasesEl.textContent = taviCases.length;
    
    // 初始显示所有病例并按ID排序
    filteredCases = [...taviCases].sort((a, b) => a.id - b.id);
    filteredCasesEl.textContent = filteredCases.length;
    
    // 计算并显示瓣周漏率和死亡率
    updateStatistics(filteredCases);
    
    // 渲染病例列表
    renderCaseList(filteredCases);
}

/**
 * 绑定页面事件
 * 为各个交互元素添加事件监听器
 */
function bindEvents() {
    // 应用筛选按钮
    applyFilterBtn.addEventListener('click', applyFilters);
    
    // 重置筛选按钮
    resetFilterBtn.addEventListener('click', resetFilters);
    
    // 排序按钮
    sortByMatchBtn.addEventListener('click', () => sortCases('match'));
    sortByAgeBtn.addEventListener('click', () => sortCases('age'));
    sortByYearBtn.addEventListener('click', () => sortCases('year'));

    // 瓣膜直径下拉框事件
    valveDiameterHeaderEl.addEventListener('click', () => {
        const isActive = valveDiameterHeaderEl.classList.contains('active');
        valveDiameterHeaderEl.classList.toggle('active');
        valveDiameterDropdownEl.style.display = isActive ? 'none' : 'block';
    });

    // 瓣膜类型下拉框事件
    valveTypeHeaderEl.addEventListener('click', () => {
        const isActive = valveTypeHeaderEl.classList.contains('active');
        valveTypeHeaderEl.classList.toggle('active');
        valveTypeDropdownEl.style.display = isActive ? 'none' : 'block';
    });

    // 聊天相关事件
    sendMessageBtn.addEventListener('click', sendChatMessage);
    chatInputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });

    // 点击其他地方关闭下拉框
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.valve-diameter-select')) {
            valveDiameterHeaderEl.classList.remove('active');
            valveDiameterDropdownEl.style.display = 'none';
        }
        if (!event.target.closest('.valve-type-select')) {
            valveTypeHeaderEl.classList.remove('active');
            valveTypeDropdownEl.style.display = 'none';
        }
    });

    // 更新选中状态显示
    document.querySelectorAll('.valve-diameter-checkboxes input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateValveDiameterHeader);
    });

    document.querySelectorAll('.valve-type-checkboxes input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateValveTypeHeader);
    });

    // 清空聊天按钮事件
    clearChatBtn.addEventListener('click', clearChatHistory);
} 
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
    api_key: "",
    model: "gpt-4o-mini",
    temperature: 0.01,
    max_tokens: 15000,
    api_base: "https://admin-m99nr154-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2025-01-01-preview",
    api_version: "2025-01-01-preview"
};

// 聊天历史
let chatHistory = [];

/**
 * 页面加载完成后的初始化函数
 */
document.addEventListener('DOMContentLoaded', () => {
    // 初始化数据
    initializeData();
    
    // 绑定事件
    bindEvents();
    
    // 初始化图表
    initializeCharts();
});

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

/**
 * 初始化所有图表
 */
function initializeCharts() {
    // 瓣膜类型分布图表
    initValveTypeChart();
    
    // 瓣膜直径分布图表
    initValveDiameterChart();
    
    // 术前术后指标对比图表
    initPrePostComparisonChart();
}

/**
 * 初始化瓣膜类型分布图表
 * 生成饼状图展示不同瓣膜类型的分布情况
 */
function initValveTypeChart() {
    const ctx = document.getElementById('valve-type-chart').getContext('2d');
    
    // 统计各瓣膜类型数量
    const valveTypes = {};
    filteredCases.forEach(caseItem => {
        const valveType = caseItem.Procedure.Valve_Type;
        if (valveType !== 'N/A') {
            valveTypes[valveType] = (valveTypes[valveType] || 0) + 1;
        }
    });
    
    // 准备图表数据
    const labels = Object.keys(valveTypes);
    const data = Object.values(valveTypes);
    
    // 为每种瓣膜类型设置独特的颜色
    const colorMap = {
        'ACURATE Neo': 'rgba(255, 99, 132, 0.7)',      // 红色
        'Avalus': 'rgba(54, 162, 235, 0.7)',           // 蓝色
        'CoreValve': 'rgba(255, 206, 86, 0.7)',        // 黄色
        'Edwards': 'rgba(75, 192, 192, 0.7)',          // 青色
        'Edwards SAPIEN': 'rgba(153, 102, 255, 0.7)',  // 紫色
        'Evolut': 'rgba(255, 159, 64, 0.7)',           // 橙色
        'Hancock': 'rgba(255, 99, 71, 0.7)',           // 番茄红
        'INSPIRIS': 'rgba(50, 205, 50, 0.7)',          // 酸橙绿
        'Inoue': 'rgba(30, 144, 255, 0.7)',            // 道奇蓝
        'Inovare': 'rgba(218, 112, 214, 0.7)',         // 兰花紫
        'J-Valve': 'rgba(255, 140, 0, 0.7)',           // 深橙色
        'JenaValve': 'rgba(255, 182, 193, 0.7)',       // 浅粉色
        'LOTUS': 'rgba(0, 191, 255, 0.7)',             // 深天蓝
        'Medtronic Mosaic': 'rgba(148, 0, 211, 0.7)',  // 深紫色
        'MyVal': 'rgba(0, 206, 209, 0.7)',             // 青绿色
        'Navitor': 'rgba(34, 139, 34, 0.7)',           // 森林绿
        'PERCEVAL-S': 'rgba(255, 215, 0, 0.7)',        // 金色
        'Portico': 'rgba(220, 20, 60, 0.7)',           // 猩红色
        'St Jude': 'rgba(255, 127, 80, 0.7)',          // 珊瑚色
        'Tyshak': 'rgba(0, 139, 139, 0.7)',            // 青色
        'Venus': 'rgba(138, 43, 226, 0.7)',            // 蓝紫色
        'Vitaflow Liberty': 'rgba(65, 105, 225, 0.7)', // 皇家蓝
    };
    
    // 根据标签获取对应颜色
    const backgroundColors = labels.map(label => colorMap[label] || 'rgba(128, 128, 128, 0.7)');
    
    // 创建图表
    valveTypeChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: '病例数量',
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'rect',
                        padding: 20,
                        font: {
                            size: 12
                        }
                    },
                    title: {
                        display: true,
                        text: '点击图例可显示 / 隐藏对应数据',
                        font: {
                            size: 12,
                            style: 'italic'
                        },
                        padding: {
                            top: 10
                        }
                    }
                },
                title: {
                    display: false,
                    text: '瓣膜类型分布'
                }
            }
        }
    });
}

/**
 * 初始化瓣膜直径分布图表
 * 生成柱状图展示不同瓣膜直径的分布情况
 */
function initValveDiameterChart() {
    const ctx = document.getElementById('valve-diameter-chart').getContext('2d');
    
    // 统计各瓣膜直径数量
    const valveDiameters = {};
    filteredCases.forEach(caseItem => {
        const valveDiameter = caseItem.Procedure.Valve_Diameter;
        if (valveDiameter !== 'N/A') {
            valveDiameters[valveDiameter] = (valveDiameters[valveDiameter] || 0) + 1;
        }
    });
    
    // 准备图表数据并排序
    const labels = Object.keys(valveDiameters);
    const data = Object.values(valveDiameters);
    
    // 创建临时数组进行排序
    const sortedData = labels.map((label, index) => ({
        label: label,
        data: data[index]
    }));
    
    // 按直径大小排序（N/A放在最后）
    sortedData.sort((a, b) => {
        if (a.label === 'N/A') return 1;
        if (b.label === 'N/A') return -1;
        const numA = parseInt(a.label);
        const numB = parseInt(b.label);
        return numA - numB;
    });
    
    // 分离排序后的标签和数据
    const sortedLabels = sortedData.map(item => item.label);
    const sortedValues = sortedData.map(item => item.data);
    
    // 创建图表
    valveDiameterChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedLabels,
            datasets: [{
                label: '病例数量',
                data: sortedValues,
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'rect',
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: false,
                    text: '瓣膜直径分布'
                }
            }
        }
    });
}

/**
 * 初始化术前术后指标对比图表
 * 生成柱状图展示术前术后平均跨瓣压差的变化
 */
function initPrePostComparisonChart() {
    const ctx = document.getElementById('pre-post-comparison-chart').getContext('2d');
    
    // 收集有效的术前术后平均压差数据
    const preMeanGradients = [];
    const postMeanGradients = [];
    const caseLabels = [];
    
    filteredCases.forEach(caseItem => {
        if (caseItem.Pre_Info.Mean_Gradient !== 'N/A' && caseItem.Result.Mean_Gradient !== 'N/A') {
            // 提取数值部分
            const preValue = parseFloat(caseItem.Pre_Info.Mean_Gradient);
            const postValue = parseFloat(caseItem.Result.Mean_Gradient);
            
            if (!isNaN(preValue) && !isNaN(postValue)) {
                preMeanGradients.push(preValue);
                postMeanGradients.push(postValue);
                caseLabels.push(`病例 ${caseItem.id}`);
            }
        }
    });
    
    // 只取前20个病例的数据
    const limitedPreMeanGradients = preMeanGradients.slice(0, 20);
    const limitedPostMeanGradients = postMeanGradients.slice(0, 20);
    const limitedCaseLabels = caseLabels.slice(0, 20);
    
    // 创建图表
    prePostComparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: limitedCaseLabels,
            datasets: [
                {
                    label: '术前平均跨瓣压差 (mmHg)',
                    data: limitedPreMeanGradients,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: '术后平均跨瓣压差 (mmHg)',
                    data: limitedPostMeanGradients,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'rect',
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: false,
                    text: '术前术后平均跨瓣压差对比'
                }
            }
        }
    });
}

/**
 * 更新统计数据
 * 计算并显示瓣周漏率和死亡率
 * @param {Array} cases - 需要统计的病例数组
 */
function updateStatistics(cases) {
    // 计算瓣周漏率
    const leakCases = cases.filter(caseItem => caseItem.Result.Paravalvular_Leak === true);
    const leakRate = cases.length > 0 ? Math.round((leakCases.length / cases.length) * 100) : 0;
    leakRateEl.textContent = `${leakRate}%`;
    
    // 计算死亡率
    const deathCases = cases.filter(caseItem => caseItem.Result.Death === true);
    const deathRate = cases.length > 0 ? Math.round((deathCases.length / cases.length) * 100) : 0;
    deathRateEl.textContent = `${deathRate}%`;
    
    // 更新筛选病例数
    filteredCasesEl.textContent = cases.length;
}

/**
 * 渲染病例列表
 * 根据当前筛选和分页状态显示病例
 * @param {Array} cases - 要显示的病例数组
 */
function renderCaseList(cases) {
    // 清空列表
    caseListEl.innerHTML = '';
    
    // 计算当前页的病例
    const start = (currentPage - 1) * casesPerPage;
    const end = start + casesPerPage;
    const paginatedCases = cases.slice(start, end);
    
    // 添加病例行
    paginatedCases.forEach(caseItem => {
        const row = document.createElement('tr');
        
        // 提取年龄数字部分
        let age = caseItem.Basic_Info.Age;
        if (age !== 'N/A') {
            age = age.replace(/\D/g, '');
        }
        
        // 构建行内容
        row.innerHTML = `
            <td>${caseItem.id}</td>
            <td>${caseItem.year}</td>
            <td>${caseItem.Basic_Info.Age}</td>
            <td>${caseItem.Basic_Info.Gender === 'Male' ? '男' : caseItem.Basic_Info.Gender === 'Female' ? '女' : 'N/A'}</td>
            <td>
                <span class="case-text" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="${caseItem.Basic_Info.Case}">
                    ${truncateText(caseItem.Basic_Info.Case, 30)}
                </span>
            </td>
            <td>${caseItem.Procedure.Valve_Type}</td>
            <td>${caseItem.Procedure.Valve_Diameter}</td>
            <td>${caseItem.Pre_Info.Mean_Gradient}</td>
            <td>
                ${caseItem.Result.Death === true ? '<span class="status-badge danger">死亡</span>' : ''}
                ${caseItem.Result.Paravalvular_Leak === true ? '<span class="status-badge warning">瓣周漏</span>' : ''}
                ${caseItem.Result.Death !== true && caseItem.Result.Paravalvular_Leak !== true ? '<span class="status-badge success">良好</span>' : ''}
            </td>
            <td>
                <button class="btn btn-sm btn-primary btn-view-details" data-case-id="${caseItem.id}">
                    查看详情
                </button>
            </td>
        `;
        
        // 添加点击事件
        row.addEventListener('click', () => showCaseDetail(caseItem.id));
        
        // 添加到列表
        caseListEl.appendChild(row);
    });
    
    // 初始化所有tooltip
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // 为详情按钮添加事件
    document.querySelectorAll('.btn-view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const caseId = parseInt(btn.getAttribute('data-case-id'));
            showCaseDetail(caseId);
        });
    });

    // 渲染分页控件
    renderPagination(cases.length);
}

/**
 * 渲染分页控件
 * 生成分页按钮和页码信息
 * @param {Number} totalCases - 总病例数量
 */
function renderPagination(totalCases) {
    const paginationEl = document.getElementById('pagination');
    paginationEl.innerHTML = '';
    
    const totalPages = Math.ceil(totalCases / casesPerPage);
    
    /**
     * 创建分页按钮
     * @param {String} text - 按钮文本
     * @param {Number} page - 页码
     * @param {Boolean} isActive - 是否为当前页
     * @returns {HTMLElement} 按钮元素
     */
    const createPageButton = (text, page, isActive = false) => {
        const button = document.createElement('button');
        button.className = `btn ${isActive ? 'btn-primary' : 'btn-outline-primary'} mx-1`;
        button.textContent = text;
        button.disabled = isActive;
        button.addEventListener('click', () => {
            currentPage = page;
            renderCaseList(filteredCases);
        });
        return button;
    };
    
    // 添加首页按钮
    if (currentPage > 1) {
        paginationEl.appendChild(createPageButton('首页', 1));
    }
    
    // 添加上一页按钮
    if (currentPage > 1) {
        paginationEl.appendChild(createPageButton('上一页', currentPage - 1));
    }
    
    // 添加页码按钮
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationEl.appendChild(createPageButton(i, i, i === currentPage));
    }
    
    // 添加下一页按钮
    if (currentPage < totalPages) {
        paginationEl.appendChild(createPageButton('下一页', currentPage + 1));
    }
    
    // 添加末页按钮
    if (currentPage < totalPages) {
        paginationEl.appendChild(createPageButton('末页', totalPages));
    }
    
    // 添加页码信息
    const pageInfo = document.createElement('span');
    pageInfo.className = 'mx-2';
    // pageInfo.textContent = `第 ${currentPage} 页，共 ${totalPages} 页`;
    paginationEl.appendChild(pageInfo);
}

/**
 * 显示病例详情
 * 在模态框中展示选中病例的详细信息
 * @param {Number} caseId - 病例ID
 */
function showCaseDetail(caseId) {
    // 查找病例
    const caseItem = taviCases.find(item => item.id === caseId);
    if (!caseItem) return;
    
    // 填充模态框数据
    document.getElementById('modal-age').textContent = caseItem.Basic_Info.Age;
    document.getElementById('modal-gender').textContent = caseItem.Basic_Info.Gender === 'Male' ? '男' : caseItem.Basic_Info.Gender === 'Female' ? '女' : 'N/A';
    document.getElementById('modal-case').textContent = caseItem.Basic_Info.Case;
    document.getElementById('modal-history').textContent = caseItem.Basic_Info.Previous_History;
    
    document.getElementById('modal-pre-mean-gradient').textContent = caseItem.Pre_Info.Mean_Gradient;
    document.getElementById('modal-pre-peak-gradient').textContent = caseItem.Pre_Info.Peak_Gradients;
    document.getElementById('modal-pre-valve-area').textContent = caseItem.Pre_Info.Valve_Area;
    document.getElementById('modal-pre-max-velocity').textContent = caseItem.Pre_Info.Maximum_Velocity;
    document.getElementById('modal-pre-ef').textContent = caseItem.Pre_Info.Ejection_Fraction;
    
    document.getElementById('modal-valve-type').textContent = caseItem.Procedure.Valve_Type;
    document.getElementById('modal-valve-diameter').textContent = caseItem.Procedure.Valve_Diameter;
    
    document.getElementById('modal-death').textContent = caseItem.Result.Death === true ? '是' : '否';
    document.getElementById('modal-leak').textContent = caseItem.Result.Paravalvular_Leak === true ? '是' : '否';
    document.getElementById('modal-post-mean-gradient').textContent = caseItem.Result.Mean_Gradient;
    document.getElementById('modal-post-peak-gradient').textContent = caseItem.Result.Peak_Gradients;
    document.getElementById('modal-post-valve-area').textContent = caseItem.Result.Valve_Area;
    document.getElementById('modal-post-max-velocity').textContent = caseItem.Result.Maximum_Velocity;
    
    // 填充报告信息
    document.getElementById('modal-doi').textContent = caseItem.doi || 'N/A';
    document.getElementById('modal-title').textContent = caseItem.title || 'N/A';
    
    // 处理PDF和图片按钮
    const openPdfBtn = document.getElementById('open-pdf-btn');
    const viewImagesBtn = document.getElementById('view-images-btn');
    
    // 检查是否有PDF文件
    if (caseItem.Files && caseItem.Files.PDF) {
        openPdfBtn.disabled = false;
        openPdfBtn.onclick = () => {
            // 使用Chrome打开PDF文件
            const pdfPath = caseItem.Files.PDF;
            
            // 尝试使用file协议打开
            try {
                // 对路径进行编码，确保特殊字符正确处理
                const encodedPath = encodeURI(`file:///${pdfPath}`);
                window.open(encodedPath, '_blank');
            } catch (error) {
                console.error('无法打开PDF文件:', error);
                alert('无法打开PDF文件，请检查文件路径是否正确。\n路径: ' + pdfPath);
            }
        };
    } else {
        openPdfBtn.disabled = true;
    }
    
    // 设置图片按钮事件
    viewImagesBtn.disabled = false;
    viewImagesBtn.onclick = () => {
        // 打开图片查看页面
        window.open(`case-images.html?id=${caseItem.id}`, '_blank');
    };
    
    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('case-detail-modal'));
    modal.show();
}

/**
 * 应用筛选
 * 根据用户选择的条件筛选病例
 */
function applyFilters() {
    // 获取筛选条件
    const ageMin = document.getElementById('age-min').value;
    const ageMax = document.getElementById('age-max').value;
    const genderMale = document.getElementById('gender-male').checked;
    const genderFemale = document.getElementById('gender-female').checked;
    
    // 获取选中的瓣膜直径
    const selectedValveDiameters = [];
    document.querySelectorAll('.valve-diameter-checkboxes input[type="checkbox"]:checked').forEach(checkbox => {
        selectedValveDiameters.push(checkbox.value);
    });
    
    const meanGradientMin = document.getElementById('mean-gradient-min').value;
    const meanGradientMax = document.getElementById('mean-gradient-max').value;
    const paravalvularLeak = document.getElementById('paravalvular-leak').checked;
    const death = document.getElementById('death').checked;
    
    // 获取选中的瓣膜类型
    const selectedValveTypes = [];
    document.querySelectorAll('.valve-type-checkboxes input[type="checkbox"]:checked').forEach(checkbox => {
        selectedValveTypes.push(checkbox.value);
    });
    
    // 筛选病例
    filteredCases = taviCases.filter(caseItem => {
        // 年龄筛选
        if (ageMin && ageMax) {
            const age = parseInt(caseItem.Basic_Info.Age.replace(/\D/g, ''));
            if (isNaN(age) || age < parseInt(ageMin) || age > parseInt(ageMax)) {
                return false;
            }
        } else if (ageMin) {
            const age = parseInt(caseItem.Basic_Info.Age.replace(/\D/g, ''));
            if (isNaN(age) || age < parseInt(ageMin)) {
                return false;
            }
        } else if (ageMax) {
            const age = parseInt(caseItem.Basic_Info.Age.replace(/\D/g, ''));
            if (isNaN(age) || age > parseInt(ageMax)) {
                return false;
            }
        }
        
        // 性别筛选
        if (genderMale && genderFemale) {
            // 两者都选，不筛选
        } else if (genderMale) {
            if (caseItem.Basic_Info.Gender !== 'Male') {
                return false;
            }
        } else if (genderFemale) {
            if (caseItem.Basic_Info.Gender !== 'Female') {
                return false;
            }
        }
        
        // 瓣膜类型筛选
        if (selectedValveTypes.length > 0 && !selectedValveTypes.includes(caseItem.Procedure.Valve_Type)) {
            return false;
        }
        
        // 瓣膜直径筛选
        if (selectedValveDiameters.length > 0 && !selectedValveDiameters.includes(caseItem.Procedure.Valve_Diameter)) {
            return false;
        }
        
        // 平均跨瓣压差筛选
        if (meanGradientMin || meanGradientMax) {
            const meanGradient = parseFloat(caseItem.Pre_Info.Mean_Gradient);
            if (isNaN(meanGradient)) {
                return false;
            }
            
            if (meanGradientMin && meanGradient < parseFloat(meanGradientMin)) {
                return false;
            }
            
            if (meanGradientMax && meanGradient > parseFloat(meanGradientMax)) {
                return false;
            }
        }
        
        // 瓣周漏筛选
        if (paravalvularLeak && caseItem.Result.Paravalvular_Leak !== true) {
            return false;
        }
        
        // 死亡筛选
        if (death && caseItem.Result.Death !== true) {
            return false;
        }
        
        return true;
    });
    
    // 更新统计数据
    updateStatistics(filteredCases);
    
    // 更新图表
    updateCharts();
    
    // 渲染病例列表
    renderCaseList(filteredCases);
}

/**
 * 重置筛选
 * 清除所有筛选条件并显示所有病例
 */
function resetFilters() {
    // 重置所有筛选条件
    document.getElementById('age-min').value = '';
    document.getElementById('age-max').value = '';
    document.getElementById('gender-male').checked = false;
    document.getElementById('gender-female').checked = false;
    document.getElementById('mean-gradient-min').value = '';
    document.getElementById('mean-gradient-max').value = '';
    document.getElementById('paravalvular-leak').checked = false;
    document.getElementById('death').checked = false;
    
    // 重置瓣膜直径选择
    document.querySelectorAll('.valve-diameter-checkboxes input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    updateValveDiameterHeader();
    
    // 重置瓣膜类型选择
    document.querySelectorAll('.valve-type-checkboxes input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    updateValveTypeHeader();
    
    // 重置筛选结果
    filteredCases = [...taviCases];
    
    // 更新统计数据
    updateStatistics(filteredCases);
    
    // 更新图表
    updateCharts();
    
    // 渲染病例列表
    renderCaseList(filteredCases);
}

/**
 * 更新图表
 * 根据当前筛选结果重新生成所有图表
 */
function updateCharts() {
    // 销毁旧图表
    if (valveTypeChart) valveTypeChart.destroy();
    if (valveDiameterChart) valveDiameterChart.destroy();
    if (prePostComparisonChart) prePostComparisonChart.destroy();
    
    // 初始化新图表
    initValveTypeChart();
    initValveDiameterChart();
    initPrePostComparisonChart();
}

/**
 * 排序病例
 * 根据指定字段对病例进行排序
 * @param {String} sortBy - 排序字段：'match'(ID), 'age'(年龄), 'year'(年份)
 */
function sortCases(sortBy) {
    // 移除所有按钮的高亮状态
    document.querySelectorAll('.btn-outline-primary').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 为当前排序按钮添加高亮状态
    document.getElementById(`sort-by-${sortBy}`).classList.add('active');
    
    // 切换排序方向
    sortStates[sortBy].ascending = !sortStates[sortBy].ascending;
    
    // 更新箭头图标
    updateSortArrow(sortBy);
    
    if (sortBy === 'age') {
        // 按年龄排序，N/A排在最后
        filteredCases.sort((a, b) => {
            const ageA = a.Basic_Info.Age;
            const ageB = b.Basic_Info.Age;
            
            // 如果都是N/A，保持原顺序
            if (ageA === '-1' && ageB === '-1') return 0;
            // 如果只有一个是N/A，将其排在最后
            if (ageA === '-1') return 1;
            if (ageB === '-1') return -1;
            
            // 提取数字部分进行比较
            const numA = parseInt(ageA.replace(/\D/g, ''));
            const numB = parseInt(ageB.replace(/\D/g, ''));
            
            return sortStates[sortBy].ascending ? numA - numB : numB - numA;
        });
    } else if (sortBy === 'match') {
        // 按ID排序，N/A排在最后
        filteredCases.sort((a, b) => {
            const idA = a.id;
            const idB = b.id;
            
            // 如果都是N/A，保持原顺序
            if (idA === 'N/A' && idB === 'N/A') return 0;
            // 如果只有一个是N/A，将其排在最后
            if (idA === 'N/A') return 1;
            if (idB === 'N/A') return -1;
            
            return sortStates[sortBy].ascending ? idA - idB : idB - idA;
        });
    } else if (sortBy === 'year') {
        // 按年份排序，N/A排在最后
        filteredCases.sort((a, b) => {
            const yearA = a.year;
            const yearB = b.year;
            
            // 如果都是N/A，保持原顺序
            if (yearA === 'N/A' && yearB === 'N/A') return 0;
            // 如果只有一个是N/A，将其排在最后
            if (yearA === 'N/A') return 1;
            if (yearB === 'N/A') return -1;
            
            return sortStates[sortBy].ascending ? yearA - yearB : yearB - yearA;
        });
    }
    
    // 渲染病例列表
    renderCaseList(filteredCases);
}

/**
 * 更新排序箭头图标
 * 根据排序方向更新箭头指示
 * @param {String} sortBy - 排序字段
 */
function updateSortArrow(sortBy) {
    const arrow = document.getElementById(`sort-by-${sortBy}-arrow`);
    if (sortStates[sortBy].ascending) {
        arrow.className = 'bi bi-arrow-up';
    } else {
        arrow.className = 'bi bi-arrow-down';
    }
}

/**
 * 辅助函数：截断文本
 * 如果文本长度超过指定值，截断并添加省略号
 * @param {String} text - 原始文本
 * @param {Number} maxLength - 最大长度
 * @returns {String} 处理后的文本
 */
function truncateText(text, maxLength) {
    if (text === 'N/A') return text;
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

/**
 * 更新瓣膜直径选择器的显示文本
 * 根据选中的瓣膜直径更新筛选器标题
 */
function updateValveDiameterHeader() {
    const checkedBoxes = document.querySelectorAll('.valve-diameter-checkboxes input[type="checkbox"]:checked');
    const headerSpan = valveDiameterHeaderEl.querySelector('span');
    
    if (checkedBoxes.length === 0) {
        headerSpan.textContent = '全部';
    } else {
        // const selectedSizes = Array.from(checkedBoxes).map(cb => cb.value);
        // headerSpan.textContent = selectedSizes.join(', ');
        headerSpan.textContent = `已选 ${checkedBoxes.length} 项`;
    }
}

/**
 * 更新瓣膜类型选择器的显示文本
 * 根据选中的瓣膜类型更新筛选器标题
 */
function updateValveTypeHeader() {
    const checkedBoxes = document.querySelectorAll('.valve-type-checkboxes input[type="checkbox"]:checked');
    const headerSpan = valveTypeHeaderEl.querySelector('span');
    
    if (checkedBoxes.length === 0) {
        headerSpan.textContent = '全部';
    } else {
        
        headerSpan.textContent = `已选 ${checkedBoxes.length} 项`;
    }
}

/**
 * 发送聊天消息
 * 发送用户输入的消息并获取AI回复
 */
async function sendChatMessage() {
    const message = chatInputEl.value.trim();
    if (!message) return;
    
    // 清空输入框
    chatInputEl.value = '';
    
    // 添加用户消息到聊天窗口
    addMessageToChat('user', message);
    
    // 添加到聊天历史
    chatHistory.push({ role: 'user', content: message });
    
    try {
        // 显示加载状态
        const loadingMsgId = addMessageToChat('system', '<div class="typing-indicator"><span></span><span></span><span></span></div>');
        
        // 调用API获取回复
        const response = await callGptApi(message);
        
        // 移除加载状态
        removeMessage(loadingMsgId);
        
        // 添加AI回复到聊天窗口
        addMessageToChat('system', response);
        
        // 添加回复到聊天历史
        chatHistory.push({ role: 'assistant', content: response });
    } catch (error) {
        console.error('获取AI回复时出错:', error);
        // 显示错误消息
        addMessageToChat('system', '抱歉，我遇到了一些问题，请稍后再试。');
    }
    
    // 滚动到底部
    scrollChatToBottom();
}

/**
 * 调用GPT API
 * 向Azure OpenAI服务发送请求并获取回复
 * @param {String} message - 用户消息
 * @returns {Promise<String>} AI回复内容
 */
async function callGptApi(message) {
    // 准备API请求参数
    const messages = [
        { role: 'system', content: '你是TAVI/TAVR（经导管主动脉瓣植入/置换术）领域的专家助手。你擅长回答有关TAVI/TAVR手术、主动脉瓣狭窄、瓣膜类型、手术结果和并发症等相关问题。请提供专业、准确、简洁的回答。' },
        ...chatHistory.slice(-10), // 保留最近10条消息作为上下文
    ];
    
    // 添加当前筛选条件的上下文信息
    const {context, ids} = getFilterContext();
    if (context) {
        messages.push({ role: 'system', content: context});
    }

    try {
        const endpoint = `${gptConfig.api_base}`;
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': gptConfig.api_key
            },
            body: JSON.stringify({
                messages: messages,
                model: gptConfig.model,
                temperature: gptConfig.temperature,
                max_tokens: gptConfig.max_tokens
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API请求失败: ${response.status} ${JSON.stringify(errorData)}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('API调用失败:', error);
        throw error;
    }
}

// 获取当前筛选条件的上下文
function getFilterContext() {
    // 如果没有应用筛选，则返回null
    if (filteredCases.length === taviCases.length) {
        return {context: null, ids: null};
    }
    
    // 收集筛选条件信息
    const gender = [];
    if (document.getElementById('gender-male').checked) gender.push('男性');
    if (document.getElementById('gender-female').checked) gender.push('女性');
    
    const outcomes = [];
    if (document.getElementById('paravalvular-leak').checked) outcomes.push('瓣周漏');
    if (document.getElementById('death').checked) outcomes.push('死亡');
    
    const ageMin = document.getElementById('age-min').value;
    const ageMax = document.getElementById('age-max').value;
    
    const valveTypes = Array.from(document.querySelectorAll('.valve-type-checkboxes input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    const valveDiameters = Array.from(document.querySelectorAll('.valve-diameter-checkboxes input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    const mgMin = document.getElementById('mean-gradient-min').value;
    const mgMax = document.getElementById('mean-gradient-max').value;
    
    // 构建上下文字符串
    let context = '当前筛选条件：';
    const conditions = [];
    
    if (gender.length > 0) conditions.push(`性别为${gender.join('或')}`);
    if (outcomes.length > 0) conditions.push(`术后结果包括${outcomes.join('或')}`);
    if (ageMin && ageMax) conditions.push(`年龄在${ageMin}到${ageMax}岁之间`);
    else if (ageMin) conditions.push(`年龄大于等于${ageMin}岁`);
    else if (ageMax) conditions.push(`年龄小于等于${ageMax}岁`);
    
    if (valveTypes.length > 0) conditions.push(`瓣膜类型为${valveTypes.join('、')}`);
    if (valveDiameters.length > 0) conditions.push(`瓣膜直径为${valveDiameters.join('、')}`);
    
    if (mgMin && mgMax) conditions.push(`术前平均跨瓣压差在${mgMin}到${mgMax} mmHg之间`);
    else if (mgMin) conditions.push(`术前平均跨瓣压差大于等于${mgMin} mmHg`);
    else if (mgMax) conditions.push(`术前平均跨瓣压差小于等于${mgMax} mmHg`);
    
    if (conditions.length === 0) {
        return null;
    }
    
    context += conditions.join('，') + '。';
    context += `筛选结果共有${filteredCases.length}个病例。`;

    ids = filteredCases.map(item => item.id);

    // 遍历ids前十位（如果ids小于10，则全部遍历）
    if (ids.length > 10) {
        ids = ids.slice(0, 10);
    }

    context += `以下是筛选结果的标题和摘要：\n`;

    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const case_info = taviCases.find(item => item.id === id);
        context += `病例${id}的摘要：${case_info.abstract}`;
    }
    
    return {context, ids};
}

// 添加消息到聊天窗口
function addMessageToChat(role, content) {
    const messageId = 'msg-' + Date.now();
    const messageEl = document.createElement('div');
    messageEl.className = `message ${role}`;
    messageEl.id = messageId;
    
    const contentEl = document.createElement('div');
    contentEl.className = 'message-content';
    contentEl.innerHTML = formatMessage(content);
    
    messageEl.appendChild(contentEl);
    chatMessagesEl.appendChild(messageEl);
    
    // 滚动到底部
    scrollChatToBottom();
    
    return messageId;
}

// 移除消息
function removeMessage(messageId) {
    const messageEl = document.getElementById(messageId);
    if (messageEl) {
        messageEl.remove();
    }
}

// 格式化消息（支持简单的Markdown格式）
function formatMessage(message) {
    if (typeof message !== 'string') {
        return message;
    }
    
    // 转换换行符为<br>
    let formatted = message.replace(/\n/g, '<br>');
    
    // 转换Markdown风格的链接和加粗
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    return formatted;
}

// 滚动聊天窗口到底部
function scrollChatToBottom() {
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

// 清空聊天历史
function clearChatHistory() {
    // 清空聊天历史
    chatHistory = [];
    
    // 清空聊天窗口
    chatMessagesEl.innerHTML = '';
    
    // 添加欢迎消息
    addMessageToChat('system', '<p>你好！我是TAVI/TAVR智能助手，有任何关于TAVI/TAVR手术、瓣膜类型、病例分析的问题，请随时向我提问。</p>');
} 
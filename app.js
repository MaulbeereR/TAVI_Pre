// DOM元素
const caseListEl = document.getElementById('case-list');
const totalCasesEl = document.getElementById('total-cases');
const filteredCasesEl = document.getElementById('filtered-cases');
const leakRateEl = document.getElementById('leak-rate');
const deathRateEl = document.getElementById('death-rate');
const applyFilterBtn = document.getElementById('apply-filter');
const resetFilterBtn = document.getElementById('reset-filter');
const sortByMatchBtn = document.getElementById('sort-by-match');
const sortByAgeBtn = document.getElementById('sort-by-age');
const sortByYearBtn = document.getElementById('sort-by-year');

// 图表实例
let valveTypeChart;
let valveDiameterChart;
let prePostComparisonChart;

// 当前筛选后的病例
let filteredCases = [];

// 排序状态
let sortStates = {
    match: { ascending: true },
    age: { ascending: true },
    year: { ascending: true }
};

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    // 初始化数据
    initializeData();
    
    // 绑定事件
    bindEvents();
    
    // 初始化图表
    initializeCharts();
});

// 初始化数据
function initializeData() {
    // 设置总病例数
    totalCasesEl.textContent = taviCases.length;
    
    // 初始显示所有病例
    filteredCases = [...taviCases];
    filteredCasesEl.textContent = filteredCases.length;
    
    // 计算并显示瓣周漏率和死亡率
    updateStatistics(filteredCases);
    
    // 渲染病例列表
    renderCaseList(filteredCases);
}

// 绑定事件
function bindEvents() {
    // 应用筛选按钮
    applyFilterBtn.addEventListener('click', applyFilters);
    
    // 重置筛选按钮
    resetFilterBtn.addEventListener('click', resetFilters);
    
    // 排序按钮
    sortByMatchBtn.addEventListener('click', () => sortCases('match'));
    sortByAgeBtn.addEventListener('click', () => sortCases('age'));
    sortByYearBtn.addEventListener('click', () => sortCases('year'));
}

// 初始化图表
function initializeCharts() {
    // 瓣膜类型分布图表
    initValveTypeChart();
    
    // 瓣膜直径分布图表
    initValveDiameterChart();
    
    // 术前术后指标对比图表
    initPrePostComparisonChart();
}

// 初始化瓣膜类型分布图表
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
        'Sapien XT': 'rgba(255, 99, 132, 0.7)',
        'Edwards-Sapien S3': 'rgba(84, 137, 194, 0.7)',
        'CoreValve': 'rgba(255, 206, 86, 0.7)',
        'Edwards CENTERA TM 29': 'rgba(15, 127, 95, 0.7)',
        'CoreValve EvolutR': 'rgba(161, 131, 223, 0.7)',
        'Lotus valve': 'rgba(194, 153, 133, 0.7)',
        'CoreValveTM': 'rgba(220, 53, 69, 0.7)',
        'SAPIEN 3': 'rgba(40, 167, 69, 0.7)',
        'Evolut RT': 'rgba(75, 192, 192, 1)',
        'Medtronic CoreValve Evolut R': 'rgba(142, 99, 221, 0.7)',
        'MOSAIC bioprosthesis': 'rgba(253, 126, 20, 0.7)'
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
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: '瓣膜类型分布'
                }
            }
        }
    });
}

// 初始化瓣膜直径分布图表
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
    
    // 准备图表数据
    const labels = Object.keys(valveDiameters);
    const data = Object.values(valveDiameters);
    
    // 创建图表
    valveDiameterChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '病例数量',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '病例数量'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '瓣膜直径'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '瓣膜直径分布'
                }
            }
        }
    });
}

// 初始化术前术后指标对比图表
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
    
    // 创建图表
    prePostComparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: caseLabels,
            datasets: [
                {
                    label: '术前平均跨瓣压差 (mmHg)',
                    data: preMeanGradients,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: '术后平均跨瓣压差 (mmHg)',
                    data: postMeanGradients,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '平均跨瓣压差 (mmHg)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '术前术后平均跨瓣压差对比'
                }
            }
        }
    });
}

// 更新统计数据
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

// 渲染病例列表
function renderCaseList(cases) {
    // 清空列表
    caseListEl.innerHTML = '';
    
    // 添加病例行
    cases.forEach(caseItem => {
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
}

// 显示病例详情
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
    document.getElementById('modal-year').textContent = caseItem.year || 'N/A';
    document.getElementById('modal-source').textContent = caseItem.source || 'N/A';
    document.getElementById('modal-title').textContent = caseItem.title || 'N/A';
    document.getElementById('modal-author').textContent = caseItem.author || 'N/A';
    document.getElementById('modal-pmid').textContent = caseItem.pmid || 'N/A';
    
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
    
    // 检查是否有图片
    if (caseItem.Files && caseItem.Files.Images && caseItem.Files.Images.length > 0) {
        viewImagesBtn.disabled = false;
        viewImagesBtn.onclick = () => {
            // 打开图片查看页面
            window.open(`case-images.html?id=${caseItem.id}`, '_blank');
        };
    } else {
        viewImagesBtn.disabled = true;
    }
    
    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('case-detail-modal'));
    modal.show();
}

// 应用筛选
function applyFilters() {
    // 获取筛选条件
    const ageMin = document.getElementById('age-min').value;
    const ageMax = document.getElementById('age-max').value;
    const genderMale = document.getElementById('gender-male').checked;
    const genderFemale = document.getElementById('gender-female').checked;
    const valveType = document.getElementById('valve-type').value;
    const valveDiameter = document.getElementById('valve-diameter').value;
    const meanGradientMin = document.getElementById('mean-gradient-min').value;
    const meanGradientMax = document.getElementById('mean-gradient-max').value;
    const valveAreaMin = document.getElementById('valve-area-min').value;
    const valveAreaMax = document.getElementById('valve-area-max').value;
    const paravalvularLeak = document.getElementById('paravalvular-leak').checked;
    const death = document.getElementById('death').checked;
    
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
        if (valveType && caseItem.Procedure.Valve_Type !== valveType) {
            return false;
        }
        
        // 瓣膜直径筛选
        if (valveDiameter && caseItem.Procedure.Valve_Diameter !== valveDiameter) {
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
        
        // 瓣膜面积筛选
        if (valveAreaMin || valveAreaMax) {
            const valveArea = parseFloat(caseItem.Pre_Info.Valve_Area);
            if (isNaN(valveArea)) {
                return false;
            }
            
            if (valveAreaMin && valveArea < parseFloat(valveAreaMin)) {
                return false;
            }
            
            if (valveAreaMax && valveArea > parseFloat(valveAreaMax)) {
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

// 重置筛选
function resetFilters() {
    // 重置表单
    document.getElementById('filter-form').reset();
    
    // 重置筛选结果
    filteredCases = [...taviCases];
    
    // 更新统计数据
    updateStatistics(filteredCases);
    
    // 更新图表
    updateCharts();
    
    // 渲染病例列表
    renderCaseList(filteredCases);
}

// 更新图表
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

// 排序病例
function sortCases(sortBy) {
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
            if (ageA === 'N/A' && ageB === 'N/A') return 0;
            // 如果只有一个是N/A，将其排在最后
            if (ageA === 'N/A') return 1;
            if (ageB === 'N/A') return -1;
            
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

// 更新排序箭头图标
function updateSortArrow(sortBy) {
    const arrow = document.getElementById(`sort-by-${sortBy}-arrow`);
    if (sortStates[sortBy].ascending) {
        arrow.className = 'bi bi-arrow-up';
    } else {
        arrow.className = 'bi bi-arrow-down';
    }
}

// 辅助函数：截断文本
function truncateText(text, maxLength) {
    if (text === 'N/A') return text;
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
} 
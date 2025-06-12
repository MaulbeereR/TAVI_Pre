// 全局变量
let allCases = [];
let filteredCases = [];
let currentPage = 1;
const casesPerPage = 20;
let charts = {};
let currentFilters = {};

// API配置
const API_BASE_URL = 'http://localhost:5000/api';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
async function initializeApp() {
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化图表
    initializeCharts();
    
    // 加载初始数据
    await loadInitialData();
}

// 加载初始数据
async function loadInitialData() {
    try {
        // 显示加载状态
        showLoading(true);
        
        // 并行加载统计数据、图表数据和表格数据
        await Promise.all([
            loadStatistics(),
            loadChartData(),
            loadTableData()
        ]);
        
        showLoading(false);
    } catch (error) {
        console.error('数据加载失败:', error);
        showLoading(false);
        showError('数据加载失败，请检查网络连接或联系管理员');
    }
}

// 加载统计数据
async function loadStatistics(filters = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}/statistics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filters })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        updateStatisticsDisplay(data);
        return data;
    } catch (error) {
        console.error('统计数据加载失败:', error);
        throw error;
    }
}

// 加载图表数据
async function loadChartData(filters = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}/charts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filters })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        updateChartsWithData(data);
        return data;
    } catch (error) {
        console.error('图表数据加载失败:', error);
        throw error;
    }
}

// 加载表格数据
async function loadTableData(filters = {}, page = 1, pageSize = 20) {
    try {
        const response = await fetch(`${API_BASE_URL}/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                filters, 
                page, 
                page_size: pageSize 
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        updateTableDisplay(data);
        return data;
    } catch (error) {
        console.error('表格数据加载失败:', error);
        throw error;
    }
}

// 生成模拟数据
function generateMockData() {
    const mockData = [];
    const valveTypes = ['Edwards SAPIEN', 'Evolut', 'ACURATE Neo', 'CoreValve'];
    const genders = ['Male', 'Female'];
    const nyhaClasses = ['I', 'II', 'III'];
    
    for (let i = 1; i <= 1300; i++) {
        mockData.push({
            id: i,
            age: Math.floor(Math.random() * 30) + 60, // 60-90岁
            sex: genders[Math.floor(Math.random() * genders.length)],
            valve_type: valveTypes[Math.floor(Math.random() * valveTypes.length)],
            valve_diameter: Math.floor(Math.random() * 10) + 20, // 20-30mm
            pre_mean_gradient: Math.floor(Math.random() * 40) + 30, // 30-70mmHg
            nyha_class: nyhaClasses[Math.floor(Math.random() * nyhaClasses.length)],
            paravalvular_leak: Math.random() < 0.33,
            death: Math.random() < 0.13,
            bmi: (Math.random() * 10 + 20).toFixed(1), // 20-30
            atrial_fibrillation: Math.random() < 0.3,
            lvef: Math.floor(Math.random() * 40) + 40, // 40-80%
            diabetes: Math.random() < 0.25,
            hypertension: Math.random() < 0.6
        });
    }
    
    return mockData;
}

// 绑定事件监听器
function bindEventListeners() {
    // 筛选按钮
    const applyBtn = document.getElementById('apply-important-filters');
    const resetBtn = document.getElementById('reset-important-filters');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    // 视图切换按钮
    document.getElementById('chart-view-btn').addEventListener('click', () => switchView('chart'));
    document.getElementById('table-view-btn').addEventListener('click', () => switchView('table'));
    
    // 瓣膜类型下拉选择器
    const valveTypeHeader = document.getElementById('valve-type-header');
    const valveTypeDropdown = document.getElementById('valve-type-dropdown');
    
    if (valveTypeHeader && valveTypeDropdown) {
        valveTypeHeader.addEventListener('click', function() {
            const isVisible = valveTypeDropdown.style.display === 'block';
            valveTypeDropdown.style.display = isVisible ? 'none' : 'block';
        });
        
        // 点击外部关闭下拉菜单
        document.addEventListener('click', function(e) {
            if (!valveTypeHeader.contains(e.target) && !valveTypeDropdown.contains(e.target)) {
                valveTypeDropdown.style.display = 'none';
            }
        });
    }
    
    // 折叠面板图标旋转
    document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(element => {
        element.addEventListener('click', function() {
            const icon = this.querySelector('.toggle-icon');
            if (icon) {
                setTimeout(() => {
                    const isCollapsed = this.classList.contains('collapsed');
                    icon.style.transform = isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
                }, 100);
            }
        });
    });

    // 导出数据按钮
    const exportBtn = document.getElementById('export-data');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
}

// 应用筛选
async function applyFilters() {
    try {
        showLoading(true);
        
        // 收集筛选条件
        const filters = collectFilterValues();
        currentFilters = filters;
        
        // 重置到第一页
        currentPage = 1;
        
        // 并行加载所有数据
        await Promise.all([
            loadStatistics(filters),
            loadChartData(filters),
            loadTableData(filters, currentPage, casesPerPage)
        ]);
        
        showLoading(false);
        showFilterResult();
        
    } catch (error) {
        console.error('筛选失败:', error);
        showLoading(false);
        showError('筛选失败，请重试');
    }
}

// 收集筛选条件
function collectFilterValues() {
    const filters = {};
    
    // 基线资料
    const ageMin = document.getElementById('age-min')?.value;
    const ageMax = document.getElementById('age-max')?.value;
    if (ageMin) filters.age_min = parseInt(ageMin);
    if (ageMax) filters.age_max = parseInt(ageMax);
    
    // 性别筛选
    const genderValues = [];
    if (document.getElementById('gender-male')?.checked) genderValues.push('Male');
    if (document.getElementById('gender-female')?.checked) genderValues.push('Female');
    if (genderValues.length > 0) filters.gender = genderValues;
    
    // BMI筛选
    const bmiMin = document.getElementById('bmi-min')?.value;
    const bmiMax = document.getElementById('bmi-max')?.value;
    if (bmiMin) filters.bmi_min = parseFloat(bmiMin);
    if (bmiMax) filters.bmi_max = parseFloat(bmiMax);
    
    // 房颤筛选
    const atrialFib = document.getElementById('atrial-fibrillation')?.value;
    if (atrialFib !== '') filters.atrial_fibrillation = atrialFib === 'true';
    
    // NYHA分级筛选
    const nyhaValues = [];
    ['1', '2', '3', '4'].forEach(grade => {
        const checkbox = document.getElementById(`nyha-${grade}`);
        if (checkbox?.checked) {
            nyhaValues.push(['I', 'II', 'III', 'IV'][parseInt(grade) - 1]);
        }
    });
    if (nyhaValues.length > 0) filters.nyha_classification = nyhaValues;
    
    // 术前影像学评估
    const lvefMin = document.getElementById('lvef-min')?.value;
    const lvefMax = document.getElementById('lvef-max')?.value;
    if (lvefMin) filters.lvef_min = parseFloat(lvefMin);
    if (lvefMax) filters.lvef_max = parseFloat(lvefMax);
    
    const maxGradientMin = document.getElementById('max-gradient-min')?.value;
    const maxGradientMax = document.getElementById('max-gradient-max')?.value;
    if (maxGradientMin) filters.aortic_valve_peak_pg_min = parseFloat(maxGradientMin);
    if (maxGradientMax) filters.aortic_valve_peak_pg_max = parseFloat(maxGradientMax);
    
    const meanGradientMin = document.getElementById('mean-gradient-min')?.value;
    const meanGradientMax = document.getElementById('mean-gradient-max')?.value;
    if (meanGradientMin) filters.aortic_valve_mean_pg_min = parseFloat(meanGradientMin);
    if (meanGradientMax) filters.aortic_valve_mean_pg_max = parseFloat(meanGradientMax);
    
    // 手术信息
    const transfemoralAccess = document.getElementById('transfemoral-access')?.value;
    if (transfemoralAccess !== '') filters.transfemoral_access = transfemoralAccess === 'true';
    
    const transapicalAccess = document.getElementById('transapical-access')?.value;
    if (transapicalAccess !== '') filters.transapical_access = transapicalAccess === 'true';
    
    // 瓣膜尺寸
    const valveSizes = [];
    ['23', '26', '29'].forEach(size => {
        const checkbox = document.getElementById(`valve-size-${size}`);
        if (checkbox?.checked) {
            valveSizes.push(parseFloat(size));
        }
    });
    if (valveSizes.length > 0) filters.thv_size = valveSizes;
    
    const valveType = document.getElementById('valve-type')?.value;
    if (valveType) filters.thv_type = valveType;
    
    const valveBrand = document.getElementById('valve-brand')?.value;
    if (valveBrand) filters.thv_brand = valveBrand;
    
    // 出院前评价
    const deathBeforeDischarge = document.getElementById('death-before-discharge')?.value;
    if (deathBeforeDischarge !== '') filters.death_before_discharge = deathBeforeDischarge === 'true';
    
    const strokeBeforeDischarge = document.getElementById('stroke-before-discharge')?.value;
    if (strokeBeforeDischarge !== '') filters.stroke_before_discharge = strokeBeforeDischarge === 'true';
    
    const majorBleeding = document.getElementById('major-bleeding')?.value;
    if (majorBleeding !== '') filters.major_bleeding = majorBleeding === 'true';
    
    const pacemakerImplantation = document.getElementById('pacemaker-implantation')?.value;
    if (pacemakerImplantation !== '') filters.pacemaker_implantation = pacemakerImplantation === 'true';
    
    // 随访信息
    const mortality30d = document.getElementById('death-30-days')?.value;
    if (mortality30d !== '') filters.mortality_30d = mortality30d === 'true';
    
    const mortality1y = document.getElementById('death-1-year')?.value;
    if (mortality1y !== '') filters.mortality_1y = mortality1y === 'true';
    
    return filters;
}

// 显示加载状态
function showLoading(show) {
    const loadingElements = document.querySelectorAll('.loading-indicator');
    if (loadingElements.length === 0) {
        // 如果没有加载指示器，创建一个简单的
        if (show) {
            const loader = document.createElement('div');
            loader.className = 'loading-indicator';
            loader.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">加载中...</span></div>';
            loader.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999; background: rgba(255,255,255,0.9); padding: 20px; border-radius: 8px;';
            document.body.appendChild(loader);
        } else {
            const loader = document.querySelector('.loading-indicator');
            if (loader) loader.remove();
        }
    } else {
        loadingElements.forEach(el => {
            el.style.display = show ? 'block' : 'none';
        });
    }
}

// 显示错误信息
function showError(message) {
    // 创建一个简单的错误提示
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
    errorDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(errorDiv);
    
    // 5秒后自动移除
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// 更新统计数据显示
function updateStatisticsDisplay(data) {
    if (data) {
        document.getElementById('total-cases').textContent = data.total_cases || 0;
        document.getElementById('filtered-cases').textContent = data.filtered_cases || 0;
        document.getElementById('leak-rate').textContent = data.pvl_rate || '0%';
        document.getElementById('death-rate').textContent = data.death_rate || '0%';
    }
}

// 更新图表数据
function updateChartsWithData(data) {
    if (!data) return;
    
    // 更新年龄分布图
    if (charts.ageDistribution && data.age_distribution) {
        const labels = data.age_distribution.map(item => item.age_group);
        const values = data.age_distribution.map(item => item.count);
        
        charts.ageDistribution.data.labels = labels;
        charts.ageDistribution.data.datasets[0].data = values;
        charts.ageDistribution.update();
    }
    
    // 更新NYHA分级图
    if (charts.nyha && data.nyha_distribution) {
        const labels = data.nyha_distribution.map(item => item.nyha_classification);
        const values = data.nyha_distribution.map(item => item.count);
        
        charts.nyha.data.labels = labels;
        charts.nyha.data.datasets[0].data = values;
        charts.nyha.update();
    }
    
    // 更新瓣膜尺寸分布图
    if (charts.valveDiameter && data.valve_size_distribution) {
        const labels = data.valve_size_distribution.map(item => item.thv_size + 'mm');
        const values = data.valve_size_distribution.map(item => item.count);
        
        charts.valveDiameter.data.labels = labels;
        charts.valveDiameter.data.datasets[0].data = values;
        charts.valveDiameter.update();
    }
    
    // 更新并发症图
    if (charts.complications && data.complications) {
        const labels = data.complications.map(item => item.complication);
        const values = data.complications.map(item => item.count);
        
        charts.complications.data.labels = labels;
        charts.complications.data.datasets[0].data = values;
        charts.complications.update();
    }
}

// 更新表格显示
function updateTableDisplay(data) {
    if (!data || !data.data) return;
    
    const tbody = document.getElementById('case-list');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.data.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.patient_id || 'N/A'}</td>
            <td>${patient.age || 'N/A'}</td>
            <td>${patient.sex || 'N/A'}</td>
            <td>${patient.thv_type || 'N/A'}</td>
            <td>${patient.thv_size || 'N/A'}</td>
            <td>${patient.aortic_valve_mean_pg || 'N/A'}</td>
            <td>${patient.nyha_classification || 'N/A'}</td>
            <td>${patient.immediate_pvl_occurred ? '是' : '否'}</td>
            <td>${patient.mortality_30d || patient.mortality_1y || patient.death_before_discharge ? '是' : '否'}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="showCaseDetail('${patient.patient_id}')">
                    详情
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // 更新分页
    updatePaginationDisplay(data);
}

// 更新分页显示
function updatePaginationDisplay(data) {
    const pagination = document.getElementById('pagination');
    if (!pagination || !data) return;
    
    pagination.innerHTML = '';
    
    const totalPages = data.total_pages || 1;
    const currentPageNum = data.page || 1;
    
    // 上一页按钮
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPageNum === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPageNum - 1})">上一页</a>`;
    pagination.appendChild(prevLi);
    
    // 页码按钮
    const startPage = Math.max(1, currentPageNum - 2);
    const endPage = Math.min(totalPages, currentPageNum + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPageNum ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        pagination.appendChild(li);
    }
    
    // 下一页按钮
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPageNum === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPageNum + 1})">下一页</a>`;
    pagination.appendChild(nextLi);
}

// 重置筛选
async function resetFilters() {
    try {
        // 清空所有输入框
        document.querySelectorAll('.filter-content input[type="number"]').forEach(input => {
            input.value = '';
        });
        
        // 取消所有复选框
        document.querySelectorAll('.filter-content input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // 重置所有选择框
        document.querySelectorAll('.filter-content select').forEach(select => {
            select.selectedIndex = 0;
        });
        
        // 清空当前筛选条件
        currentFilters = {};
        currentPage = 1;
        
        // 重新加载所有数据
        await loadInitialData();
        
    } catch (error) {
        console.error('重置筛选失败:', error);
        showError('重置筛选失败，请重试');
    }
}

// 切换视图
function switchView(viewType) {
    const chartView = document.getElementById('chart-view');
    const tableView = document.getElementById('table-view');
    const chartBtn = document.getElementById('chart-view-btn');
    const tableBtn = document.getElementById('table-view-btn');
    
    if (viewType === 'chart') {
        chartView.style.display = 'block';
        tableView.style.display = 'none';
        chartBtn.classList.add('active');
        tableBtn.classList.remove('active');
        
        // 重新渲染图表以确保正确显示
        setTimeout(() => {
            Object.values(charts).forEach(chart => {
                if (chart && typeof chart.resize === 'function') {
                    chart.resize();
                }
            });
        }, 100);
    } else {
        chartView.style.display = 'none';
        tableView.style.display = 'block';
        chartBtn.classList.remove('active');
        tableBtn.classList.add('active');
    }
}

// 更新统计数据
function updateStatistics() {
    // 更新总病例数
    document.getElementById('total-cases').textContent = allCases.length;
    
    // 更新筛选病例数
    document.getElementById('filtered-cases').textContent = filteredCases.length;
    
    // 计算瓣周漏率
    const leakCases = filteredCases.filter(c => c.paravalvular_leak).length;
    const leakRate = filteredCases.length > 0 ? ((leakCases / filteredCases.length) * 100).toFixed(1) : 0;
    document.getElementById('leak-rate').textContent = leakRate + '%';
    
    // 计算死亡率
    const deathCases = filteredCases.filter(c => c.death).length;
    const deathRate = filteredCases.length > 0 ? ((deathCases / filteredCases.length) * 100).toFixed(1) : 0;
    document.getElementById('death-rate').textContent = deathRate + '%';
}

// 初始化图表
function initializeCharts() {
    // 瓣膜类型分布图
    createValveTypeChart();
    
    // 年龄分布图
    createAgeDistributionChart();
    
    // NYHA分级分布图
    createNyhaChart();
    
    // 瓣膜直径分布图
    createValveDiameterChart();
    
    // 术前术后指标对比图
    createPrePostComparisonChart();
    
    // 并发症发生率图
    createComplicationsChart();
}

// 创建瓣膜类型分布图
function createValveTypeChart() {
    const ctx = document.getElementById('valve-type-chart');
    if (!ctx) return;
    
    const valveTypeCounts = {};
    filteredCases.forEach(c => {
        valveTypeCounts[c.valve_type] = (valveTypeCounts[c.valve_type] || 0) + 1;
    });
    
    charts.valveType = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(valveTypeCounts),
            datasets: [{
                data: Object.values(valveTypeCounts),
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#f5576c',
                    '#4facfe',
                    '#00f2fe'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// 创建年龄分布图
function createAgeDistributionChart() {
    const ctx = document.getElementById('age-distribution-chart');
    if (!ctx) return;
    
    const ageRanges = {
        '60-65': 0,
        '66-70': 0,
        '71-75': 0,
        '76-80': 0,
        '81-85': 0,
        '86-90': 0
    };
    
    filteredCases.forEach(c => {
        const age = c.age;
        if (age >= 60 && age <= 65) ageRanges['60-65']++;
        else if (age >= 66 && age <= 70) ageRanges['66-70']++;
        else if (age >= 71 && age <= 75) ageRanges['71-75']++;
        else if (age >= 76 && age <= 80) ageRanges['76-80']++;
        else if (age >= 81 && age <= 85) ageRanges['81-85']++;
        else if (age >= 86 && age <= 90) ageRanges['86-90']++;
    });
    
    charts.ageDistribution = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(ageRanges),
            datasets: [{
                label: '病例数',
                data: Object.values(ageRanges),
                backgroundColor: '#667eea'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 创建NYHA分级分布图
function createNyhaChart() {
    const ctx = document.getElementById('nyha-chart');
    if (!ctx) return;
    
    const nyhaCounts = { 'I': 0, 'II': 0, 'III': 0 };
    filteredCases.forEach(c => {
        if (nyhaCounts.hasOwnProperty(c.nyha_class)) {
            nyhaCounts[c.nyha_class]++;
        }
    });
    
    charts.nyha = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(nyhaCounts),
            datasets: [{
                data: Object.values(nyhaCounts),
                backgroundColor: ['#4facfe', '#00f2fe', '#43e97b']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// 创建瓣膜直径分布图
function createValveDiameterChart() {
    const ctx = document.getElementById('valve-diameter-chart');
    if (!ctx) return;
    
    const diameterRanges = {
        '20-22': 0,
        '23-25': 0,
        '26-28': 0,
        '29-31': 0
    };
    
    filteredCases.forEach(c => {
        const diameter = c.valve_diameter;
        if (diameter >= 20 && diameter <= 22) diameterRanges['20-22']++;
        else if (diameter >= 23 && diameter <= 25) diameterRanges['23-25']++;
        else if (diameter >= 26 && diameter <= 28) diameterRanges['26-28']++;
        else if (diameter >= 29 && diameter <= 31) diameterRanges['29-31']++;
    });
    
    charts.valveDiameter = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(diameterRanges),
            datasets: [{
                label: '病例数',
                data: Object.values(diameterRanges),
                backgroundColor: '#f093fb'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 创建术前术后指标对比图
function createPrePostComparisonChart() {
    const ctx = document.getElementById('pre-post-comparison-chart');
    if (!ctx) return;
    
    // 模拟术前术后数据
    const preData = [45, 55, 65, 75];
    const postData = [15, 20, 25, 30];
    
    charts.prePostComparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['平均压差', '最大压差', '流速', 'LVEF'],
            datasets: [{
                label: '术前',
                data: preData,
                backgroundColor: '#f5576c'
            }, {
                label: '术后',
                data: postData,
                backgroundColor: '#43e97b'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 创建并发症发生率图
function createComplicationsChart() {
    const ctx = document.getElementById('complications-chart');
    if (!ctx) return;
    
    const leakRate = filteredCases.length > 0 ? 
        (filteredCases.filter(c => c.paravalvular_leak).length / filteredCases.length * 100) : 0;
    const deathRate = filteredCases.length > 0 ? 
        (filteredCases.filter(c => c.death).length / filteredCases.length * 100) : 0;
    
    charts.complications = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['瓣周漏', '死亡', '其他并发症'],
            datasets: [{
                label: '发生率 (%)',
                data: [leakRate, deathRate, 5.2],
                backgroundColor: ['#667eea', '#f5576c', '#4facfe']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// 更新图表
function updateCharts() {
    // 销毁现有图表
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
    
    // 重新创建图表
    initializeCharts();
}

// 更新表格
function updateTable() {
    const tbody = document.getElementById('case-list');
    if (!tbody) return;
    
    // 计算分页
    const startIndex = (currentPage - 1) * casesPerPage;
    const endIndex = startIndex + casesPerPage;
    const currentCases = filteredCases.slice(startIndex, endIndex);
    
    // 清空表格
    tbody.innerHTML = '';
    
    // 填充数据
    currentCases.forEach(caseItem => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${caseItem.id}</td>
            <td>${caseItem.age}</td>
            <td>${caseItem.sex === 'Male' ? '男' : '女'}</td>
            <td>${caseItem.valve_type}</td>
            <td>${caseItem.valve_diameter}mm</td>
            <td>${caseItem.pre_mean_gradient}mmHg</td>
            <td>${caseItem.nyha_class}</td>
            <td>${caseItem.paravalvular_leak ? '是' : '否'}</td>
            <td>${caseItem.death ? '是' : '否'}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="showCaseDetail(${caseItem.id})">
                    详情
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // 更新分页
    updatePagination();
}

// 更新分页
function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredCases.length / casesPerPage);
    pagination.innerHTML = '';
    
    // 上一页按钮
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1})">上一页</a>`;
    pagination.appendChild(prevLi);
    
    // 页码按钮
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        pagination.appendChild(li);
    }
    
    // 下一页按钮
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1})">下一页</a>`;
    pagination.appendChild(nextLi);
}

// 切换页面
async function changePage(page) {
    if (page < 1) return;
    
    try {
        currentPage = page;
        await loadTableData(currentFilters, currentPage, casesPerPage);
    } catch (error) {
        console.error('切换页面失败:', error);
        showError('切换页面失败，请重试');
    }
}

// 显示病例详情
function showCaseDetail(caseId) {
    const caseData = filteredCases.find(c => c.id === caseId);
    if (!caseData) return;
    
    const modal = new bootstrap.Modal(document.getElementById('case-detail-modal'));
    const content = document.getElementById('case-details-content');
    
    content.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>基本信息</h6>
                <table class="table table-sm">
                    <tr><th>年龄</th><td>${caseData.age}岁</td></tr>
                    <tr><th>性别</th><td>${caseData.sex === 'Male' ? '男' : '女'}</td></tr>
                    <tr><th>BMI</th><td>${caseData.bmi}</td></tr>
                    <tr><th>NYHA分级</th><td>${caseData.nyha_class}</td></tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6>手术信息</h6>
                <table class="table table-sm">
                    <tr><th>瓣膜类型</th><td>${caseData.valve_type}</td></tr>
                    <tr><th>瓣膜直径</th><td>${caseData.valve_diameter}mm</td></tr>
                    <tr><th>术前平均压差</th><td>${caseData.pre_mean_gradient}mmHg</td></tr>
                </table>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-12">
                <h6>术后结果</h6>
                <table class="table table-sm">
                    <tr><th>瓣周漏</th><td>${caseData.paravalvular_leak ? '是' : '否'}</td></tr>
                    <tr><th>死亡</th><td>${caseData.death ? '是' : '否'}</td></tr>
                </table>
            </div>
        </div>
    `;
    
    modal.show();
}

// 显示筛选结果提示
function showFilterResult() {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = `筛选完成，共找到 ${filteredCases.length} 个病例`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 导出数据
function exportData() {
    const csvContent = generateCSV(filteredCases);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'tavi_cases.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 生成CSV内容
function generateCSV(data) {
    const headers = ['ID', '年龄', '性别', '瓣膜类型', '瓣膜直径', '术前平均压差', 'NYHA分级', '瓣周漏', '死亡'];
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
        const values = [
            row.id,
            row.age,
            row.sex === 'Male' ? '男' : '女',
            row.valve_type,
            row.valve_diameter,
            row.pre_mean_gradient,
            row.nyha_class,
            row.paravalvular_leak ? '是' : '否',
            row.death ? '是' : '否'
        ];
        csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
}

// 添加CSS样式到页面
const style = document.createElement('style');
style.textContent = `
    .toast-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }
    
    .toast-notification.show {
        transform: translateX(0);
    }
`;
document.head.appendChild(style); 
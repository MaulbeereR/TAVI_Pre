// 全局变量
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
        console.log('正在加载图表数据，筛选条件:', filters); // 调试日志
        
        const response = await fetch(`${API_BASE_URL}/charts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filters })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API响应错误:', response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('图表数据加载成功:', data); // 调试日志
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
    const valveTypes = [
        'ACURATE Neo', 'Avalus', 'CoreValve', 'Edwards', 'Edwards SAPIEN',
        'Evolut', 'Hancock', 'INSPIRIS', 'Inoue', 'Inovare', 'J-Valve',
        'JenaValve', 'LOTUS', 'Medtronic Mosaic', 'MyVal', 'Navitor',
        'PERCEVAL-S', 'Portico', 'St Jude', 'Tyshak', 'Venus',
        'Vitaflow Liberty', 'Taurus Elite'
    ];
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
    
    // 配色方案切换按钮
    const changeColorBtn = document.getElementById('change-color-scheme');
    if (changeColorBtn) {
        changeColorBtn.addEventListener('click', function() {
            nextColorScheme(); // 切换到下一个配色方案
            // 重新加载图表数据以应用新配色
            loadChartData(currentFilters);
        });
    }

    // 为所有筛选字段添加事件监听器
    document.addEventListener('input', updateFilterVisualFeedback);
    document.addEventListener('change', updateFilterVisualFeedback);
    
    // 初始化视觉反馈
    setTimeout(updateFilterVisualFeedback, 100);
}

// 应用筛选
async function applyFilters() {
    try {
        console.log('开始应用筛选...'); // 调试日志
        showLoading(true);
        
        // 收集筛选条件
        const filters = collectFilterValues();
        console.log('收集到的筛选条件:', filters); // 调试日志
        currentFilters = filters;
        
        // 重置到第一页
        currentPage = 1;
        
        // 并行加载所有数据
        console.log('开始加载数据...'); // 调试日志
        const [statsData, chartData, tableData] = await Promise.all([
            loadStatistics(filters),
            loadChartData(filters),
            loadTableData(filters, currentPage, casesPerPage)
        ]);
        
        console.log('数据加载完成:', { statsData, chartData, tableData }); // 调试日志
        
        // 更新显示
        updateStatisticsDisplay(statsData);
        updateChartsWithData(chartData);
        updateTableDisplay(tableData);
        
        showLoading(false);
        showFilterResult();
        
        // 更新视觉反馈
        updateFilterVisualFeedback();
        
    } catch (error) {
        console.error('筛选失败:', error);
        console.error('错误详情:', error.message); // 调试日志
        console.error('错误堆栈:', error.stack); // 调试日志
        showLoading(false);
        showError('筛选失败，请重试');
    }
}

// 收集筛选条件
function collectFilterValues() {
    const filters = {};
    
    console.log('开始收集筛选条件...'); // 调试日志
    
    // 收集年龄范围
    const ageMin = document.getElementById('age-min')?.value;
    const ageMax = document.getElementById('age-max')?.value;
    if (ageMin) filters.age_min = parseInt(ageMin);
    if (ageMax) filters.age_max = parseInt(ageMax);
    
    // 收集性别
    const gender = [];
    if (document.getElementById('gender-male')?.checked) gender.push('Male');
    if (document.getElementById('gender-female')?.checked) gender.push('Female');
    if (gender.length > 0) filters.gender = gender;
    
    // 收集BMI范围
    const bmiMin = document.getElementById('bmi-min')?.value;
    const bmiMax = document.getElementById('bmi-max')?.value;
    if (bmiMin) filters.bmi_min = parseFloat(bmiMin);
    if (bmiMax) filters.bmi_max = parseFloat(bmiMax);
    
    // 收集瓣膜类型
    const valveType = document.getElementById('valve-type')?.value;
    if (valveType) {
        // 瓣膜类型中英文映射
        const valveTypeMapping = {
            '球囊扩张式': 'Balloon-expandable',
            '自膨胀式': 'Self-expandable'
        };
        filters.thv_type = valveTypeMapping[valveType] || valveType;
    }
    
    // 收集瓣膜品牌
    const valveBrand = document.getElementById('valve-brand')?.value;
    if (valveBrand && valveBrand.trim() !== '') {
        const brandValue = valveBrand.trim();
        console.log('选择的瓣膜品牌:', brandValue);
        filters.thv_brand = brandValue;
    }
    
    // 收集瓣膜尺寸
    const valveSizeMin = document.getElementById('valve-size-min')?.value;
    const valveSizeMax = document.getElementById('valve-size-max')?.value;
    if (valveSizeMin) filters.thv_size_min = parseFloat(valveSizeMin);
    if (valveSizeMax) filters.thv_size_max = parseFloat(valveSizeMax);
    
    // 收集NYHA分级
    const nyhaGrades = [];
    document.querySelectorAll('input[id^="nyha-"]:checked').forEach(checkbox => {
        nyhaGrades.push(checkbox.value);
    });
    if (nyhaGrades.length > 0) {
        filters.nyha_classification = nyhaGrades;
    }
    
    // 收集平均跨瓣压差范围
    const meanGradientMin = document.getElementById('mean-gradient-min')?.value;
    const meanGradientMax = document.getElementById('mean-gradient-max')?.value;
    if (meanGradientMin) filters.aortic_valve_mean_pg_min = parseFloat(meanGradientMin);
    if (meanGradientMax) filters.aortic_valve_mean_pg_max = parseFloat(meanGradientMax);
    
    // 收集基线资料布尔值筛选条件
    const baselineBooleanFilters = {
        'atrial-fibrillation': 'atrial_fibrillation',
        'myocardial-infarction': 'myocardial_infarction',
        'pci-history': 'pci_history',
        'cabg-history': 'cabg_history',
        'diabetes': 'diabetes_mellitus',
        'hypertension': 'hypertension',
        'hyperlipidemia': 'hyperlipidemia',
        'coronary-artery-disease': 'coronary_artery_disease',
        'copd': 'copd',
        'dialysis': 'dialysis',
        'acei-arb': 'acei_arb',
        'beta-blocker': 'beta_blocker',
        'calcium-blocker': 'calcium_blocker',
        'diuretic': 'diuretic',
        'aspirin': 'aspirin'
    };
    
    // 收集术前影像学评估数值范围筛选条件
    const imagingNumericFilters = {
        'lvef': 'lvef',
        'max-gradient': 'aortic_valve_peak_pg',
        'eoa': 'aortic_valve_eoa',
        'annular-area': 'annular_area',
        'annular-mean-diameter': 'annular_mean_diameter',
        'annular-max-diameter': 'annular_max_diameter',
        'annular-perimeter': 'annular_perimeter',
        'valve-velocity': 'aortic_valve_flow_velocity',
        'stj-height': 'stj_height',
        'stj-diameter': 'stj_diameter',
        'sinus-diameter': 'sinus_diameter',
        'ascending-aorta-diameter': 'ascending_aorta_diameter',
        'lvot-diameter': 'lvot_diameter',
        'lvot-calcification': 'lvot_calcification',
        'lca-height': 'left_coronary_height',
        'rca-height': 'right_coronary_height',
        'eoai': 'aortic_valve_eoai',
        'lvedv': 'lvedv',
        'lvesv': 'lvesv',
        'annular-min-diameter': 'annular_min_diameter',
        'annular-calcification': 'annular_calcification',
        'supraannular-calcification': 'supraannular_calcification'
    };
    
    // 收集术前影像学评估布尔值筛选条件
    const imagingBooleanFilters = {
        'moderate-severe-ar': 'moderate_severe_ar',
        'moderate-severe-mr': 'moderate_severe_mr'
    };
    
    // 收集手术信息布尔值筛选条件
    const surgeryBooleanFilters = {
        'transfemoral-access': 'transfemoral_access',
        'transapical-access': 'transapical_access',
        'mean-pg-gte-20': 'mean_pg_gte_20',
        'prosthesis-malposition': 'prosthesis_malposition',
        'annular-rupture': 'annular_rupture',
        'immediate-pvl': 'immediate_pvl_occurred',
        'valve-displacement': 'thv_displacement',
        'conversion-to-savr': 'conversion_to_savr',
        'cpb-required': 'cpb_required',
        'valve-in-valve': 'valve_in_valve',
        'periprocedural-death': 'periprocedural_death',
        'pre-dilatation': 'pre_dilation',
        'post-dilatation': 'post_dilation',
        'excessive-oversizing': 'excessive_oversizing',
        'oversizing-gte-15': 'oversizing_gte_15'
    };
    
    // 收集手术信息数值范围筛选条件
    const surgeryNumericFilters = {
        'valve-size': 'thv_size',
        'post-mean-pg': 'immediate_mean_pg',
        'total-procedure-time': 'total_procedure_time',
        'fluoroscopy-time': 'fluoroscopy_time',
        'contrast-volume': 'contrast_volume',
        'immediate-lvef': 'immediate_lvef'
    };
    
    // 收集出院前评价布尔值筛选条件
    const dischargeBooleanFilters = {
        'death-before-discharge': 'death_before_discharge',
        'stroke-before-discharge': 'stroke_before_discharge',
        'major-bleeding': 'major_bleeding',
        'acute-kidney-injury': 'aki',
        'major-vascular-complications': 'major_vascular_complication',
        'mi-ami': 'mi_ami',
        'heart-failure': 'heart_failure',
        'all-cause-cv-death': 'all_cause_cv_death',
        'pacemaker-implantation': 'pacemaker_implantation',
        'pvl-detected': 'pvl_detected',
        'acs-ihd': 'acs_ihd'
    };
    
    // 收集出院前评价数值范围筛选条件
    const dischargeNumericFilters = {
        'flow-velocity': 'flow_velocity',
        'mean-pg': 'mean_pg',
        'max-pg': 'max_pg',
        'eoai': 'eoai'
    };
    
    // 收集随访信息布尔值筛选条件
    const followupBooleanFilters = {
        'death-30-days': 'mortality_30d',
        'mi-30-days': 'mi_30d',
        'stroke-30-days': 'stroke_30d',
        'hf-readmission-30-days': 'hf_readmission_30d',
        'death-1-year': 'mortality_1y',
        'mi-1-year': 'mi_1y',
        'stroke-1-year': 'stroke_1y',
        'hf-readmission-1-year': 'hf_readmission_1y',
        'subsequent-intervention': 'subsequent_intervention'
    };
    
    // 收集基线资料数值范围筛选条件
    const baselineNumericFilters = {
        'sts-score': 'sts_score',
        'nt-probnp': 'nt_probnp',
        'surface-area': 'surface_area'
    };
    
    console.log('开始处理布尔值筛选条件'); // 调试日志
    
    // 处理所有布尔值筛选条件
    const allBooleanFilters = {
        ...baselineBooleanFilters,
        ...imagingBooleanFilters,
        ...surgeryBooleanFilters,
        ...dischargeBooleanFilters,
        ...followupBooleanFilters
    };
    
    for (const [filterId, fieldName] of Object.entries(allBooleanFilters)) {
        const select = document.getElementById(filterId);
        console.log(`检查筛选字段 ${filterId}:`, select);
        if (select && select.value) {
            console.log(`${filterId} 的值:`, select.value);
            if (select.value === 'true') {
                filters[fieldName] = true;
                console.log(`设置 ${fieldName} = true`);
            } else if (select.value === 'false') {
                filters[fieldName] = false;
                console.log(`设置 ${fieldName} = false`);
            }
        }
    }
    
    // 处理所有数值范围筛选条件
    const allNumericFilters = {
        ...baselineNumericFilters,
        ...imagingNumericFilters,
        ...surgeryNumericFilters,
        ...dischargeNumericFilters
    };
    
    for (const [prefix, fieldName] of Object.entries(allNumericFilters)) {
        const minInput = document.getElementById(`${prefix}-min`);
        const maxInput = document.getElementById(`${prefix}-max`);
        
        console.log(`检查数值范围字段 ${prefix}:`, { minInput, maxInput, minValue: minInput?.value, maxValue: maxInput?.value });
        
        if (minInput && minInput.value) {
            filters[`${fieldName}_min`] = parseFloat(minInput.value);
            console.log(`设置 ${fieldName}_min = ${parseFloat(minInput.value)}`);
        }
        if (maxInput && maxInput.value) {
            filters[`${fieldName}_max`] = parseFloat(maxInput.value);
            console.log(`设置 ${fieldName}_max = ${parseFloat(maxInput.value)}`);
        }
    }
    
    // 收集分类值筛选条件
    const categoryFilters = {
        'other-access': 'other_access',
        'immediate-pvl-severity': 'immediate_pvl_severity',
        'discharge-pvl-severity': 'pvl_severity',
        'followup-pvl-severity': 'pvl_severity_last_followup',
        'mitral-regurgitation-change': 'mitral_regurgitation_change'
    };
    
    for (const [filterId, fieldName] of Object.entries(categoryFilters)) {
        const select = document.getElementById(filterId);
        if (select && select.value) {
            filters[fieldName] = select.value;
        }
    }
    
    // 收集瓣周漏和死亡结果（保持原有的复选框逻辑作为备用）
    if (document.getElementById('paravalvular-leak')?.checked) {
        filters.immediate_pvl_occurred = true;
    }
    if (document.getElementById('death')?.checked) {
        filters.death_before_discharge = true;
    }
    
    console.log('最终收集到的筛选条件:', filters); // 调试日志
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
    
    console.log('更新图表数据:', data); // 调试日志
    
    // 更新年龄分布图
    if (charts.ageDistribution && data.age_distribution) {
        const labels = data.age_distribution.map(item => item.age_group);
        const values = data.age_distribution.map(item => item.count);
        const colors = getChartColors(labels.length, 'bar');
        
        charts.ageDistribution.data.labels = labels;
        charts.ageDistribution.data.datasets[0].data = values;
        charts.ageDistribution.data.datasets[0].backgroundColor = colors;
        charts.ageDistribution.update();
    }
    
    // 更新NYHA分级图
    if (charts.nyha && data.nyha_distribution) {
        const labels = data.nyha_distribution.map(item => item.nyha_classification || 'N/A');
        const values = data.nyha_distribution.map(item => item.count);
        const colors = getChartColors(labels.length, 'pie');
        
        charts.nyha.data.labels = labels;
        charts.nyha.data.datasets[0].data = values;
        charts.nyha.data.datasets[0].backgroundColor = colors;
        charts.nyha.update();
    }
    
    // 更新瓣膜尺寸分布图
    if (charts.valveDiameter && data.valve_size_distribution) {
        const labels = data.valve_size_distribution.map(item => (item.thv_size || 'N/A') + 'mm');
        const values = data.valve_size_distribution.map(item => item.count);
        const colors = getChartColors(labels.length, 'bar');
        
        charts.valveDiameter.data.labels = labels;
        charts.valveDiameter.data.datasets[0].data = values;
        charts.valveDiameter.data.datasets[0].backgroundColor = colors;
        charts.valveDiameter.update();
    }
    
    // 更新术前术后对比图
    if (charts.prePostComparison && data.pre_post_comparison) {
        const values = [
            data.pre_post_comparison.pre_mean_pg || 0,
            data.pre_post_comparison.post_mean_pg || 0,
            data.pre_post_comparison.pre_lvef || 0,
            data.pre_post_comparison.post_lvef || 0
        ];
        const colors = getChartColors(4, 'bar'); // 固定4个指标
        
        charts.prePostComparison.data.datasets[0].data = values;
        charts.prePostComparison.data.datasets[0].backgroundColor = colors;
        charts.prePostComparison.update();
    }
    
    // 更新并发症图
    if (charts.complications && data.complications) {
        const labels = data.complications.map(item => item.complication);
        const values = data.complications.map(item => parseFloat(item.rate) || 0);
        const colors = getChartColors(labels.length, 'bar');
        
        charts.complications.data.labels = labels;
        charts.complications.data.datasets[0].data = values;
        charts.complications.data.datasets[0].backgroundColor = colors;
        charts.complications.update();
    }
}

// 更新表格显示
function updateTableDisplay(data) {
    if (!data || !data.data) return;
    
    const tbody = document.getElementById('case-list');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.data.forEach((patient, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${(data.page - 1) * data.page_size + idx + 1}</td>
            <td>${patient.patient_id || 'N/A'}</td>
            <td>${patient.age || 'N/A'}</td>
            <td>${patient.sex === 'Male' ? '男' : patient.sex === 'Female' ? '女' : 'N/A'}</td>
            <td>${patient.nyha_classification || 'N/A'}</td>
            <td>${patient.thv_type || 'N/A'}</td>
            <td>${patient.thv_brand || 'N/A'}</td>
            <td>${patient.thv_size || 'N/A'}</td>
            <td>${patient.aortic_valve_mean_pg || 'N/A'}</td>
            <td>${patient.immediate_pvl_occurred ? '是' : '否'}</td>
            <td>${patient.mortality_30d ? '是' : '否'}</td>
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
function resetFilters() {
    console.log('开始重置所有筛选条件...'); // 调试日志
    
    // 重置年龄范围
    const ageMin = document.getElementById('age-min');
    const ageMax = document.getElementById('age-max');
    if (ageMin) ageMin.value = '';
    if (ageMax) ageMax.value = '';
    
    // 重置性别
    const genderMale = document.getElementById('gender-male');
    const genderFemale = document.getElementById('gender-female');
    if (genderMale) genderMale.checked = false;
    if (genderFemale) genderFemale.checked = false;
    
    // 重置BMI范围
    const bmiMin = document.getElementById('bmi-min');
    const bmiMax = document.getElementById('bmi-max');
    if (bmiMin) bmiMin.value = '';
    if (bmiMax) bmiMax.value = '';
    
    // 重置瓣膜类型
    const valveType = document.getElementById('valve-type');
    if (valveType) valveType.value = '';
    
    // 重置瓣膜品牌
    const valveBrand = document.getElementById('valve-brand');
    if (valveBrand) valveBrand.value = '';
    
    // 重置瓣膜尺寸范围
    const valveSizeMin = document.getElementById('valve-size-min');
    const valveSizeMax = document.getElementById('valve-size-max');
    if (valveSizeMin) valveSizeMin.value = '';
    if (valveSizeMax) valveSizeMax.value = '';
    
    // 重置NYHA分级复选框
    document.querySelectorAll('input[id^="nyha-"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // 重置平均跨瓣压差范围
    const meanGradientMin = document.getElementById('mean-gradient-min');
    const meanGradientMax = document.getElementById('mean-gradient-max');
    if (meanGradientMin) meanGradientMin.value = '';
    if (meanGradientMax) meanGradientMax.value = '';
    
    // 重置所有布尔值筛选条件
    const allBooleanFilterIds = [
        // 基线资料
        'atrial-fibrillation', 'myocardial-infarction', 'pci-history', 'cabg-history',
        'diabetes', 'hypertension', 'hyperlipidemia', 'coronary-artery-disease',
        'copd', 'dialysis', 'acei-arb', 'beta-blocker', 'calcium-blocker', 'diuretic', 'aspirin',
        // 术前影像学评估
        'moderate-severe-ar', 'moderate-severe-mr',
        // 手术信息
        'transfemoral-access', 'transapical-access', 'mean-pg-gte-20', 'prosthesis-malposition',
        'annular-rupture', 'immediate-pvl', 'valve-displacement', 'conversion-to-savr',
        'cpb-required', 'valve-in-valve', 'periprocedural-death', 'pre-dilatation',
        'post-dilatation', 'excessive-oversizing', 'oversizing-gte-15',
        // 出院前评价
        'death-before-discharge', 'stroke-before-discharge', 'major-bleeding',
        'acute-kidney-injury', 'major-vascular-complications', 'mi-ami', 'heart-failure',
        'all-cause-cv-death', 'pacemaker-implantation', 'pvl-detected', 'acs-ihd',
        // 随访信息
        'death-30-days', 'mi-30-days', 'stroke-30-days', 'hf-readmission-30-days',
        'death-1-year', 'mi-1-year', 'stroke-1-year', 'hf-readmission-1-year',
        'subsequent-intervention'
    ];
    
    allBooleanFilterIds.forEach(filterId => {
        const select = document.getElementById(filterId);
        if (select) {
            select.value = '';
        }
    });
    
    // 重置所有数值范围筛选条件
    const allNumericFilterPrefixes = [
        // 基线资料
        'sts-score', 'nt-probnp', 'surface-area',
        // 术前影像学评估
        'lvef', 'max-gradient', 'eoa', 'annular-area', 'annular-mean-diameter',
        'annular-max-diameter', 'annular-perimeter', 'valve-velocity', 'stj-height',
        'stj-diameter', 'sinus-diameter', 'ascending-aorta-diameter', 'lvot-diameter',
        'lvot-calcification', 'lca-height', 'rca-height', 'eoai', 'lvedv', 'lvesv',
        'annular-min-diameter', 'annular-calcification', 'supraannular-calcification',
        // 手术信息
        'valve-size', 'post-mean-pg', 'total-procedure-time', 'fluoroscopy-time', 'contrast-volume',
        'immediate-lvef',
        // 出院前评价
        'flow-velocity', 'mean-pg', 'max-pg'
    ];
    
    allNumericFilterPrefixes.forEach(prefix => {
        const minInput = document.getElementById(`${prefix}-min`);
        const maxInput = document.getElementById(`${prefix}-max`);
        if (minInput) minInput.value = '';
        if (maxInput) maxInput.value = '';
    });
    
    // 重置分类值筛选条件
    const categoryFilterIds = ['other-access', 'immediate-pvl-severity', 'discharge-pvl-severity', 'followup-pvl-severity', 'mitral-regurgitation-change'];
    categoryFilterIds.forEach(filterId => {
        const select = document.getElementById(filterId);
        if (select) {
            select.value = '';
        }
    });
    
    // 重置瓣周漏和死亡结果复选框
    const paravalvularLeak = document.getElementById('paravalvular-leak');
    const death = document.getElementById('death');
    if (paravalvularLeak) paravalvularLeak.checked = false;
    if (death) death.checked = false;
    
    console.log('所有筛选条件已重置'); // 调试日志
    
    // 更新视觉反馈
    updateFilterVisualFeedback();
    
    // 重新加载数据（不应用任何筛选条件）
    applyFilters();
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

// 更新统计数据 - 现在通过API获取
// 这个函数已被 updateStatisticsDisplay 替代，保留为兼容性

// 初始化图表
function initializeCharts() {
    // 创建空图表，等待数据加载后更新
    createAgeDistributionChart();
    createNyhaChart();
    createValveDiameterChart();
    createValveBrandChart();
    createPrePostComparisonChart();
    createComplicationsChart();
}

// 创建年龄分布图
function createAgeDistributionChart() {
    const ctx = document.getElementById('age-distribution-chart');
    if (!ctx) return;
    
    charts.ageDistribution = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '病例数',
                data: [],
                backgroundColor: [] // 将在数据更新时动态设置
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: '#333',
                    font: {
                        weight: 'bold',
                        size: 12
                    },
                    formatter: function(value) {
                        return value;
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

// 创建NYHA分级分布图
function createNyhaChart() {
    const ctx = document.getElementById('nyha-chart');
    if (!ctx) return;
    
    charts.nyha = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [] // 将在数据更新时动态设置
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                const dataset = data.datasets[0];
                                const total = dataset.data.reduce((a, b) => a + b, 0);
                                return data.labels.map((label, i) => {
                                    const value = dataset.data[i];
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return {
                                        text: `${label}: ${value} (${percentage}%)`,
                                        fillStyle: dataset.backgroundColor[i],
                                        strokeStyle: dataset.backgroundColor[i],
                                        lineWidth: 0,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                datalabels: {
                    display: false  // 关闭饼图上的数据标签，改用图例显示
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

// 创建瓣膜直径分布图
function createValveDiameterChart() {
    const ctx = document.getElementById('valve-diameter-chart');
    if (!ctx) return;
    
    charts.valveDiameter = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '病例数',
                data: [],
                backgroundColor: [] // 将在数据更新时动态设置
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    ticks: {
                        callback: function(value, index, ticks) {
                            // 获取原始标签
                            let label = this.getLabelForValue(value);
                            // 去掉单位mm
                            label = label.replace('mm', '');
                            // 转为数字
                            let num = Number(label);
                            if (isNaN(num)) return label;
                            // 判断是否为整数
                            if (Number.isInteger(num)) {
                                return num + 'mm';
                            } else {
                                // 保留1位小数
                                return num.toFixed(1) + 'mm';
                            }
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'start',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'rect',
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: '#333',
                    font: {
                        weight: 'bold',
                        size: 12
                    },
                    formatter: function(value) {
                        return value;
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

// 创建瓣膜品牌分布图
function createValveBrandChart() {
    const ctx = document.getElementById('valve-brand-chart');
    if (!ctx) return;
    
    charts.valveBrand = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '病例数',
                data: [],
                backgroundColor: [] // 将在数据更新时动态设置
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: '#333',
                    font: {
                        weight: 'bold',
                        size: 12
                    },
                    formatter: function(value) {
                        return value;
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

// 创建术前术后指标对比图
function createPrePostComparisonChart() {
    const ctx = document.getElementById('pre-post-comparison-chart');
    if (!ctx) return;
    
    charts.prePostComparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['术前平均压差', '术后平均压差', '术前LVEF', '术后LVEF'],
            datasets: [{
                label: '平均值',
                data: [],
                backgroundColor: [] // 将在数据更新时动态设置
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: '#333',
                    font: {
                        weight: 'bold',
                        size: 12
                    },
                    formatter: function(value) {
                        return value.toFixed(1);
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

// 创建并发症发生率图
function createComplicationsChart() {
    const ctx = document.getElementById('complications-chart');
    if (!ctx) return;
    
    charts.complications = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '发生率 (%)',
                data: [],
                backgroundColor: [] // 将在数据更新时动态设置
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
            },
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: '#333',
                    font: {
                        weight: 'bold',
                        size: 12
                    },
                    formatter: function(value) {
                        return value.toFixed(1) + '%';
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

// 更新图表
function updateCharts(data) {
    // 销毁现有图表
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
    
    // 重新创建图表
    initializeCharts();
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
async function showCaseDetail(patientId) {
    try {
        // 从后端获取详细数据
        const response = await fetch(`${API_BASE_URL}/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                filters: { patient_id: patientId },
                page: 1,
                page_size: 1
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        const caseData = result.data && result.data[0];
        
        if (!caseData) {
            showError('未找到病例数据');
            return;
        }
        
        // 自动生成的key->name映射表（来自TAVI_variables_schema_0530.json）
        const fieldMap = {
            "age": "年龄",
            "sex": "性别",
            "bmi": "体重指数",
            "surface_area": "体表面积",
            "diabetes_mellitus": "糖尿病",
            "hypertension": "高血压",
            "hyperlipidemia": "高脂血症",
            "coronary_artery_disease": "冠心病",
            "copd": "慢阻肺",
            "dialysis": "透析",
            "atrial_fibrillation": "房颤",
            "nyha_classification": "纽约心脏病协会分级",
            "acei_arb": "血管紧张素转换酶抑制剂/血管紧张素Ⅱ受体拮抗剂",
            "beta_blocker": "Beta受体阻滞剂",
            "calcium_blocker": "钙离子阻滞剂",
            "diuretic": "利尿剂",
            "aspirin": "阿司匹林",
            "anticoagulant": "抗凝药",
            "statins": "他汀类药物",
            "mi_history": "心梗",
            "pci_history": "经皮冠状动脉介入术",
            "cabg_history": "冠状动脉旁路移植术",
            "sts_score": "胸外科医师学会评分",
            "nt_probnp": "氨基末端B型利钠肽前体",
            "sglt2_inhibitors": "钠-葡萄糖共转运蛋白2抑制剂",
            "lvef": "左心室射血分数",
            "aortic_valve_peak_pg": "最大主动脉瓣跨瓣压差",
            "aortic_valve_mean_pg": "平均主动脉瓣跨瓣压差",
            "aortic_valve_eoa": "有效瓣口面积（主动脉瓣）",
            "aortic_valve_eoai": "有效瓣口面积指数（主动脉瓣）",
            "moderate_severe_ar": "中度以上主动脉瓣反流",
            "moderate_severe_mr": "中度以上二尖瓣反流",
            "lvedv": "左心室舒张末期容积",
            "lvesv": "左心室收缩末期容积",
            "annular_area": "瓣环面积（主动脉瓣）",
            "annular_mean_diameter": "瓣环平均直径（主动脉瓣）",
            "annular_min_diameter": "瓣环最小直径（主动脉瓣）",
            "annular_max_diameter": "瓣环最大直径（主动脉瓣）",
            "annular_perimeter": "瓣环周径（主动脉瓣）",
            "annular_eccentricity": "瓣环偏心率（主动脉瓣）",
            "area_derived_diameter": "源自面积的瓣环直径（主动脉瓣）",
            "perimeter_derived_diameter": "源自周长的瓣环直径（主动脉瓣）",
            "aortic_valve_flow_velocity": "主动脉瓣口流速",
            "stj_height": "窦管交界高度",
            "stj_diameter": "窦管交界直径",
            "sinus_diameter": "窦部直径（主动脉根部）",
            "ascending_aorta_diameter": "升主动脉直径",
            "supraannular_calcification": "瓣环上钙化（主动脉瓣）",
            "annular_calcification": "瓣环钙化（主动脉瓣）",
            "lvot_diameter": "左心室流出道直径",
            "lvot_calcification": "左心室流出道钙化体积",
            "left_coronary_height": "左冠脉高度（主动脉根部）",
            "right_coronary_height": "右冠脉高度（主动脉根部）",
            "annulus_to_mitral_distance": "瓣环至二尖瓣前叶距离",
            "transfemoral_access": "经股动脉入路",
            "transapical_access": "经心尖入路",
            "other_access": "其它入路",
            "thv_size": "瓣膜尺寸",
            "thv_type": "瓣膜类型",
            "thv_brand": "瓣膜品牌",
            "pre_dilation": "预扩张",
            "post_dilation": "后扩张",
            "total_procedure_time": "总术时",
            "fluoroscopy_time": "造影时间",
            "contrast_volume": "造影量",
            "immediate_lvef": "术后即刻左心室射血分数",
            "immediate_mean_pg": "术后即刻主动脉瓣跨瓣压差",
            "mean_pg_gte_20": "主动脉瓣跨瓣压差≥20 mmHg",
            "prosthesis_malposition": "严重错位",
            "annular_rupture": "瓣环撕裂",
            "excessive_oversizing": "过大尺寸",
            "oversizing_gte_15": "尺寸过大≥15%",
            "immediate_pvl_occurred": "术后是否即刻瓣周漏",
            "immediate_pvl_severity": "术后即刻瓣周漏程度",
            "thv_displacement": "瓣架移位",
            "conversion_to_savr": "转外科开胸手术",
            "cpb_required": "转心肺转流术",
            "valve_in_valve": "瓣中瓣",
            "periprocedural_death": "围术期死亡",
            "mitral_regurgitation_change": "二尖瓣返流变化",
            "death_before_discharge": "出院前死亡",
            "stroke_before_discharge": "卒中",
            "major_bleeding": "大出血",
            "aki": "急性肾衰",
            "major_vascular_complication": "严重血管并发症",
            "mi_ami": "心肌梗死/急性心肌梗死",
            "acs_ihd": "急性冠脉综合征/缺血性心脏病",
            "heart_failure": "心力衰竭",
            "all_cause_cv_death": "所有原因死亡和心血管死亡",
            "pacemaker_implantation": "起搏器植入",
            "pvl_detected": "出院前是否瓣周漏",
            "pvl_severity": "出院前瓣周漏程度",
            "max_pg": "出院前最大主动脉瓣跨瓣压差",
            "flow_velocity": "出院前主动脉瓣口流速",
            "mean_pg": "出院前平均主动脉瓣跨瓣压差",
            "eoai": "出院前实测有效瓣口面积指数",
            "mortality_30d": "30天全因",
            "mi_30d": "30天心梗",
            "stroke_30d": "30天卒中",
            "hf_readmission_30d": "30天心衰再住院",
            "mortality_1y": "1年全因",
            "mi_1y": "1年心梗",
            "stroke_1y": "1年卒中",
            "hf_readmission_1y": "1年心衰再住院",
            "lvef_last_followup": "左心室射血分数",
            "nyha_last_followup": "纽约心脏病协会分级",
            "max_pg_last_followup": "最大主动脉瓣跨瓣压差",
            "flow_velocity_last_followup": "主动脉瓣口流速",
            "mean_pg_last_followup": "平均主动脉瓣跨瓣压差",
            "eoa_last_followup": "有效瓣口面积",
            "eoai_last_followup": "有效瓣口面积指数",
            "pvl_detected_last_followup": "是否瓣周漏",
            "pvl_severity_last_followup": "瓣周漏程度",
            "subsequent_intervention": "患者是否因TAVI相关并发症而接受了后续干预",
            "intervention_details": "后续干预的具体类型和发生时间",
            "occlusion_procedure": "术后封堵",
            "reoperation": "二次手术",
            "conversion_to_open": "术后中转开胸",
            "pacemaker_post": "术后起搏器植入",
            "valve_dislodgement": "术后瓣膜脱落",
            "aortic_dissection": "术后主动脉夹层",
            "hematoma": "术后血肿",
            "heart_failure_post": "术后心衰",
            "mitral_regurgitation_change_followup": "二尖瓣返流变化"
        };

        // 各分组字段key
        const groupFields = {
            "基线资料": [
                "age", "sex", "bmi", "surface_area", "diabetes_mellitus", "hypertension", "hyperlipidemia", "coronary_artery_disease", "copd", "dialysis", "atrial_fibrillation", "nyha_classification", "acei_arb", "beta_blocker", "calcium_blocker", "diuretic", "aspirin", "anticoagulant", "statins", "mi_history", "pci_history", "cabg_history", "sts_score", "nt_probnp", "sglt2_inhibitors"
            ],
            "术前影像学评估": [
                "lvef", "aortic_valve_peak_pg", "aortic_valve_mean_pg", "aortic_valve_eoa", "aortic_valve_eoai", "moderate_severe_ar", "moderate_severe_mr", "lvedv", "lvesv", "annular_area", "annular_mean_diameter", "annular_min_diameter", "annular_max_diameter", "annular_perimeter", "annular_eccentricity", "area_derived_diameter", "perimeter_derived_diameter", "aortic_valve_flow_velocity", "stj_height", "stj_diameter", "sinus_diameter", "ascending_aorta_diameter", "supraannular_calcification", "annular_calcification", "lvot_diameter", "lvot_calcification", "left_coronary_height", "right_coronary_height", "annulus_to_mitral_distance"
            ],
            "手术信息": [
                "transfemoral_access", "transapical_access", "other_access", "thv_size", "thv_type", "thv_brand", "pre_dilation", "post_dilation", "total_procedure_time", "fluoroscopy_time", "contrast_volume", "immediate_lvef", "immediate_mean_pg", "mean_pg_gte_20", "prosthesis_malposition", "annular_rupture", "excessive_oversizing", "oversizing_gte_15", "immediate_pvl_occurred", "immediate_pvl_severity", "thv_displacement", "conversion_to_savr", "cpb_required", "valve_in_valve", "periprocedural_death", "mitral_regurgitation_change"
            ],
            "出院前评价": [
                "death_before_discharge", "stroke_before_discharge", "major_bleeding", "aki", "major_vascular_complication", "mi_ami", "acs_ihd", "heart_failure", "all_cause_cv_death", "pacemaker_implantation", "pvl_detected", "pvl_severity", "max_pg", "flow_velocity", "mean_pg", "eoai", "mitral_regurgitation_change"
            ],
            "随访信息": [
                "mortality_30d", "mi_30d", "stroke_30d", "hf_readmission_30d", "mortality_1y", "mi_1y", "stroke_1y", "hf_readmission_1y", "lvef_last_followup", "nyha_last_followup", "max_pg_last_followup", "flow_velocity_last_followup", "mean_pg_last_followup", "eoa_last_followup", "eoai_last_followup", "pvl_detected_last_followup", "pvl_severity_last_followup", "subsequent_intervention", "intervention_details", "occlusion_procedure", "reoperation", "conversion_to_open", "pacemaker_post", "valve_dislodgement", "aortic_dissection", "hematoma", "heart_failure_post", "mitral_regurgitation_change_followup"
            ]
        };

        // 友好值处理
        function formatValue(key, value) {
            if (key === 'sex') return value === 'Male' ? '男' : value === 'Female' ? '女' : value;
            if (typeof value === 'boolean') return value ? '是' : '否';
            if (value === 1) return '是';
            if (value === 0) return '否';
            if (value === null || value === undefined || value === '') return 'N/A';
            return value;
        }

        // 分组渲染
        function renderGroup(title, keys) {
            const items = keys.filter(k => caseData[k] !== null && caseData[k] !== undefined && caseData[k] !== '').map(k =>
                `<tr><th>${fieldMap[k] || k}</th><td>${formatValue(k, caseData[k])}</td></tr>`
            );
            if (items.length === 0) return '';
            return `
                <div class="detail-group">
                    <h6 class="detail-group-title">${title}</h6>
                    <table class="table table-bordered table-sm detail-table">
                        <tbody>
                            ${items.join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        // 两列布局
        const leftGroups = ["基线资料", "手术信息", "随访信息"];
        const rightGroups = ["术前影像学评估", "出院前评价"];
        let leftHtml = leftGroups.map(g => renderGroup(g, groupFields[g])).join('');
        let rightHtml = rightGroups.map(g => renderGroup(g, groupFields[g])).join('');

        const modal = new bootstrap.Modal(document.getElementById('case-detail-modal'));
        const content = document.getElementById('case-details-content');
        content.innerHTML = `
            <div class="row">
                <div class="col-md-6">${leftHtml}</div>
                <div class="col-md-6">${rightHtml}</div>
            </div>
        `;
        modal.show();
    } catch (error) {
        console.error('获取病例详情失败:', error);
        showError('获取病例详情失败，请重试');
    }
}

// 显示筛选结果提示
function showFilterResult() {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = '筛选完成';
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
async function exportData() {
    try {
        // 获取当前筛选的所有数据
        const response = await fetch(`${API_BASE_URL}/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                filters: currentFilters,
                page: 1,
                page_size: 10000 // 获取所有数据
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        const csvContent = generateCSV(result.data || []);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'tavi_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    } catch (error) {
        console.error('导出数据失败:', error);
        showError('导出数据失败，请重试');
    }
}

// 生成CSV内容
function generateCSV(data) {
    const headers = ['患者ID', '年龄', '性别', '瓣膜类型', '瓣膜尺寸', '术前平均压差', 'NYHA分级', '瓣周漏', '30天死亡', '1年死亡'];
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
        const values = [
            row.patient_id || '',
            row.age || '',
            row.sex === 'Male' ? '男' : row.sex === 'Female' ? '女' : '',
            row.thv_type || '',
            row.thv_size || '',
            row.aortic_valve_mean_pg || '',
            row.nyha_classification || '',
            row.immediate_pvl_occurred ? '是' : '否',
            row.mortality_30d ? '是' : '否',
            row.mortality_1y ? '是' : '否'
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

// 更新筛选字段的视觉反馈
function updateFilterVisualFeedback() {
    // 检查数值范围字段
    const rangeInputs = document.querySelectorAll('input[type="number"]');
    rangeInputs.forEach(input => {
        const filterItem = input.closest('.filter-item-inline');
        if (filterItem) {
            const minInput = filterItem.querySelector('input[placeholder="最小"]');
            const maxInput = filterItem.querySelector('input[placeholder="最大"]');
            
            if ((minInput && minInput.value) || (maxInput && maxInput.value)) {
                filterItem.classList.add('has-value');
            } else {
                filterItem.classList.remove('has-value');
            }
        }
    });
    
    // 检查下拉菜单字段
    const selectInputs = document.querySelectorAll('select[id]');
    selectInputs.forEach(select => {
        const filterItem = select.closest('.filter-item-inline');
        if (filterItem && select.value) {
            filterItem.classList.add('has-value');
        } else if (filterItem) {
            filterItem.classList.remove('has-value');
        }
    });
    
    // 检查复选框字段 - 包括NYHA分级
    const checkboxGroups = document.querySelectorAll('.checkbox-group-inline');
    checkboxGroups.forEach(group => {
        const filterItem = group.closest('.filter-item-inline');
        if (filterItem) {
            const checkedBoxes = group.querySelectorAll('input[type="checkbox"]:checked');
            if (checkedBoxes.length > 0) {
                filterItem.classList.add('has-value');
            } else {
                filterItem.classList.remove('has-value');
            }
        }
    });
    
    // 检查性别复选框
    const genderMale = document.getElementById('gender-male');
    const genderFemale = document.getElementById('gender-female');
    if (genderMale && genderFemale) {
        const genderFilterItem = genderMale.closest('.filter-item-inline');
        if (genderFilterItem) {
            if (genderMale.checked || genderFemale.checked) {
                genderFilterItem.classList.add('has-value');
            } else {
                genderFilterItem.classList.remove('has-value');
            }
        }
    }
    
    // 检查瓣周漏和死亡结果复选框
    const paravalvularLeak = document.getElementById('paravalvular-leak');
    const death = document.getElementById('death');
    
    if (paravalvularLeak) {
        const filterItem = paravalvularLeak.closest('.filter-item-inline');
        if (filterItem) {
            if (paravalvularLeak.checked) {
                filterItem.classList.add('has-value');
            } else {
                filterItem.classList.remove('has-value');
            }
        }
    }
    
    if (death) {
        const filterItem = death.closest('.filter-item-inline');
        if (filterItem) {
            if (death.checked) {
                filterItem.classList.add('has-value');
            } else {
                filterItem.classList.remove('has-value');
            }
        }
    }
} 
// 全局变量
let currentPage = 1;
const casesPerPage = 20;
let charts = {};
let currentFilters = {};
let fieldMapping = {};  // 字段映射知识库

// API配置
const API_BASE_URL = 'http://localhost:5000/api';

// 智能筛选配置
const INTELLIGENT_FILTER_CONFIG = {
    useKnowledgeBase: true,  // 控制是否使用知识库辅助智能筛选
    knowledgeBasePath: './data/tavi_field_mapping.json'  // 知识库文件路径
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
async function initializeApp() {
    try {
        // 绑定事件监听器
        bindEventListeners();
        
        // 初始化图表
        initializeCharts();
        
        // 加载知识库（如果启用）
        if (INTELLIGENT_FILTER_CONFIG.useKnowledgeBase) {
            await loadFieldMappingKnowledgeBase();
        }
        
        // 加载初始数据
        await loadInitialData();
    } catch (error) {
        console.error('应用初始化失败:', error);
        showError('应用初始化失败，请刷新页面重试');
    }
}

// 加载字段映射知识库
async function loadFieldMappingKnowledgeBase() {
    try {
        console.log('正在加载字段映射知识库...');
        const response = await fetch(INTELLIGENT_FILTER_CONFIG.knowledgeBasePath);
        if (!response.ok) {
            throw new Error(`无法加载知识库文件: ${response.status}`);
        }
        fieldMapping = await response.json();
        console.log('字段映射知识库加载成功:', fieldMapping);
    } catch (error) {
        console.warn('字段映射知识库加载失败，将使用默认映射:', error);
        // 提供基本的默认映射
        fieldMapping = {
            field_mapping: {
                "基线资料": {
                    "年龄": "age",
                    "性别": "sex",
                    "BMI": "bmi"
                }
            }
        };
    }
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
    // 已修改
    const applyNLBtn = document.getElementById('apply-natural-language-filter');
    if (applyNLBtn) {
        applyNLBtn.addEventListener('click', handleNaturalLanguageFilter);
    }
    
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
    
    // 智能聊天相关事件监听器
    const sendChatBtn = document.getElementById('send-chat-message');
    const chatInput = document.getElementById('chat-input');
    const applyChatFiltersBtn = document.getElementById('apply-chat-filters');
    
    if (sendChatBtn) {
        sendChatBtn.addEventListener('click', handleChatMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleChatMessage();
            }
        });
    }
    
    if (applyChatFiltersBtn) {
        applyChatFiltersBtn.addEventListener('click', applyChatFilters);
    }
    
    // 初始化视觉反馈
    setTimeout(updateFilterVisualFeedback, 100);
}



// ==================== START: 用此代码块替换旧的 applyFilters 函数 ====================
async function applyFilters() {
    try {
        console.log('开始应用筛选...');
        showLoading(true);
        
        // 1. 【核心改变】从UI收集筛选条件，并将其设置为当前全局筛选条件
        currentFilters = collectFilterValues();
        console.log('收集到的UI筛选条件:', currentFilters);
        
        // 2. 重置到第一页
        currentPage = 1;
        
        // 3. 并行加载所有数据
        console.log('开始加载数据...');
        await Promise.all([
            loadStatistics(currentFilters),
            loadChartData(currentFilters),
            loadTableData(currentFilters, currentPage, casesPerPage)
        ]);
        
        showLoading(false);
        showFilterResult();
        updateFilterVisualFeedback();
        
    } catch (error) {
        console.error('筛选失败:', error);
        showLoading(false);
        showError('筛选失败，请重试');
    }
}
// ==================== END: 替换结束 ====================


function collectFilterValues() {
    const filters = {};
    
    // 基线资料布尔值筛选条件
    const baselineBooleanFilters = {
        'atrial-fibrillation': 'atrial_fibrillation', 'myocardial-infarction': 'myocardial_infarction',
        'pci-history': 'pci_history', 'cabg-history': 'cabg_history', 'diabetes': 'diabetes_mellitus',
        'hypertension': 'hypertension', 'hyperlipidemia': 'hyperlipidemia', 'coronary-artery-disease': 'coronary_artery_disease',
        'copd': 'copd', 'dialysis': 'dialysis', 'acei-arb': 'acei_arb', 'beta-blocker': 'beta_blocker',
        'calcium-blocker': 'calcium_blocker', 'diuretic': 'diuretic', 'aspirin': 'aspirin'
    };
    // 术前影像学评估数值范围筛选条件
    const imagingNumericFilters = {
        'lvef': 'lvef', 'max-gradient': 'aortic_valve_peak_pg', 'eoa': 'aortic_valve_eoa', 'annular-area': 'annular_area',
        'annular-mean-diameter': 'annular_mean_diameter', 'annular-max-diameter': 'annular_max_diameter',
        'annular-perimeter': 'annular_perimeter', 'valve-velocity': 'aortic_valve_flow_velocity', 'stj-height': 'stj_height',
        'stj-diameter': 'stj_diameter', 'sinus-diameter': 'sinus_diameter', 'ascending-aorta-diameter': 'ascending_aorta_diameter',
        'lvot-diameter': 'lvot_diameter', 'lvot-calcification': 'lvot_calcification', 'lca-height': 'left_coronary_height',
        'rca-height': 'right_coronary_height', 'eoai': 'aortic_valve_eoai', 'lvedv': 'lvedv', 'lvesv': 'lvesv',
        'annular-min-diameter': 'annular_min_diameter', 'annular-calcification': 'annular_calcification', 'supraannular-calcification': 'supraannular_calcification'
    };
    // 术前影像学评估布尔值筛选条件
    const imagingBooleanFilters = { 'moderate-severe-ar': 'moderate_severe_ar', 'moderate-severe-mr': 'moderate_severe_mr' };
    // 手术信息布尔值筛选条件
    const surgeryBooleanFilters = {
        'transfemoral-access': 'transfemoral_access', 'transapical-access': 'transapical_access',
        'mean-pg-gte-20': 'mean_pg_gte_20', 'prosthesis-malposition': 'prosthesis_malposition',
        'annular-rupture': 'annular_rupture', 'immediate-pvl': 'immediate_pvl_occurred',
        'valve-displacement': 'thv_displacement', 'conversion-to-savr': 'conversion_to_savr',
        'cpb-required': 'cpb_required', 'valve-in-valve': 'valve_in_valve', 'periprocedural-death': 'periprocedural_death',
        'pre-dilatation': 'pre_dilation', 'post-dilatation': 'post_dilation', 'excessive-oversizing': 'excessive_oversizing',
        'oversizing-gte-15': 'oversizing_gte_15'
    };
    // 手术信息数值范围筛选条件
    const surgeryNumericFilters = {
        'valve-size': 'thv_size', 'post-mean-pg': 'immediate_mean_pg', 'total-procedure-time': 'total_procedure_time',
        'fluoroscopy-time': 'fluoroscopy_time', 'contrast-volume': 'contrast_volume', 'immediate-lvef': 'immediate_lvef'
    };
    // 出院前评价布尔值筛选条件
    const dischargeBooleanFilters = {
        'death-before-discharge': 'death_before_discharge', 'stroke-before-discharge': 'stroke_before_discharge',
        'major-bleeding': 'major_bleeding', 'acute-kidney-injury': 'aki', 'major-vascular-complications': 'major_vascular_complication',
        'mi-ami': 'mi_ami', 'heart-failure': 'heart_failure', 'all-cause-cv-death': 'all_cause_cv_death',
        'pacemaker-implantation': 'pacemaker_implantation', 'pvl-detected': 'pvl_detected', 'acs-ihd': 'acs_ihd'
    };
    // 出院前评价数值范围筛选条件
    const dischargeNumericFilters = { 'flow-velocity': 'flow_velocity', 'mean-pg': 'mean_pg', 'max-pg': 'max_pg', 'eoai': 'eoai' };
    // 随访信息布尔值筛选条件
    const followupBooleanFilters = {
        'death-30-days': 'mortality_30d', 'mi-30-days': 'mi_30d', 'stroke-30-days': 'stroke_30d',
        'hf-readmission-30-days': 'hf_readmission_30d', 'death-1-year': 'mortality_1y', 'mi-1-year': 'mi_1y',
        'stroke-1-year': 'stroke_1y', 'hf-readmission-1-year': 'hf_readmission_1y', 'subsequent-intervention': 'subsequent_intervention'
    };
    // 基线资料数值范围筛选条件
    const baselineNumericFilters = { 'sts-score': 'sts_score', 'nt-probnp': 'nt_probnp', 'surface-area': 'surface_area' };
    // 分类值筛选条件
    const categoryFilters = {
        'other-access': 'other_access', 'immediate-pvl-severity': 'immediate_pvl_severity',
        'discharge-pvl-severity': 'pvl_severity', 'followup-pvl-severity': 'pvl_severity_last_followup',
        'mitral-regurgitation-change': 'mitral_regurgitation_change'
    };

    
    collectFilterValues.booleanIdMap = { ...baselineBooleanFilters, ...imagingBooleanFilters, ...surgeryBooleanFilters, ...dischargeBooleanFilters, ...followupBooleanFilters };
    collectFilterValues.numericIdMap = { ...baselineNumericFilters, ...imagingNumericFilters, ...surgeryNumericFilters, ...dischargeNumericFilters, 'mean-gradient': 'aortic_valve_mean_pg' };
    collectFilterValues.categoryIdMap = categoryFilters;
    

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
        const valveTypeMapping = { '球囊扩张式': 'Balloon-expandable', '自膨胀式': 'Self-expandable' };
        filters.thv_type = valveTypeMapping[valveType] || valveType;
    }

    // 收集瓣膜品牌
    const valveBrand = document.getElementById('valve-brand')?.value;
    if (valveBrand && valveBrand.trim() !== '') filters.thv_brand = valveBrand.trim();

    // 收集瓣膜尺寸
    const valveSizeMin = document.getElementById('valve-size-min')?.value;
    const valveSizeMax = document.getElementById('valve-size-max')?.value;
    if (valveSizeMin) filters.thv_size_min = parseFloat(valveSizeMin);
    if (valveSizeMax) filters.thv_size_max = parseFloat(valveSizeMax);

    // 收集NYHA分级
    const nyhaGrades = [];
    document.querySelectorAll('input[id^="nyha-"]:checked').forEach(checkbox => { nyhaGrades.push(checkbox.value); });
    if (nyhaGrades.length > 0) filters.nyha_classification = nyhaGrades;
    
    // 收集平均跨瓣压差范围
    const meanGradientMin = document.getElementById('mean-gradient-min')?.value;
    const meanGradientMax = document.getElementById('mean-gradient-max')?.value;
    if (meanGradientMin) filters.aortic_valve_mean_pg_min = parseFloat(meanGradientMin);
    if (meanGradientMax) filters.aortic_valve_mean_pg_max = parseFloat(meanGradientMax);

    // 处理所有布尔值筛选条件
    for (const [filterId, fieldName] of Object.entries(collectFilterValues.booleanIdMap)) {
        const select = document.getElementById(filterId);
        if (select && select.value) {
            if (select.value === 'true') filters[fieldName] = true;
            else if (select.value === 'false') filters[fieldName] = false;
        }
    }

    // 处理所有数值范围筛选条件
    for (const [prefix, fieldName] of Object.entries(collectFilterValues.numericIdMap)) {
        const minInput = document.getElementById(`${prefix}-min`);
        const maxInput = document.getElementById(`${prefix}-max`);
        if (minInput && minInput.value) filters[`${fieldName}_min`] = parseFloat(minInput.value);
        if (maxInput && maxInput.value) filters[`${fieldName}_max`] = parseFloat(maxInput.value);
    }

    // 收集分类值筛选条件
    for (const [filterId, fieldName] of Object.entries(collectFilterValues.categoryIdMap)) {
        const select = document.getElementById(filterId);
        if (select && select.value) filters[fieldName] = select.value;
    }
    
    console.log('最终收集到的筛选条件:', filters);
    return filters;
}


// ==================== START: handleNaturalLanguageFilter 函数 ====================
async function handleNaturalLanguageFilter() {
    const input = document.getElementById('natural-language-input');
    const query = input.value.trim();

    if (!query) {
        showError('请输入您的筛选指令。');
        return;
    }

    console.log("智能筛选启动，查询语句:", query);
    showLoading(true);

    try {
        // 准备请求数据
        const requestData = { query };
        
        // 如果启用知识库，添加知识库信息到请求中
        if (INTELLIGENT_FILTER_CONFIG.useKnowledgeBase && fieldMapping.field_mapping) {
            requestData.knowledge_base = {
                field_mapping: fieldMapping.field_mapping,
                data_type_info: fieldMapping.data_type_info,
                units: fieldMapping.units
            };
            console.log('已加载知识库辅助AI解析:', requestData.knowledge_base);
        }

        // 1. 调用API，获取由自然语言转换而来的filters对象
        const response = await fetch(`${API_BASE_URL}/text-to-sql-to-filter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'AI服务解析失败');
        }

        const filtersFromAI = await response.json();
        console.log('从后端收到的AI生成的Filter对象:', filtersFromAI);
        
        // 2. 将AI生成的filters对象设置为当前的全局筛选条件
        currentFilters = filtersFromAI;
        
        // 3. 重置分页到第一页
        currentPage = 1;

        // 4. 【核心】直接使用这个filters对象并行加载所有数据
        console.log('开始使用AI生成的filters加载数据...');
        await Promise.all([
            loadStatistics(currentFilters),
            loadChartData(currentFilters),
            loadTableData(currentFilters, currentPage, casesPerPage)
        ]);
        
        console.log('智能筛选数据加载完成。');
        showFilterResult(); // 显示"筛选完成"的成功提示

        // 5. 【新功能】将AI解析的筛选条件映射到UI控件中，实现可解释的筛选显示
        applyFiltersToUI(currentFilters);

    } catch (error) {
        console.error('智能筛选失败:', error);
        showError(error.message);
    } finally {
        showLoading(false);
    }
}
// ==================== END: 替换结束 ====================


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
        
        // 绑定查看论文详情按钮事件
        document.getElementById('view-paper-details').onclick = () => showPaperDetail(patientId);
        
        modal.show();
    } catch (error) {
        console.error('获取病例详情失败:', error);
        showError('获取病例详情失败，请重试');
    }
}

// 显示论文详情
async function showPaperDetail(patientId) {
    try {
        // 从后端或本地数据源获取论文数据
        const paperData = await getPaperDataByPatientId(patientId);
        
        if (!paperData) {
            showError('未找到该患者对应的论文数据');
            return;
        }
        
        // 更新论文基本信息
        document.getElementById('paper-doi').textContent = paperData.doi || 'N/A';
        document.getElementById('paper-pmid').textContent = paperData.pmid || 'N/A';
        document.getElementById('paper-year').textContent = paperData.year || 'N/A';
        document.getElementById('paper-source').textContent = paperData.source || 'N/A';
        document.getElementById('paper-author').textContent = paperData.author || 'N/A';
        document.getElementById('paper-title').textContent = paperData.title || 'N/A';
        document.getElementById('paper-abstract').textContent = paperData.abstract || 'N/A';
        
        // 加载论文配图
        await loadPaperImages(paperData);
        
        // 显示论文详情模态框
        const paperModal = new bootstrap.Modal(document.getElementById('paper-detail-modal'));
        paperModal.show();
        
    } catch (error) {
        console.error('获取论文详情失败:', error);
        showError('获取论文详情失败，请重试');
    }
}

// 根据患者ID获取论文数据
async function getPaperDataByPatientId(patientId) {
    try {
        console.log(`正在查找患者ID ${patientId} 对应的论文数据...`);
        
        // 将患者ID（DOI格式，下划线分隔）转换为标准DOI格式（斜杠分隔）
        const standardDoi = patientId.replace(/_/g, '/');
        console.log(`转换后的标准DOI: ${standardDoi}`);
        
        // 首先尝试从本地数据源直接通过DOI匹配
        if (typeof taviCases !== 'undefined' && taviCases) {
            console.log(`本地数据源中有 ${taviCases.length} 条记录`);
            
            // 直接通过DOI匹配
            const caseData = taviCases.find(item => item.doi === standardDoi);
            if (caseData) {
                console.log(`通过DOI直接匹配找到论文数据:`, caseData.doi);
                return caseData;
            }
            
            // 如果直接匹配失败，尝试通过患者ID作为数字ID匹配（兼容旧版本）
            const numericId = parseInt(patientId);
            if (!isNaN(numericId)) {
                const caseDataById = taviCases.find(item => item.id === numericId);
                if (caseDataById) {
                    console.log(`通过数字ID匹配找到论文数据:`, caseDataById.doi);
                    return caseDataById;
                }
            }
        }
        
        // 尝试从后端数据获取（如果有对应的映射关系）
        try {
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
            
            if (response.ok) {
                const result = await response.json();
                const patientData = result.data && result.data[0];
                
                if (patientData && patientData.patient_id) {
                    // 将患者数据中的patient_id转换为标准DOI格式
                    const patientDoi = patientData.patient_id.replace(/_/g, '/');
                    console.log(`从后端获取到的患者DOI: ${patientDoi}`);
                    
                    // 尝试根据DOI查找论文数据
                    const paperData = taviCases?.find(item => item.doi === patientDoi);
                    if (paperData) {
                        console.log(`通过后端DOI找到匹配的论文数据:`, paperData.doi);
                        return paperData;
                    }
                }
            }
        } catch (apiError) {
            console.warn('后端API查询失败:', apiError);
        }
        
        console.warn(`未找到患者ID ${patientId} 对应的论文数据`);
        console.warn(`尝试过的DOI格式: ${standardDoi}`);
        
        // 调试信息：列出所有可用的DOI
        if (typeof taviCases !== 'undefined' && taviCases) {
            console.log('所有可用的DOI:', taviCases.map(item => item.doi));
        }
        
        return null;
        
    } catch (error) {
        console.error('获取论文数据失败:', error);
        return null;
    }
}

// 加载论文配图
async function loadPaperImages(paperData) {
    const imagesContainer = document.getElementById('paper-images-container');
    
    try {
        // 显示加载中状态
        imagesContainer.innerHTML = '<div class="loading-message"><i class="bi bi-clock"></i> 正在加载图片...</div>';
        
        // 检查是否有图片数据
        if (!paperData.Files || !paperData.Files.Images || paperData.Files.Images.length === 0) {
            imagesContainer.innerHTML = '<div class="alert alert-warning">该论文没有配图</div>';
            return;
        }
        
        // 清空容器
        imagesContainer.innerHTML = '';
        
        // 渲染所有图片
        paperData.Files.Images.forEach((image, index) => {
            const imageContainer = createPaperImageContainer(image, index, paperData.doi);
            imagesContainer.appendChild(imageContainer);
        });
        
    } catch (error) {
        console.error('加载论文配图失败:', error);
        imagesContainer.innerHTML = '<div class="error-message">图片加载失败</div>';
    }
}

// 创建论文图片容器
function createPaperImageContainer(image, index, doi) {
    // 创建主容器
    const imageDiv = document.createElement('div');
    imageDiv.className = 'image-container';
    
    // 创建图片包装器
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'image-wrapper';
    
    // 创建图注元素
    const caption = document.createElement('p');
    caption.className = 'image-caption';
    caption.textContent = image.caption || '无图注';
    
    // 创建图片元素
    const img = document.createElement('img');
    
    // 修正图片路径 - 使用正确的相对路径
    const correctedPath = image.path.replace(/^.*extract_downloads/, './data/extract_downloads');
    img.src = correctedPath;
    img.alt = `论文配图 ${index + 1}`;
    img.className = 'case-image';
    
    // 添加图片加载错误处理
    img.onerror = function() {
        handlePaperImageError(this, image.path, doi);
    };
    
    // 添加图片点击放大功能
    img.onclick = function() {
        showImageModal(this.src, caption.textContent);
    };
    
    // 按顺序添加元素
    imageWrapper.appendChild(caption);
    imageWrapper.appendChild(img);
    imageDiv.appendChild(imageWrapper);
    
    return imageDiv;
}

// 处理论文图片加载错误
function handlePaperImageError(imgElement, originalPath, doi) {
    // 构建可能的DOI文件夹名称变体
    const doiFolderVariations = [
        doi,
        doi.replace(/\./g, '_'),
        doi + '.Cureus',
        doi.replace(/\./g, '_') + '.Cureus'
    ];
    
    // 构建图片文件名
    const fileName = originalPath.split('/').pop();
    
    // 尝试多种可能的路径格式
    const pathVariations = [
        // 原始路径的修正版本
        originalPath.replace(/^.*extract_downloads/, './data/extract_downloads'),
        // 替换常见的基础路径
        originalPath.replace('D:/Romy/SAIRI/TAVI/Code/extract_downloads', './data/extract_downloads'),
        originalPath.replace(/^.*\/extract_downloads/, './data/extract_downloads'),
        // 基于DOI构建路径
        ...doiFolderVariations.map(folder => `./data/extract_downloads/${folder}/images/${fileName}`)
    ];
    
    // 移除重复路径
    const uniquePaths = [...new Set(pathVariations)];
    
    // 尝试下一个备用路径
    const attemptCount = parseInt(imgElement.dataset.attemptCount || '0');
    if (attemptCount < uniquePaths.length) {
        imgElement.dataset.attemptCount = (attemptCount + 1).toString();
        imgElement.src = uniquePaths[attemptCount];
        console.log(`尝试加载图片路径 ${attemptCount + 1}/${uniquePaths.length}: ${uniquePaths[attemptCount]}`);
        return;
    }
    
    // 所有路径都失败，显示错误信息
    console.error(`所有图片路径都失败，原始路径: ${originalPath}, DOI: ${doi}`);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-warning';
    errorDiv.innerHTML = `
        <strong>图片无法加载</strong><br>
        <small>已尝试多种路径格式，图片文件可能不存在</small>
        <details class="mt-2">
            <summary>调试信息</summary>
            <small>原始路径: ${originalPath}<br>
            DOI: ${doi}<br>
            尝试的路径: ${uniquePaths.join('<br>')}</small>
        </details>
    `;
    
    // 替换图片元素
    imgElement.parentNode.replaceChild(errorDiv, imgElement);
}

// 显示图片放大模态框
function showImageModal(imageSrc, caption) {
    // 创建临时模态框来显示大图
    const modalHtml = `
        <div class="modal fade" id="image-modal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">图片预览</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="${imageSrc}" class="img-fluid" alt="图片预览">
                        <p class="mt-2 text-muted">${caption}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 移除已存在的图片模态框
    const existingModal = document.getElementById('image-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 添加新的模态框
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // 显示模态框
    const imageModal = new bootstrap.Modal(document.getElementById('image-modal'));
    imageModal.show();
    
    // 模态框关闭后移除DOM元素
    document.getElementById('image-modal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
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
document.head.appendChild(style); 










// === RAGFlow 智能问答悬浮窗控制逻辑 - 最终整合版 ===
document.addEventListener('DOMContentLoaded', function() {
    // 1. 获取所有需要的元素
    const toggleBtn = document.getElementById('ragflow-chat-toggle-btn');
    const chatContainer = document.getElementById('ragflow-chat-container');
    const chatWidget = document.getElementById('ragflow-chat-widget');
    const chatHeader = document.getElementById('ragflow-chat-header');
    const closeBtn = document.getElementById('ragflow-chat-close-btn');
    const guidanceBubble = document.getElementById('ragflow-guidance-bubble');
    
    // 2. 确保所有关键元素都存在
    if (!toggleBtn || !chatContainer || !chatWidget || !chatHeader || !closeBtn || !guidanceBubble) {
        console.error("🚨 RAGFlow Widget: One or more essential elements are missing from the DOM.");
        console.log('🔧 RAGFlow 元素检查:', {
            toggleBtn: !!toggleBtn,
            chatContainer: !!chatContainer, 
            chatWidget: !!chatWidget,
            chatHeader: !!chatHeader,
            closeBtn: !!closeBtn,
            guidanceBubble: !!guidanceBubble
        });
        return;
    }
    // 移除iframe检查，因为我们现在使用自定义聊天界面
    // const iframe = chatContainer.querySelector('iframe');
    
    console.log('✅ RAGFlow Widget: 所有关键元素已找到，开始初始化');
    console.log('🔧 RAGFlow Widget位置:', {
        display: getComputedStyle(chatWidget).display,
        visibility: getComputedStyle(chatWidget).visibility,
        zIndex: getComputedStyle(chatWidget).zIndex,
        position: getComputedStyle(chatWidget).position
    });

    // =================================================================
    // 模块一：引导气泡控制 (每次刷新都出现)
    // =================================================================
    const hideBubble = () => {
        if (!guidanceBubble.classList.contains('hidden')) {
            guidanceBubble.classList.add('hidden');
        }
    };
    
    // 页面加载后，准备触发冒泡动画
    setTimeout(() => {
        // 直接移除 'hidden' 类，让动画在每次刷新时都播放
        guidanceBubble.classList.remove('hidden');
    }, 500);

    const handleInteractionAndHideBubble = () => {
        hideBubble();
    };

    const handleBubbleClick = () => {
        handleInteractionAndHideBubble();
        if (!chatContainer.classList.contains('show')) {
            chatContainer.classList.add('show');
        }
    };

    guidanceBubble.addEventListener('click', handleBubbleClick);
    
    // 🔧 修改：只在点击页面其他区域时隐藏引导气泡，不影响聊天窗口
    document.addEventListener('click', (e) => {
        // 只有当聊天窗口未打开时，才隐藏引导气泡
        if (!chatWidget.contains(e.target) && !chatContainer.classList.contains('show')) {
            handleInteractionAndHideBubble();
        }
    }, true);


    // =================================================================
    // 模块二：入口悬浮球与聊天窗口交互
    // =================================================================
    let isDraggingWidget = false;
    let hasDragged = false;
    let widgetOffsetX, widgetOffsetY;

    const saveWidgetPosition = (x, y) => localStorage.setItem('ragflow_widget_pos', JSON.stringify({ x, y }));

    const loadWidgetPosition = () => {
        console.log('🔧 RAGFlow: 开始加载widget位置');
        
        // 清理旧的样式，确保left/top生效
        chatWidget.style.right = 'auto';
        chatWidget.style.bottom = 'auto';
        
        const pos = JSON.parse(localStorage.getItem('ragflow_widget_pos'));
        if (pos) {
            console.log('🔧 RAGFlow: 从localStorage加载位置:', pos);
            const winWidth = window.innerWidth, winHeight = window.innerHeight;
            let newX = Math.max(20, Math.min(pos.x, winWidth - chatWidget.offsetWidth - 20));
            let newY = Math.max(20, Math.min(pos.y, winHeight - chatWidget.offsetHeight - 20));
            chatWidget.style.left = newX + 'px';
            chatWidget.style.top = newY + 'px';
            console.log('🔧 RAGFlow: 设置位置为:', newX, newY);
        } else {
            // 如果没有保存的位置，使用CSS的初始位置
            console.log('🔧 RAGFlow: 使用默认位置');
            const initialRight = 50; // 固定边距，避免getComputedStyle问题
            const initialBottom = 30;
            const newX = window.innerWidth - chatWidget.offsetWidth - initialRight;
            const newY = window.innerHeight - chatWidget.offsetHeight - initialBottom;
            chatWidget.style.left = Math.max(20, newX) + 'px';
            chatWidget.style.top = Math.max(20, newY) + 'px';
            console.log('🔧 RAGFlow: 设置默认位置为:', newX, newY);
        }
        
        // 确保widget可见
        chatWidget.style.display = 'block';
        chatWidget.style.visibility = 'visible';
        console.log('🔧 RAGFlow: widget位置加载完成');
    };
    // 延迟加载，确保widget渲染完毕获取正确尺寸
    setTimeout(loadWidgetPosition, 100);
    
    // 🔧 添加定期检查，确保widget不会意外消失
    setInterval(() => {
        if (chatWidget && (chatWidget.style.display === 'none' || chatWidget.style.visibility === 'hidden')) {
            console.warn('🚨 RAGFlow: 检测到widget被隐藏，正在恢复显示');
            chatWidget.style.display = 'block';
            chatWidget.style.visibility = 'visible';
        }
        if (toggleBtn && (toggleBtn.style.display === 'none' || toggleBtn.style.visibility === 'hidden')) {
            console.warn('🚨 RAGFlow: 检测到悬浮球被隐藏，正在恢复显示');
            toggleBtn.style.display = 'flex';
            toggleBtn.style.visibility = 'visible';
        }
    }, 5000); // 每5秒检查一次

    toggleBtn.addEventListener('mousedown', (e) => {
        isDraggingWidget = true;
        hasDragged = false;
        widgetOffsetX = e.clientX - chatWidget.offsetLeft;
        widgetOffsetY = e.clientY - chatWidget.offsetTop;
        document.body.style.userSelect = 'none';
        
        handleInteractionAndHideBubble();
    });

    toggleBtn.addEventListener('click', (e) => {
        console.log('🔧 RAGFlow: 悬浮球被点击了');
        if (hasDragged) {
            e.preventDefault();
            console.log('🔧 RAGFlow: 检测到拖拽，忽略点击');
            return;
        }
        handleInteractionAndHideBubble();
        chatContainer.classList.toggle('show');
        console.log('🔧 RAGFlow: 聊天窗口状态:', chatContainer.classList.contains('show'));
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chatContainer.classList.remove('show');
    });

    // =================================================================
    // 模块三：聊天窗口全方位调整大小
    // =================================================================
    let isResizing = false;
    let currentResizeDirection = '';
    let originalWidth, originalHeight, originalMouseX, originalMouseY, originalLeft, originalTop;

    const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
    directions.forEach(dir => {
        const handle = document.createElement('div');
        handle.className = `ragflow-resizer-handle handle-${dir}`;
        handle.dataset.direction = dir;
        chatContainer.appendChild(handle);
        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isResizing = true;
            currentResizeDirection = dir;
            originalWidth = chatContainer.offsetWidth;
            originalHeight = chatContainer.offsetHeight;
            originalMouseX = e.pageX;
            originalMouseY = e.pageY;
            originalLeft = chatContainer.offsetLeft;
            originalTop = chatContainer.offsetTop;
            // iframe.style.pointerEvents = 'none'; // 不再需要iframe
            document.body.style.userSelect = 'none';
        });
    });

    // =================================================================
    // 模块四：聊天窗口拖拽移动 (联动版)
    // =================================================================
    let isDraggingContainer = false;
    let containerDragOffsetX, containerDragOffsetY;

    chatHeader.addEventListener('mousedown', (e) => {
        if (e.target.closest('.chat-header-btn')) return;
        e.preventDefault();
        isDraggingContainer = true;
        containerDragOffsetX = e.clientX - chatWidget.offsetLeft;
        containerDragOffsetY = e.clientY - chatWidget.offsetTop;
        // iframe.style.pointerEvents = 'none'; // 不再需要iframe
        document.body.style.userSelect = 'none';
    });

    // =================================================================
    // 统一的全局事件监听器
    // =================================================================
    function handleMouseMove(e) {
        // 阻止默认行为，特别是在拖拽时
        e.preventDefault();
        
        if (isDraggingWidget) {
            hasDragged = true;
            let newX = e.clientX - widgetOffsetX;
            let newY = e.clientY - widgetOffsetY;
            const winWidth = window.innerWidth, winHeight = window.innerHeight;
            newX = Math.max(0, Math.min(newX, winWidth - chatWidget.offsetWidth));
            newY = Math.max(0, Math.min(newY, winHeight - chatWidget.offsetHeight));
            chatWidget.style.left = newX + 'px';
            chatWidget.style.top = newY + 'px';
        } else if (isResizing) {
            const dx = e.pageX - originalMouseX, dy = e.pageY - originalMouseY;
            let newWidth = originalWidth, newHeight = originalHeight, newLeft = originalLeft, newTop = originalTop;
            const minWidth = parseInt(getComputedStyle(chatContainer).minWidth), minHeight = parseInt(getComputedStyle(chatContainer).minHeight);
            if (currentResizeDirection.includes('e')) newWidth = originalWidth + dx;
            if (currentResizeDirection.includes('w')) { newWidth = originalWidth - dx; newLeft = originalLeft + dx; }
            if (currentResizeDirection.includes('s')) newHeight = originalHeight + dy;
            if (currentResizeDirection.includes('n')) { newHeight = originalHeight - dy; newTop = originalTop + dy; }
            if (newWidth < minWidth) { if (currentResizeDirection.includes('w')) newLeft -= (minWidth - newWidth); newWidth = minWidth; }
            if (newHeight < minHeight) { if (currentResizeDirection.includes('n')) newTop -= (minHeight - newHeight); newHeight = minHeight; }
            chatContainer.style.width = newWidth + 'px';
            chatContainer.style.height = newHeight + 'px';
            // resizing 不改变 widget 的 left/top
        } else if (isDraggingContainer) {
            let newX = e.clientX - containerDragOffsetX;
            let newY = e.clientY - containerDragOffsetY;
            const winWidth = window.innerWidth, winHeight = window.innerHeight;
            newX = Math.max(0, Math.min(newX, winWidth - chatWidget.offsetWidth));
            newY = Math.max(0, Math.min(newY, winHeight - chatWidget.offsetHeight));
            chatWidget.style.left = newX + 'px';
            chatWidget.style.top = newY + 'px';
        }
    }

    function handleMouseUp() {
        const isChatClosed = !chatContainer.classList.contains('show');

        if (isDraggingWidget && hasDragged && isChatClosed) {
            // --- 最终版智能贴边逻辑 ---
            const winWidth = window.innerWidth;
            const safetyMargin = parseInt(getComputedStyle(chatWidget).right) || 50;
            const widgetWidth = chatWidget.offsetWidth;
            let finalX = chatWidget.offsetLeft;

            if (finalX + widgetWidth / 2 < winWidth / 2) {
                finalX = safetyMargin; 
            } else {
                finalX = winWidth - widgetWidth - safetyMargin;
            }
            
            chatWidget.style.transition = 'left 0.3s ease-in-out';
            chatWidget.style.left = finalX + 'px';
            saveWidgetPosition(finalX, chatWidget.offsetTop);
            setTimeout(() => { chatWidget.style.transition = ''; }, 300);

        } else if ((isDraggingWidget && hasDragged) || isDraggingContainer) {
            saveWidgetPosition(chatWidget.offsetLeft, chatWidget.offsetTop);
        }
        
        if (isResizing || isDraggingContainer) {
            // iframe.style.pointerEvents = 'auto'; // 不再需要iframe
        }
        
        isDraggingWidget = isResizing = isDraggingContainer = false;
        hasDragged = false;
        document.body.style.userSelect = 'auto';
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
});

// ==================== START: 新增的将filters对象映射到UI控件的函数 ====================
function applyFiltersToUI(filters) {
    console.log('开始将filters对象映射到UI控件:', filters);
    
    // 1. 清空所有现有的筛选条件
    document.querySelectorAll('.filter-content input[type="text"], .filter-content input[type="number"]').forEach(i => i.value = '');
    document.querySelectorAll('.filter-content input[type="checkbox"], .filter-content input[type="radio"]').forEach(i => i.checked = false);
    document.querySelectorAll('.filter-content select').forEach(s => s.value = '');
    
    // 用于存储解析结果摘要的数组
    const filterSummary = [];
    
    // 2. 处理年龄范围
    if (filters.age_min !== undefined || filters.age_max !== undefined) {
        const ageMinInput = document.getElementById('age-min');
        const ageMaxInput = document.getElementById('age-max');
        
        let ageText = '年龄';
        if (filters.age_min !== undefined && filters.age_max !== undefined) {
            if (ageMinInput) ageMinInput.value = filters.age_min;
            if (ageMaxInput) ageMaxInput.value = filters.age_max;
            ageText += `: ${filters.age_min}-${filters.age_max}岁`;
        } else if (filters.age_min !== undefined) {
            if (ageMinInput) ageMinInput.value = filters.age_min;
            ageText += `: ≥${filters.age_min}岁`;
        } else if (filters.age_max !== undefined) {
            if (ageMaxInput) ageMaxInput.value = filters.age_max;
            ageText += `: ≤${filters.age_max}岁`;
        }
        filterSummary.push({ type: 'basic-info', text: ageText, icon: 'bi-person' });
    }
    
    // 3. 处理性别
    if (filters.gender) {
        const genders = Array.isArray(filters.gender) ? filters.gender : [filters.gender];
        const genderTexts = [];
        genders.forEach(gender => {
            if (gender === 'Male' || gender === 'male') {
                const maleCheckbox = document.getElementById('gender-male');
                if (maleCheckbox) maleCheckbox.checked = true;
                genderTexts.push('男性');
            }
            if (gender === 'Female' || gender === 'female') {
                const femaleCheckbox = document.getElementById('gender-female');
                if (femaleCheckbox) femaleCheckbox.checked = true;
                genderTexts.push('女性');
            }
        });
        if (genderTexts.length > 0) {
            filterSummary.push({ type: 'basic-info', text: `性别: ${genderTexts.join('或')}`, icon: 'bi-gender-ambiguous' });
        }
    }
    
    // 4. 处理BMI范围
    if (filters.bmi_min !== undefined || filters.bmi_max !== undefined) {
        const bmiMinInput = document.getElementById('bmi-min');
        const bmiMaxInput = document.getElementById('bmi-max');
        
        let bmiText = 'BMI';
        if (filters.bmi_min !== undefined && filters.bmi_max !== undefined) {
            if (bmiMinInput) bmiMinInput.value = filters.bmi_min;
            if (bmiMaxInput) bmiMaxInput.value = filters.bmi_max;
            bmiText += `: ${filters.bmi_min}-${filters.bmi_max}`;
        } else if (filters.bmi_min !== undefined) {
            if (bmiMinInput) bmiMinInput.value = filters.bmi_min;
            bmiText += `: ≥${filters.bmi_min}`;
        } else if (filters.bmi_max !== undefined) {
            if (bmiMaxInput) bmiMaxInput.value = filters.bmi_max;
            bmiText += `: ≤${filters.bmi_max}`;
        }
        filterSummary.push({ type: 'basic-info', text: bmiText, icon: 'bi-calculator' });
    }
    
    // 5. 处理NYHA分级
    if (filters.nyha_classification) {
        const nyhaGrades = Array.isArray(filters.nyha_classification) ? filters.nyha_classification : [filters.nyha_classification];
        nyhaGrades.forEach(grade => {
            const nyhaCheckbox = document.getElementById(`nyha-${grade.toLowerCase()}`);
            if (nyhaCheckbox) nyhaCheckbox.checked = true;
        });
        filterSummary.push({ type: 'basic-info', text: `NYHA分级: ${nyhaGrades.join('、')}`, icon: 'bi-heart' });
    }
    
    // 6. 处理瓣膜类型
    if (filters.thv_type) {
        const valveTypeSelect = document.getElementById('valve-type');
        if (valveTypeSelect) {
            // 反向映射瓣膜类型
            const valveTypeReverseMapping = { 
                'Balloon-expandable': '球囊扩张式', 
                'Self-expandable': '自膨胀式' 
            };
            const displayValue = valveTypeReverseMapping[filters.thv_type] || filters.thv_type;
            valveTypeSelect.value = displayValue;
            filterSummary.push({ type: 'surgery', text: `瓣膜类型: ${displayValue}`, icon: 'bi-gear' });
        }
    }
    
    // 7. 处理瓣膜品牌
    if (filters.thv_brand) {
        const valveBrandSelect = document.getElementById('valve-brand');
        if (valveBrandSelect) {
            valveBrandSelect.value = filters.thv_brand;
            filterSummary.push({ type: 'surgery', text: `瓣膜品牌: ${filters.thv_brand}`, icon: 'bi-tag' });
        }
    }
    
    // 8. 处理布尔值筛选条件
    // 从collectFilterValues中获取映射关系
    const booleanMapping = {
        // 基线资料
        'atrial_fibrillation': { id: 'atrial-fibrillation', name: '房颤', type: 'basic-info' },
        'myocardial_infarction': { id: 'myocardial-infarction', name: '心梗', type: 'basic-info' },
        'pci_history': { id: 'pci-history', name: 'PCI史', type: 'basic-info' },
        'cabg_history': { id: 'cabg-history', name: 'CABG史', type: 'basic-info' },
        'diabetes_mellitus': { id: 'diabetes', name: '糖尿病', type: 'basic-info' },
        'hypertension': { id: 'hypertension', name: '高血压', type: 'basic-info' },
        'hyperlipidemia': { id: 'hyperlipidemia', name: '高脂血症', type: 'basic-info' },
        'coronary_artery_disease': { id: 'coronary-artery-disease', name: '冠心病', type: 'basic-info' },
        'copd': { id: 'copd', name: '慢阻肺', type: 'basic-info' },
        'dialysis': { id: 'dialysis', name: '透析', type: 'basic-info' },
        'acei_arb': { id: 'acei-arb', name: 'ACEI/ARB', type: 'basic-info' },
        'beta_blocker': { id: 'beta-blocker', name: 'Beta受体阻滞剂', type: 'basic-info' },
        'calcium_blocker': { id: 'calcium-blocker', name: '钙离子阻滞剂', type: 'basic-info' },
        'diuretic': { id: 'diuretic', name: '利尿剂', type: 'basic-info' },
        'aspirin': { id: 'aspirin', name: '阿司匹林', type: 'basic-info' },
        'anticoagulant': { id: 'anticoagulant', name: '抗凝药', type: 'basic-info' },
        'statins': { id: 'statins', name: '他汀类药物', type: 'basic-info' },
        'sglt2_inhibitors': { id: 'sglt2-inhibitors', name: 'SGLT2抑制剂', type: 'basic-info' },
        // 术前影像学评估
        'moderate_severe_ar': { id: 'moderate-severe-ar', name: '中度以上主动脉瓣反流', type: 'imaging' },
        'moderate_severe_mr': { id: 'moderate-severe-mr', name: '中度以上二尖瓣反流', type: 'imaging' },
        // 手术信息
        'transfemoral_access': { id: 'transfemoral-access', name: '经股动脉入路', type: 'surgery' },
        'transapical_access': { id: 'transapical-access', name: '经心尖入路', type: 'surgery' },
        'mean_pg_gte_20': { id: 'mean-pg-gte-20', name: '跨瓣压差≥20mmHg', type: 'surgery' },
        'prosthesis_malposition': { id: 'prosthesis-malposition', name: '严重错位', type: 'surgery' },
        'annular_rupture': { id: 'annular-rupture', name: '瓣环撕裂', type: 'surgery' },
        'immediate_pvl_occurred': { id: 'immediate-pvl', name: '术后即刻瓣周漏', type: 'surgery' },
        'thv_displacement': { id: 'valve-displacement', name: '瓣架移位', type: 'surgery' },
        'conversion_to_savr': { id: 'conversion-to-savr', name: '转外科开胸', type: 'surgery' },
        'cpb_required': { id: 'cpb-required', name: '转心肺转流', type: 'surgery' },
        'valve_in_valve': { id: 'valve-in-valve', name: '瓣中瓣', type: 'surgery' },
        'periprocedural_death': { id: 'periprocedural-death', name: '围术期死亡', type: 'surgery' },
        'pre_dilation': { id: 'pre-dilatation', name: '预扩张', type: 'surgery' },
        'post_dilation': { id: 'post-dilatation', name: '后扩张', type: 'surgery' },
        'excessive_oversizing': { id: 'excessive-oversizing', name: '过大尺寸', type: 'surgery' },
        'oversizing_gte_15': { id: 'oversizing-gte-15', name: '尺寸过大≥15%', type: 'surgery' },
        // 出院前评价
        'death_before_discharge': { id: 'death-before-discharge', name: '出院前死亡', type: 'discharge' },
        'stroke_before_discharge': { id: 'stroke-before-discharge', name: '卒中', type: 'discharge' },
        'major_bleeding': { id: 'major-bleeding', name: '大出血', type: 'discharge' },
        'aki': { id: 'acute-kidney-injury', name: '急性肾衰', type: 'discharge' },
        'major_vascular_complication': { id: 'major-vascular-complications', name: '严重血管并发症', type: 'discharge' },
        'mi_ami': { id: 'mi-ami', name: '心肌梗死/急性心肌梗死', type: 'discharge' },
        'heart_failure': { id: 'heart-failure', name: '心力衰竭', type: 'discharge' },
        'all_cause_cv_death': { id: 'all-cause-cv-death', name: '所有原因死亡和心血管死亡', type: 'discharge' },
        'pacemaker_implantation': { id: 'pacemaker-implantation', name: '起搏器植入', type: 'discharge' },
        'pvl_detected': { id: 'pvl-detected', name: '瓣周漏', type: 'discharge' },
        'acs_ihd': { id: 'acs-ihd', name: '急性冠脉综合征/缺血性心脏病', type: 'discharge' },
        // 随访信息
        'mortality_30d': { id: 'death-30-days', name: '30天全因死亡', type: 'followup' },
        'mi_30d': { id: 'mi-30-days', name: '30天心梗', type: 'followup' },
        'stroke_30d': { id: 'stroke-30-days', name: '30天卒中', type: 'followup' },
        'hf_readmission_30d': { id: 'hf-readmission-30-days', name: '30天心衰再住院', type: 'followup' },
        'mortality_1y': { id: 'death-1-year', name: '1年全因死亡', type: 'followup' },
        'mi_1y': { id: 'mi-1-year', name: '1年心梗', type: 'followup' },
        'stroke_1y': { id: 'stroke-1-year', name: '1年卒中', type: 'followup' },
        'hf_readmission_1y': { id: 'hf-readmission-1-year', name: '1年心衰再住院', type: 'followup' },
        'subsequent_intervention': { id: 'subsequent-intervention', name: '因TAVI并发症接受后续干预', type: 'followup' },
        'occlusion_procedure': { id: 'occlusion-procedure', name: '术后封堵', type: 'followup' },
        'valve_dislodgement': { id: 'valve-dislodgement', name: '术后瓣膜脱落', type: 'followup' },
        'aortic_dissection': { id: 'aortic-dissection', name: '术后主动脉夹层', type: 'followup' },
        'hematoma': { id: 'hematoma', name: '术后血肿', type: 'followup' },
        'reoperation': { id: 'reoperation', name: '二次手术', type: 'followup' },
        'conversion_to_open_surgery': { id: 'conversion-to-open-surgery', name: '术后中转开胸', type: 'followup' },
        'pacemaker_post_tavi': { id: 'pacemaker-post-tavi', name: '术后起搏器植入', type: 'followup' },
        'heart_failure_post': { id: 'heart-failure-post', name: '术后心衰', type: 'followup' }
    };
    
    Object.entries(booleanMapping).forEach(([filterKey, config]) => {
        if (filters[filterKey] !== undefined) {
            const select = document.getElementById(config.id);
            if (select) {
                select.value = filters[filterKey] ? 'true' : 'false';
                const statusText = filters[filterKey] ? '是' : '否';
                filterSummary.push({ 
                    type: config.type, 
                    text: `${config.name}: ${statusText}`, 
                    icon: config.type === 'basic-info' ? 'bi-check-circle' : 
                          config.type === 'imaging' ? 'bi-camera' :
                          config.type === 'surgery' ? 'bi-scissors' :
                          config.type === 'discharge' ? 'bi-hospital' : 'bi-arrow-repeat'
                });
            }
        }
    });
    
    // 9. 处理数值范围筛选条件
    const numericMapping = {
        // 基线资料
        'sts_score': { id: 'sts-score', name: 'STS评分', unit: '%', type: 'basic-info' },
        'nt_probnp': { id: 'nt-probnp', name: 'NT-proBNP', unit: 'pg/ml', type: 'basic-info' },
        'surface_area': { id: 'surface-area', name: '体表面积', unit: 'm²', type: 'basic-info' },
        // 术前影像学评估
        'lvef': { id: 'lvef', name: 'LVEF', unit: '%', type: 'imaging' },
        'aortic_valve_peak_pg': { id: 'max-gradient', name: '最大跨瓣压差', unit: 'mmHg', type: 'imaging' },
        'aortic_valve_mean_pg': { id: 'mean-gradient', name: '平均跨瓣压差', unit: 'mmHg', type: 'imaging' },
        'aortic_valve_eoa': { id: 'eoa', name: '有效瓣口面积', unit: 'cm²', type: 'imaging' },
        'annular_area': { id: 'annular-area', name: '瓣环面积', unit: 'cm²', type: 'imaging' },
        'annular_mean_diameter': { id: 'annular-mean-diameter', name: '瓣环平均直径', unit: 'mm', type: 'imaging' },
        'annular_max_diameter': { id: 'annular-max-diameter', name: '瓣环最大直径', unit: 'mm', type: 'imaging' },
        'annular_min_diameter': { id: 'annular-min-diameter', name: '瓣环最小直径', unit: 'mm', type: 'imaging' },
        'annular_perimeter': { id: 'annular-perimeter', name: '瓣环周径', unit: 'mm', type: 'imaging' },
        'annular_calcification': { id: 'annular-calcification', name: '瓣环钙化', unit: 'mm³', type: 'imaging' },
        'supraannular_calcification': { id: 'supraannular-calcification', name: '瓣环上钙化', unit: 'mm³', type: 'imaging' },
        'aortic_valve_flow_velocity': { id: 'valve-velocity', name: '瓣口流速', unit: 'm/s', type: 'imaging' },
        'stj_height': { id: 'stj-height', name: '窦管交界高度', unit: 'mm', type: 'imaging' },
        'stj_diameter': { id: 'stj-diameter', name: '窦管交界直径', unit: 'mm', type: 'imaging' },
        'sinus_diameter': { id: 'sinus-diameter', name: '窦部直径', unit: 'mm', type: 'imaging' },
        'ascending_aorta_diameter': { id: 'ascending-aorta-diameter', name: '升主动脉直径', unit: 'mm', type: 'imaging' },
        'lvot_diameter': { id: 'lvot-diameter', name: 'LVOT直径', unit: 'mm', type: 'imaging' },
        'lvot_calcification': { id: 'lvot-calcification', name: 'LVOT钙化体积', unit: 'mm³', type: 'imaging' },
        'left_coronary_height': { id: 'lca-height', name: '左冠脉高度', unit: 'mm', type: 'imaging' },
        'right_coronary_height': { id: 'rca-height', name: '右冠脉高度', unit: 'mm', type: 'imaging' },
        'aortic_valve_eoai': { id: 'eoai', name: '有效瓣口面积指数', unit: 'cm²/m²', type: 'imaging' },
        'lvedv': { id: 'lvedv', name: '左心室舒张末期容积', unit: 'ml', type: 'imaging' },
        'lvesv': { id: 'lvesv', name: '左心室收缩末期容积', unit: 'ml', type: 'imaging' },
        // 手术信息
        'thv_size': { id: 'valve-size', name: '瓣膜尺寸', unit: 'mm', type: 'surgery' },
        'immediate_mean_pg': { id: 'post-mean-pg', name: '术后即刻跨瓣压差', unit: 'mmHg', type: 'surgery' },
        'total_procedure_time': { id: 'total-procedure-time', name: '总术时', unit: 'min', type: 'surgery' },
        'fluoroscopy_time': { id: 'fluoroscopy-time', name: '造影时间', unit: 'min', type: 'surgery' },
        'contrast_volume': { id: 'contrast-volume', name: '造影量', unit: 'ml', type: 'surgery' },
        'immediate_lvef': { id: 'immediate-lvef', name: '术后即刻LVEF', unit: '%', type: 'surgery' },
        // 出院前评价
        'flow_velocity': { id: 'flow-velocity', name: '主动脉瓣口流速', unit: 'm/s', type: 'discharge' },
        'mean_pg': { id: 'mean-pg', name: '平均跨瓣压差', unit: 'mmHg', type: 'discharge' },
        'max_pg': { id: 'max-pg', name: '最大跨瓣压差', unit: 'mmHg', type: 'discharge' }
    };
    
    Object.entries(numericMapping).forEach(([filterPrefix, config]) => {
        const hasMin = filters[`${filterPrefix}_min`] !== undefined;
        const hasMax = filters[`${filterPrefix}_max`] !== undefined;
        
        if (hasMin || hasMax) {
            const minInput = document.getElementById(`${config.id}-min`);
            const maxInput = document.getElementById(`${config.id}-max`);
            
            let rangeText = config.name;
            if (hasMin && hasMax) {
                if (minInput) minInput.value = filters[`${filterPrefix}_min`];
                if (maxInput) maxInput.value = filters[`${filterPrefix}_max`];
                rangeText += `: ${filters[`${filterPrefix}_min`]}-${filters[`${filterPrefix}_max`]}${config.unit}`;
            } else if (hasMin) {
                if (minInput) minInput.value = filters[`${filterPrefix}_min`];
                rangeText += `: ≥${filters[`${filterPrefix}_min`]}${config.unit}`;
            } else if (hasMax) {
                if (maxInput) maxInput.value = filters[`${filterPrefix}_max`];
                rangeText += `: ≤${filters[`${filterPrefix}_max`]}${config.unit}`;
            }
            
            filterSummary.push({ 
                type: config.type, 
                text: rangeText, 
                icon: config.type === 'basic-info' ? 'bi-bar-chart' : 
                      config.type === 'imaging' ? 'bi-rulers' :
                      config.type === 'surgery' ? 'bi-speedometer' : 'bi-graph-up'
            });
        }
    });
    
    // 10. 处理分类值筛选条件
    const categoryMapping = {
        'other_access': { id: 'other-access', name: '其它入路', type: 'surgery' },
        'immediate_pvl_severity': { id: 'immediate-pvl-severity', name: '术后即刻瓣周漏程度', type: 'surgery' },
        'pvl_severity': { id: 'discharge-pvl-severity', name: '出院前瓣周漏程度', type: 'discharge' },
        'pvl_severity_last_followup': { id: 'followup-pvl-severity', name: '随访瓣周漏程度', type: 'followup' },
        'mitral_regurgitation_change': { id: 'mitral-regurgitation-change', name: '二尖瓣返流变化', type: 'discharge' }
    };
    
    Object.entries(categoryMapping).forEach(([filterKey, config]) => {
        if (filters[filterKey] !== undefined) {
            const select = document.getElementById(config.id);
            if (select) {
                select.value = filters[filterKey];
                filterSummary.push({ 
                    type: config.type, 
                    text: `${config.name}: ${filters[filterKey]}`, 
                    icon: 'bi-list-ul'
                });
            }
        }
    });
    
    // 11. 处理未识别的其他字段（通用处理）
    const processedKeys = new Set([
        'age_min', 'age_max', 'gender', 'bmi_min', 'bmi_max', 'nyha_classification', 
        'thv_type', 'thv_brand'
    ]);
    
    // 添加已处理的布尔值字段
    Object.keys(booleanMapping).forEach(key => processedKeys.add(key));
    
    // 添加已处理的数值范围字段
    Object.keys(numericMapping).forEach(prefix => {
        processedKeys.add(`${prefix}_min`);
        processedKeys.add(`${prefix}_max`);
    });
    
    // 添加已处理的分类字段
    Object.keys(categoryMapping).forEach(key => processedKeys.add(key));
    
    // 处理其他未识别的字段
    Object.entries(filters).forEach(([key, value]) => {
        if (!processedKeys.has(key) && value !== undefined && value !== null && value !== '') {
            let fieldName = key;
            let fieldValue = value;
            let fieldType = 'general';
            
            // 尝试从知识库中查找中文名称
            if (INTELLIGENT_FILTER_CONFIG.useKnowledgeBase && fieldMapping.field_mapping) {
                for (const category of Object.values(fieldMapping.field_mapping)) {
                    for (const [chineseName, englishName] of Object.entries(category)) {
                        if (englishName === key) {
                            fieldName = chineseName;
                            break;
                        }
                    }
                }
            }
            
            // 格式化显示值
            if (typeof value === 'boolean') {
                fieldValue = value ? '是' : '否';
            } else if (Array.isArray(value)) {
                fieldValue = value.join('、');
            }
            
            // 确定字段类型
            if (key.includes('baseline') || key.includes('age') || key.includes('sex') || key.includes('bmi')) {
                fieldType = 'basic-info';
            } else if (key.includes('imaging') || key.includes('lvef') || key.includes('pg') || key.includes('eoa')) {
                fieldType = 'imaging';
            } else if (key.includes('procedure') || key.includes('surgery') || key.includes('thv') || key.includes('valve')) {
                fieldType = 'surgery';
            } else if (key.includes('discharge') || key.includes('before')) {
                fieldType = 'discharge';
            } else if (key.includes('followup') || key.includes('30d') || key.includes('1y') || key.includes('last')) {
                fieldType = 'followup';
            }
            
            filterSummary.push({ 
                type: fieldType, 
                text: `${fieldName}: ${fieldValue}`, 
                icon: 'bi-gear-fill'  // 通用图标
            });
        }
    });
    
    // 12. 更新视觉反馈
    updateFilterVisualFeedback();
    
    // 13. 显示解析结果摘要
    displayFilterSummary(filterSummary);
    
    console.log('filters对象已成功映射到UI控件，包含通用字段处理');
}

// 显示筛选条件摘要
function displayFilterSummary(filterSummary) {
    const resultDiv = document.getElementById('ai-filter-result');
    const summaryDiv = document.getElementById('ai-filter-summary');
    
    if (!resultDiv || !summaryDiv) return;
    
    if (filterSummary.length === 0) {
        resultDiv.style.display = 'none';
        return;
    }
    
    // 生成筛选条件标签
    const tagsHtml = filterSummary.map(item => 
        `<span class="filter-tag ${item.type}">
            <i class="${item.icon}"></i>
            ${item.text}
        </span>`
    ).join('');
    
    summaryDiv.innerHTML = tagsHtml;
    resultDiv.style.display = 'block';
}
// ==================== END: 新增的将filters对象映射到UI控件的函数 ====================

// ================== 智能聊天功能 ==================

// 全局变量存储当前聊天中的筛选条件
let currentChatFilters = {};

// 处理聊天消息
async function handleChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const userMessage = chatInput.value.trim();
    
    if (!userMessage) {
        return;
    }
    
    // 清空输入框
    chatInput.value = '';
    
    // 显示用户消息
    addChatMessage(userMessage, 'user');
    
    // 显示思考状态
    showChatTyping(true);
    
    try {
        // 二分类判断用户意图
        const intent = await classifyUserIntent(userMessage);
        
        if (intent.type === 'case_query') {
            // 处理病例查询
            await handleCaseQuery(userMessage, intent);
        } else {
            // 处理问答查询
            await handleQAQuery(userMessage, intent);
        }
        
    } catch (error) {
        console.error('处理聊天消息失败:', error);
        addChatMessage('抱歉，我遇到了一些问题，请稍后再试。', 'bot');
    } finally {
        showChatTyping(false);
    }
}

// 二分类判断用户意图
async function classifyUserIntent(userMessage) {
    try {
        // 暂时使用本地分类（后续可扩展为API调用）
        return simpleIntentClassification(userMessage);
        
    } catch (error) {
        console.warn('意图分类失败，使用本地分类:', error);
        return simpleIntentClassification(userMessage);
    }
}

// 改进的意图分类算法
function simpleIntentClassification(userMessage) {
    const message = userMessage.toLowerCase();
    console.log('🔧 意图分类 - 原始消息:', userMessage);
    
    // === 第一步：强制问答识别（高优先级） ===
    const strongQAPatterns = [
        // 疑问句开头
        /^(请问|问一下|想问|咨询|请教)/,
        // 疑问词组合
        /(什么是|如何|为什么|怎么|怎样|怎么样)/,
        // 概念性询问
        /(有哪些|包括哪些|分为哪些|什么原因|什么风险|什么好处|什么优点|什么缺点)/,
        // 解释性询问
        /(解释|介绍|说明|原理|机制|定义|概念)/,
        // 风险相关询问
        /(面临.*风险|有.*风险|存在.*风险|风险.*哪些|并发症.*哪些)/,
        // 医学知识询问
        /(适应症|禁忌症|注意事项|治疗方法|手术方式|疗效|效果|预后|成功率)/
    ];
    
    for (const pattern of strongQAPatterns) {
        if (pattern.test(message)) {
            console.log('🎯 强制问答匹配:', pattern.source);
            return {
                type: 'qa_query',
                confidence: 0.9,
                reasoning: `强制问答模式：匹配模式 "${pattern.source}"`
            };
        }
    }
    
    // === 第二步：强制病例查询识别（高优先级） ===
    const strongCasePatterns = [
        // 明确的查询指令
        /^(查询|筛选|查找|找|搜索|检索|获取|显示|列出)/,
        // 数量统计
        /(有多少|总共|共有|统计|数量|个数|多少个|多少例|多少名|多少位)/,
        // 具体条件查询
        /(大于|小于|等于|范围|之间|以上|以下|超过|不超过|≥|≤|>|<)/,
        // 明确指向数据
        /(病例|患者.*数据|数据.*显示|筛选.*条件)/
    ];
    
    for (const pattern of strongCasePatterns) {
        if (pattern.test(message)) {
            console.log('🎯 强制病例查询匹配:', pattern.source);
            return {
                type: 'case_query',
                confidence: 0.9,
                reasoning: `强制病例查询模式：匹配模式 "${pattern.source}"`
            };
        }
    }
    
    // === 第三步：基于关键词的加权评分 ===
    let caseScore = 0;
    let qaScore = 0;
    
    // 病例查询关键词（权重1）
    const caseKeywords = [
        '病例', '例子', '数据', '统计', '显示', '列出',
        '男性', '女性', '年龄', '性别', 'bmi', 'nyha', 'lvef'
    ];
    
    // 问答查询关键词（权重2，更高权重）
    const qaKeywords = [
        'tavi', 'tavr', '经导管', '主动脉瓣', '置换', '植入',
        '原理', '机制', '方法', '治疗', '预后', '疗效'
    ];
    
    // 概念性问答关键词（权重3，最高权重）
    const conceptualQAKeywords = [
        '风险', '好处', '优点', '缺点', '原因', '影响', '作用',
        '意义', '价值', '重要性', '必要性', '可能性'
    ];
    
    // 计算加权分数
    caseKeywords.forEach(keyword => {
        if (message.includes(keyword)) {
            caseScore += 1;
        }
    });
    
    qaKeywords.forEach(keyword => {
        if (message.includes(keyword)) {
            qaScore += 2;
        }
    });
    
    conceptualQAKeywords.forEach(keyword => {
        if (message.includes(keyword)) {
            qaScore += 3;
        }
    });
    
    // === 第四步：句式结构分析 ===
    // 疑问句标志
    if (message.includes('？') || message.includes('?') || 
        message.includes('吗') || message.includes('呢') ||
        message.includes('呀') || message.includes('啊')) {
        qaScore += 2;
    }
    
    // 数量词（倾向于查询）
    if (message.includes('个') || message.includes('名') || 
        message.includes('例') || message.includes('位') ||
        message.includes('条') || message.includes('项')) {
        // 但如果同时包含"哪些"，仍然是问答
        if (!message.includes('哪些')) {
            caseScore += 1;
        }
    }
    
    // === 第五步：最终判断 ===
    console.log('🔧 意图评分 - 病例查询:', caseScore, '问答:', qaScore);
    
    if (qaScore > caseScore) {
        return {
            type: 'qa_query',
            confidence: qaScore / (qaScore + caseScore),
            reasoning: `问答评分(${qaScore}) > 病例查询评分(${caseScore})`
        };
    } else if (caseScore > qaScore) {
        return {
            type: 'case_query',
            confidence: caseScore / (qaScore + caseScore),
            reasoning: `病例查询评分(${caseScore}) > 问答评分(${qaScore})`
        };
    } else {
        // 平分或都为0时，默认为问答
        return {
            type: 'qa_query',
            confidence: 0.5,
            reasoning: '评分相等，默认为问答查询'
        };
    }
}

// 处理病例查询
async function handleCaseQuery(userMessage, intent) {
    addChatMessage(`我理解您想要查询病例数据。让我来解析您的需求...`, 'bot');
    
    try {
        // 使用现有的智能筛选API解析用户查询
        const response = await fetch(`${API_BASE_URL}/text-to-sql-to-filter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                query: userMessage,
                // 如果启用知识库，添加知识库信息
                ...(INTELLIGENT_FILTER_CONFIG.useKnowledgeBase && fieldMapping.field_mapping ? {
                    knowledge_base: {
                        field_mapping: fieldMapping.field_mapping,
                        data_type_info: fieldMapping.data_type_info,
                        units: fieldMapping.units
                    }
                } : {})
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'AI服务解析失败');
        }

        const filtersFromAI = await response.json();
        console.log('从AI获取的筛选条件:', filtersFromAI);
        
        // 保存筛选条件
        currentChatFilters = filtersFromAI;
        
        // 显示筛选条件标签
        displayChatFilterTags(filtersFromAI);
        
        // 添加提示消息
        const filterCount = Object.keys(filtersFromAI).length;
        if (filterCount > 0) {
            addChatMessage(
                `我已经解析出${filterCount}个筛选条件，请查看下方的筛选标签。点击"应用筛选"按钮来执行查询。`,
                'bot'
            );
        } else {
            addChatMessage(
                '我没有从您的消息中识别出具体的筛选条件，请尝试更具体的描述，比如"查找年龄大于70岁的男性患者"。',
                'bot'
            );
        }
        
    } catch (error) {
        console.error('病例查询处理失败:', error);
        addChatMessage(`解析查询条件时出现问题：${error.message}`, 'bot');
    }
}

// 处理问答查询
async function handleQAQuery(userMessage, intent) {
    try {
        // 暂时使用备用回答（后续可集成真实的知识库API）
        addChatMessage(getFallbackAnswer(userMessage), 'bot');
        
    } catch (error) {
        console.warn('知识库问答调用失败，使用备用回答:', error);
        addChatMessage(getFallbackAnswer(userMessage), 'bot');
    }
}

// 备用回答
function getFallbackAnswer(userMessage) {
    const message = userMessage.toLowerCase();
    
    // 高龄患者风险相关问题
    if (message.includes('高龄') && (message.includes('风险') || message.includes('面临'))) {
        return `高龄患者进行TAVI手术面临的主要风险包括：

**心血管风险：**
• 术后心律失常（尤其是传导阻滞）
• 血流动力学不稳定
• 心脏功能储备不足

**血管相关风险：**
• 血管脆性增加，易发生血管并发症
• 大血管损伤风险较高
• 血管通路困难

**全身性风险：**
• 认知功能下降
• 肾功能不全加重
• 感染抵抗力下降
• 术后恢复时间延长

**其他风险：**
• 起搏器植入需求增加
• 卒中风险相对较高
• 多器官功能衰竭

尽管如此，TAVI仍是高龄高危患者的重要治疗选择，风险效益比通常是有利的。`;
    }
    
    // 一般风险相关问题
    if (message.includes('风险') && !message.includes('高龄')) {
        return `TAVI手术的一般风险包括：

**手术相关风险：**
• 瓣膜移位（1-3%）
• 瓣环撕裂（<1%）
• 冠脉阻塞（1-2%）

**血管相关风险：**
• 大血管并发症（2-5%）
• 出血（5-10%）
• 血管闭塞

**心脏相关风险：**
• 瓣周漏（10-20%，多数轻微）
• 传导阻滞需起搏器（5-15%）
• 急性心肌梗死（<1%）

**神经系统风险：**
• 卒中（1-3%）
• 认知功能变化

**其他风险：**
• 急性肾损伤（5-15%）
• 感染（<1%）

总体而言，TAVI的30天死亡率约1-3%，显著低于传统开胸手术。`;
    }
    
    if (message.includes('tavi') || message.includes('tavr')) {
        return `TAVI（经导管主动脉瓣植入术）是一种微创心脏手术，用于治疗主动脉瓣狭窄。这项技术允许医生通过导管将人工瓣膜植入患者体内，而无需开胸手术。

**主要优点：**
• 微创性，恢复期较短
• 适用于高风险手术患者
• 住院时间短
• 局麻下即可完成

**适应症：**
• 重度主动脉瓣狭窄
• 传统手术高风险或禁忌
• 预期寿命>1年

如果您想了解更多具体信息，建议咨询专业医生。`;
    }
    
    if (message.includes('主动脉瓣')) {
        return `主动脉瓣是心脏的重要组成部分，位于左心室和主动脉之间。

**正常功能：**
• 控制血液从左心室流向主动脉
• 防止血液反流回左心室
• 维持正常血液循环

**常见疾病：**
• 主动脉瓣狭窄（AS）
• 主动脉瓣关闭不全（AR）
• 先天性双瓣畸形

**治疗方法：**
• TAVI（经导管瓣膜植入）
• SAVR（外科瓣膜置换）
• 瓣膜成形术

TAVI手术就是治疗主动脉瓣疾病的一种现代微创方法。`;
    }
    
    if (message.includes('瓣周漏')) {
        return `瓣周漏（Paravalvular Leak, PVL）是TAVI手术后的常见现象。

**发生原因：**
• 人工瓣膜与原生瓣环密合不完全
• 钙化组织阻碍完全贴合
• 瓣膜尺寸选择

**严重程度分级：**
• 微量：通常无临床意义
• 轻度：一般不需要干预
• 中度：需要密切随访
• 重度：可能需要介入处理

**临床影响：**
• 大多数瓣周漏是轻微的
• 轻度PVL对预后影响有限
• 重度PVL可能影响心功能

**处理方法：**
• 轻微：观察随访
• 明显：球囊后扩张
• 严重：二次瓣膜植入`;
    }
    
    if (message.includes('并发症')) {
        return `TAVI手术的主要并发症包括：

**术中并发症：**
• 瓣膜移位或错位（1-3%）
• 瓣环撕裂（<1%）
• 血管损伤（2-5%）
• 冠脉阻塞（1-2%）

**术后早期并发症：**
• 瓣周漏（10-20%，多数轻微）
• 起搏器植入需求（5-15%）
• 卒中（1-3%）
• 大出血（5-10%）
• 急性肾损伤（5-15%）

**长期并发症：**
• 瓣膜功能恶化
• 感染性心内膜炎
• 血栓栓塞事件

**发生率趋势：**
随着技术改进和经验积累，TAVI并发症发生率持续降低，整体安全性不断提高。`;
    }
    
    return `抱歉，我暂时无法回答这个问题。但是我可以帮您：

1. 🔍 <strong>查询和筛选病例数据</strong>：例如"查找年龄大于70岁的男性患者"
2. 📊 <strong>分析统计信息</strong>：例如"显示所有病例的并发症情况"
3. 💡 <strong>提供TAVI相关的基础知识</strong>：例如"什么是TAVI手术？"

请尝试重新描述您的问题，或者问我一些关于TAVI病例数据的查询需求。`;
}

// 显示聊天中的筛选条件标签
function displayChatFilterTags(filters) {
    const filterTagsContainer = document.getElementById('filter-tags');
    const filterResultsContainer = document.getElementById('filter-results');
    
    if (!filterTagsContainer || !filterResultsContainer) return;
    
    // 清空现有标签
    filterTagsContainer.innerHTML = '';
    
    // 字段名称映射（简化版）
    const fieldNameMap = {
        age_min: '最小年龄',
        age_max: '最大年龄',
        gender: '性别',
        bmi_min: '最小BMI',
        bmi_max: '最大BMI',
        diabetes_mellitus: '糖尿病',
        hypertension: '高血压',
        hyperlipidemia: '高脂血症',
        coronary_artery_disease: '冠心病',
        atrial_fibrillation: '房颤',
        nyha_classification: 'NYHA分级',
        lvef_min: '最小LVEF',
        lvef_max: '最大LVEF',
        aortic_valve_peak_pg_min: '最小最大跨瓣压差',
        aortic_valve_peak_pg_max: '最大最大跨瓣压差',
        aortic_valve_mean_pg_min: '最小平均跨瓣压差',
        aortic_valve_mean_pg_max: '最大平均跨瓣压差',
        thv_size_min: '最小瓣膜尺寸',
        thv_size_max: '最大瓣膜尺寸',
        thv_type: '瓣膜类型',
        thv_brand: '瓣膜品牌',
        immediate_pvl_occurred: '术后即刻瓣周漏',
        mortality_30d: '30天死亡',
        mortality_1y: '1年死亡',
        stroke_before_discharge: '出院前卒中',
        major_bleeding: '大出血',
        pacemaker_implantation: '起搏器植入'
    };
    
    // 生成标签
    Object.entries(filters).forEach(([key, value]) => {
        const tagElement = document.createElement('span');
        tagElement.className = 'filter-tag-chat';
        
        const fieldName = fieldNameMap[key] || key;
        let displayValue = value;
        
        // 格式化显示值
        if (typeof value === 'boolean') {
            displayValue = value ? '是' : '否';
        } else if (Array.isArray(value)) {
            displayValue = value.join(', ');
        } else if (key.includes('_min')) {
            displayValue = `≥ ${value}`;
        } else if (key.includes('_max')) {
            displayValue = `≤ ${value}`;
        }
        
        tagElement.textContent = `${fieldName}: ${displayValue}`;
        filterTagsContainer.appendChild(tagElement);
    });
    
    // 显示筛选结果区域
    if (Object.keys(filters).length > 0) {
        filterResultsContainer.style.display = 'block';
    } else {
        filterResultsContainer.style.display = 'none';
    }
}

// 应用聊天中的筛选条件
async function applyChatFilters() {
    if (Object.keys(currentChatFilters).length === 0) {
        addChatMessage('没有可应用的筛选条件。', 'bot');
        return;
    }
    
    try {
        // 显示加载状态
        addChatMessage('正在应用筛选条件，请稍候...', 'bot');
        
        // 设置全局筛选条件
        currentFilters = currentChatFilters;
        currentPage = 1;
        
        // 并行加载数据
        await Promise.all([
            loadStatistics(currentFilters),
            loadChartData(currentFilters),
            loadTableData(currentFilters, currentPage, casesPerPage)
        ]);
        
        // 应用筛选条件到UI控件
        applyFiltersToUI(currentFilters);
        
        // 显示成功消息
        addChatMessage('筛选条件已成功应用！您可以在主界面查看筛选结果。', 'bot');
        
        // 隐藏筛选结果区域
        document.getElementById('filter-results').style.display = 'none';
        
        // 清空当前聊天筛选条件
        currentChatFilters = {};
        
    } catch (error) {
        console.error('应用筛选条件失败:', error);
        addChatMessage('应用筛选条件时出现错误，请重试。', 'bot');
    }
}

// 添加聊天消息
function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = sender === 'bot' ? '<i class="bi bi-robot"></i>' : '<i class="bi bi-person"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // 支持HTML内容（用于列表等格式）
    if (message.includes('<') || message.includes('•')) {
        // 将bullet points转换为HTML列表
        const formattedMessage = message
            .replace(/•\s+/g, '<br>• ')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        contentDiv.innerHTML = formattedMessage;
    } else {
        contentDiv.textContent = message;
    }
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    
    // 滚动到最新消息
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 显示/隐藏打字状态
function showChatTyping(show) {
    const typingElement = document.getElementById('chat-typing');
    if (typingElement) {
        typingElement.style.display = show ? 'block' : 'none';
    }
}
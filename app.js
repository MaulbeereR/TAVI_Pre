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
    
    // 配色方案切换按钮
    const changeColorBtn = document.getElementById('change-color-scheme');
    if (changeColorBtn) {
        changeColorBtn.addEventListener('click', function() {
            nextColorScheme(); // 切换到下一个配色方案
            // 重新加载图表数据以应用新配色
            loadChartData(currentFilters);
        });
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
    
    // 心梗史
    const miHistory = document.getElementById('myocardial-infarction')?.value;
    if (miHistory !== '') filters.mi_history = miHistory === 'true';
    
    // PCI史
    const pciHistory = document.getElementById('pci-history')?.value;
    if (pciHistory !== '') filters.pci_history = pciHistory === 'true';
    
    // CABG史
    const cabgHistory = document.getElementById('cabg-history')?.value;
    if (cabgHistory !== '') filters.cabg_history = cabgHistory === 'true';
    
    // STS评分
    const stsScoreMin = document.getElementById('sts-score-min')?.value;
    const stsScoreMax = document.getElementById('sts-score-max')?.value;
    if (stsScoreMin) filters.sts_score_min = parseFloat(stsScoreMin);
    if (stsScoreMax) filters.sts_score_max = parseFloat(stsScoreMax);
    
    // NT-proBNP
    const ntProbnpMin = document.getElementById('nt-probnp-min')?.value;
    const ntProbnpMax = document.getElementById('nt-probnp-max')?.value;
    if (ntProbnpMin) filters.nt_probnp_min = parseFloat(ntProbnpMin);
    if (ntProbnpMax) filters.nt_probnp_max = parseFloat(ntProbnpMax);
    
    // 更多基线资料字段
    // 体表面积
    const surfaceAreaMin = document.getElementById('surface-area-min')?.value;
    const surfaceAreaMax = document.getElementById('surface-area-max')?.value;
    if (surfaceAreaMin) filters.surface_area_min = parseFloat(surfaceAreaMin);
    if (surfaceAreaMax) filters.surface_area_max = parseFloat(surfaceAreaMax);
    
    // 糖尿病
    const diabetes = document.getElementById('diabetes')?.value;
    if (diabetes !== '') filters.diabetes_mellitus = diabetes === 'true';
    
    // 高血压
    const hypertension = document.getElementById('hypertension')?.value;
    if (hypertension !== '') filters.hypertension = hypertension === 'true';
    
    // 高脂血症
    const hyperlipidemia = document.getElementById('hyperlipidemia')?.value;
    if (hyperlipidemia !== '') filters.hyperlipidemia = hyperlipidemia === 'true';
    
    // 冠心病
    const coronaryArteryDisease = document.getElementById('coronary-artery-disease')?.value;
    if (coronaryArteryDisease !== '') filters.coronary_artery_disease = coronaryArteryDisease === 'true';
    
    // 慢阻肺
    const copd = document.getElementById('copd')?.value;
    if (copd !== '') filters.copd = copd === 'true';
    
    // 透析
    const dialysis = document.getElementById('dialysis')?.value;
    if (dialysis !== '') filters.dialysis = dialysis === 'true';
    
    // ACEI/ARB
    const aceiArb = document.getElementById('acei-arb')?.value;
    if (aceiArb !== '') filters.acei_arb = aceiArb === 'true';
    
    // Beta受体阻滞剂
    const betaBlocker = document.getElementById('beta-blocker')?.value;
    if (betaBlocker !== '') filters.beta_blocker = betaBlocker === 'true';
    
    // 钙离子阻滞剂
    const calciumBlocker = document.getElementById('calcium-blocker')?.value;
    if (calciumBlocker !== '') filters.calcium_blocker = calciumBlocker === 'true';
    
    // 利尿剂
    const diuretic = document.getElementById('diuretic')?.value;
    if (diuretic !== '') filters.diuretic = diuretic === 'true';
    
    // 阿司匹林
    const aspirin = document.getElementById('aspirin')?.value;
    if (aspirin !== '') filters.aspirin = aspirin === 'true';
    
    // 抗凝药
    const anticoagulant = document.getElementById('anticoagulant')?.value;
    if (anticoagulant !== '') filters.anticoagulant = anticoagulant === 'true';
    
    // 他汀类药物
    const statins = document.getElementById('statins')?.value;
    if (statins !== '') filters.statins = statins === 'true';
    
    // SGLT2抑制剂
    const sglt2Inhibitors = document.getElementById('sglt2-inhibitors')?.value;
    if (sglt2Inhibitors !== '') filters.sglt2_inhibitors = sglt2Inhibitors === 'true';
    
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
    
    // 有效瓣口面积
    const eoaMin = document.getElementById('eoa-min')?.value;
    const eoaMax = document.getElementById('eoa-max')?.value;
    if (eoaMin) filters.aortic_valve_eoa_min = parseFloat(eoaMin);
    if (eoaMax) filters.aortic_valve_eoa_max = parseFloat(eoaMax);
    
    // 瓣环面积
    const annularAreaMin = document.getElementById('annular-area-min')?.value;
    const annularAreaMax = document.getElementById('annular-area-max')?.value;
    if (annularAreaMin) filters.annular_area_min = parseFloat(annularAreaMin);
    if (annularAreaMax) filters.annular_area_max = parseFloat(annularAreaMax);
    
    // 瓣环平均直径
    const annularMeanDiameterMin = document.getElementById('annular-mean-diameter-min')?.value;
    const annularMeanDiameterMax = document.getElementById('annular-mean-diameter-max')?.value;
    if (annularMeanDiameterMin) filters.annular_mean_diameter_min = parseFloat(annularMeanDiameterMin);
    if (annularMeanDiameterMax) filters.annular_mean_diameter_max = parseFloat(annularMeanDiameterMax);
    
    // 瓣环最大直径
    const annularMaxDiameterMin = document.getElementById('annular-max-diameter-min')?.value;
    const annularMaxDiameterMax = document.getElementById('annular-max-diameter-max')?.value;
    if (annularMaxDiameterMin) filters.annular_max_diameter_min = parseFloat(annularMaxDiameterMin);
    if (annularMaxDiameterMax) filters.annular_max_diameter_max = parseFloat(annularMaxDiameterMax);
    
    // 瓣环周径
    const annularPerimeterMin = document.getElementById('annular-perimeter-min')?.value;
    const annularPerimeterMax = document.getElementById('annular-perimeter-max')?.value;
    if (annularPerimeterMin) filters.annular_perimeter_min = parseFloat(annularPerimeterMin);
    if (annularPerimeterMax) filters.annular_perimeter_max = parseFloat(annularPerimeterMax);
    
    // 瓣口流速
    const valveVelocityMin = document.getElementById('valve-velocity-min')?.value;
    const valveVelocityMax = document.getElementById('valve-velocity-max')?.value;
    if (valveVelocityMin) filters.aortic_valve_flow_velocity_min = parseFloat(valveVelocityMin);
    if (valveVelocityMax) filters.aortic_valve_flow_velocity_max = parseFloat(valveVelocityMax);
    
    // 窦管交界高度
    const stjHeightMin = document.getElementById('stj-height-min')?.value;
    const stjHeightMax = document.getElementById('stj-height-max')?.value;
    if (stjHeightMin) filters.stj_height_min = parseFloat(stjHeightMin);
    if (stjHeightMax) filters.stj_height_max = parseFloat(stjHeightMax);
    
    // 窦管交界直径
    const stjDiameterMin = document.getElementById('stj-diameter-min')?.value;
    const stjDiameterMax = document.getElementById('stj-diameter-max')?.value;
    if (stjDiameterMin) filters.stj_diameter_min = parseFloat(stjDiameterMin);
    if (stjDiameterMax) filters.stj_diameter_max = parseFloat(stjDiameterMax);
    
    // 窦部直径
    const sinusDiameterMin = document.getElementById('sinus-diameter-min')?.value;
    const sinusDiameterMax = document.getElementById('sinus-diameter-max')?.value;
    if (sinusDiameterMin) filters.sinus_diameter_min = parseFloat(sinusDiameterMin);
    if (sinusDiameterMax) filters.sinus_diameter_max = parseFloat(sinusDiameterMax);
    
    // 升主动脉直径
    const ascendingAortaDiameterMin = document.getElementById('ascending-aorta-diameter-min')?.value;
    const ascendingAortaDiameterMax = document.getElementById('ascending-aorta-diameter-max')?.value;
    if (ascendingAortaDiameterMin) filters.ascending_aorta_diameter_min = parseFloat(ascendingAortaDiameterMin);
    if (ascendingAortaDiameterMax) filters.ascending_aorta_diameter_max = parseFloat(ascendingAortaDiameterMax);
    
    // 瓣环钙化
    const annularCalcification = document.getElementById('annular-calcification')?.value;
    if (annularCalcification !== '') filters.annular_calcification = annularCalcification === 'true';
    
    // LVOT直径
    const lvotDiameterMin = document.getElementById('lvot-diameter-min')?.value;
    const lvotDiameterMax = document.getElementById('lvot-diameter-max')?.value;
    if (lvotDiameterMin) filters.lvot_diameter_min = parseFloat(lvotDiameterMin);
    if (lvotDiameterMax) filters.lvot_diameter_max = parseFloat(lvotDiameterMax);
    
    // LVOT钙化体积
    const lvotCalcificationMin = document.getElementById('lvot-calcification-min')?.value;
    const lvotCalcificationMax = document.getElementById('lvot-calcification-max')?.value;
    if (lvotCalcificationMin) filters.lvot_calcification_min = parseFloat(lvotCalcificationMin);
    if (lvotCalcificationMax) filters.lvot_calcification_max = parseFloat(lvotCalcificationMax);
    
    // 左冠脉高度
    const lcaHeightMin = document.getElementById('lca-height-min')?.value;
    const lcaHeightMax = document.getElementById('lca-height-max')?.value;
    if (lcaHeightMin) filters.left_coronary_height_min = parseFloat(lcaHeightMin);
    if (lcaHeightMax) filters.left_coronary_height_max = parseFloat(lcaHeightMax);
    
    // 右冠脉高度
    const rcaHeightMin = document.getElementById('rca-height-min')?.value;
    const rcaHeightMax = document.getElementById('rca-height-max')?.value;
    if (rcaHeightMin) filters.right_coronary_height_min = parseFloat(rcaHeightMin);
    if (rcaHeightMax) filters.right_coronary_height_max = parseFloat(rcaHeightMax);
    
    // 更多术前影像学评估字段
    // 有效瓣口面积指数
    const eoaiMin = document.getElementById('eoai-min')?.value;
    const eoaiMax = document.getElementById('eoai-max')?.value;
    if (eoaiMin) filters.aortic_valve_eoai_min = parseFloat(eoaiMin);
    if (eoaiMax) filters.aortic_valve_eoai_max = parseFloat(eoaiMax);
    
    // 中度以上主动脉瓣反流
    const moderateSevereAr = document.getElementById('moderate-severe-ar')?.value;
    if (moderateSevereAr !== '') filters.moderate_severe_ar = moderateSevereAr === 'true';
    
    // 中度以上二尖瓣反流
    const moderateSevereMr = document.getElementById('moderate-severe-mr')?.value;
    if (moderateSevereMr !== '') filters.moderate_severe_mr = moderateSevereMr === 'true';
    
    // 左心室舒张末期容积
    const lvedvMin = document.getElementById('lvedv-min')?.value;
    const lvedvMax = document.getElementById('lvedv-max')?.value;
    if (lvedvMin) filters.lvedv_min = parseFloat(lvedvMin);
    if (lvedvMax) filters.lvedv_max = parseFloat(lvedvMax);
    
    // 左心室收缩末期容积
    const lvesvMin = document.getElementById('lvesv-min')?.value;
    const lvesvMax = document.getElementById('lvesv-max')?.value;
    if (lvesvMin) filters.lvesv_min = parseFloat(lvesvMin);
    if (lvesvMax) filters.lvesv_max = parseFloat(lvesvMax);
    
    // 瓣环最小直径
    const annularMinDiameterMin = document.getElementById('annular-min-diameter-min')?.value;
    const annularMinDiameterMax = document.getElementById('annular-min-diameter-max')?.value;
    if (annularMinDiameterMin) filters.annular_min_diameter_min = parseFloat(annularMinDiameterMin);
    if (annularMinDiameterMax) filters.annular_min_diameter_max = parseFloat(annularMinDiameterMax);
    
    // 瓣环偏心率
    const annularEccentricityMin = document.getElementById('annular-eccentricity-min')?.value;
    const annularEccentricityMax = document.getElementById('annular-eccentricity-max')?.value;
    if (annularEccentricityMin) filters.annular_eccentricity_min = parseFloat(annularEccentricityMin);
    if (annularEccentricityMax) filters.annular_eccentricity_max = parseFloat(annularEccentricityMax);
    
    // 源自面积的瓣环直径
    const areaDerivedDiameterMin = document.getElementById('area-derived-diameter-min')?.value;
    const areaDerivedDiameterMax = document.getElementById('area-derived-diameter-max')?.value;
    if (areaDerivedDiameterMin) filters.area_derived_diameter_min = parseFloat(areaDerivedDiameterMin);
    if (areaDerivedDiameterMax) filters.area_derived_diameter_max = parseFloat(areaDerivedDiameterMax);
    
    // 源自周长的瓣环直径
    const perimeterDerivedDiameterMin = document.getElementById('perimeter-derived-diameter-min')?.value;
    const perimeterDerivedDiameterMax = document.getElementById('perimeter-derived-diameter-max')?.value;
    if (perimeterDerivedDiameterMin) filters.perimeter_derived_diameter_min = parseFloat(perimeterDerivedDiameterMin);
    if (perimeterDerivedDiameterMax) filters.perimeter_derived_diameter_max = parseFloat(perimeterDerivedDiameterMax);
    
    // 瓣环上钙化
    const supraannularCalcificationMin = document.getElementById('supraannular-calcification-min')?.value;
    const supraannularCalcificationMax = document.getElementById('supraannular-calcification-max')?.value;
    if (supraannularCalcificationMin) filters.supraannular_calcification_min = parseFloat(supraannularCalcificationMin);
    if (supraannularCalcificationMax) filters.supraannular_calcification_max = parseFloat(supraannularCalcificationMax);
    
    // 瓣环至二尖瓣前叶距离
    const annulusMitralDistanceMin = document.getElementById('annulus-mitral-distance-min')?.value;
    const annulusMitralDistanceMax = document.getElementById('annulus-mitral-distance-max')?.value;
    if (annulusMitralDistanceMin) filters.annulus_to_mitral_distance_min = parseFloat(annulusMitralDistanceMin);
    if (annulusMitralDistanceMax) filters.annulus_to_mitral_distance_max = parseFloat(annulusMitralDistanceMax);
    
    // 手术信息
    const transfemoralAccess = document.getElementById('transfemoral-access')?.value;
    if (transfemoralAccess !== '') filters.transfemoral_access = transfemoralAccess === 'true';
    
    const transapicalAccess = document.getElementById('transapical-access')?.value;
    if (transapicalAccess !== '') filters.transapical_access = transapicalAccess === 'true';
    
    const otherAccess = document.getElementById('other-access')?.value;
    if (otherAccess !== '') filters.other_access = otherAccess === 'true';
    
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
    
    // 术后即刻跨瓣压差
    const postMeanPgMin = document.getElementById('post-mean-pg-min')?.value;
    const postMeanPgMax = document.getElementById('post-mean-pg-max')?.value;
    if (postMeanPgMin) filters.immediate_mean_pg_min = parseFloat(postMeanPgMin);
    if (postMeanPgMax) filters.immediate_mean_pg_max = parseFloat(postMeanPgMax);
    
    // 跨瓣压差≥20mmHg
    const meanPgGte20 = document.getElementById('mean-pg-gte-20')?.value;
    if (meanPgGte20 !== '') filters.mean_pg_gte_20 = meanPgGte20 === 'true';
    
    // 严重错位
    const prosthesisMalposition = document.getElementById('prosthesis-malposition')?.value;
    if (prosthesisMalposition !== '') filters.prosthesis_malposition = prosthesisMalposition === 'true';
    
    // 瓣环撕裂
    const annularRupture = document.getElementById('annular-rupture')?.value;
    if (annularRupture !== '') filters.annular_rupture = annularRupture === 'true';
    
    // 术后即刻瓣周漏
    const immediatePvl = document.getElementById('immediate-pvl')?.value;
    if (immediatePvl !== '') filters.immediate_pvl_occurred = immediatePvl === 'true';
    
    // 术后即刻瓣周漏程度
    const pvlSeverity = document.getElementById('pvl-severity')?.value;
    if (pvlSeverity) filters.immediate_pvl_severity = pvlSeverity;
    
    // 瓣架移位
    const valveDisplacement = document.getElementById('valve-displacement')?.value;
    if (valveDisplacement !== '') filters.thv_displacement = valveDisplacement === 'true';
    
    // 转外科开胸手术
    const conversionToSavr = document.getElementById('conversion-to-savr')?.value;
    if (conversionToSavr !== '') filters.conversion_to_savr = conversionToSavr === 'true';
    
    // 转心肺转流术
    const cpbRequired = document.getElementById('cpb-required')?.value;
    if (cpbRequired !== '') filters.cpb_required = cpbRequired === 'true';
    
    // 瓣中瓣
    const valveInValve = document.getElementById('valve-in-valve')?.value;
    if (valveInValve !== '') filters.valve_in_valve = valveInValve === 'true';
    
    // 围术期死亡
    const periproceduralDeath = document.getElementById('periprocedural-death')?.value;
    if (periproceduralDeath !== '') filters.periprocedural_death = periproceduralDeath === 'true';
    
    // 更多手术信息字段
    // 预扩张
    const preDilatation = document.getElementById('pre-dilatation')?.value;
    if (preDilatation !== '') filters.pre_dilation = preDilatation === 'true';
    
    // 后扩张
    const postDilatation = document.getElementById('post-dilatation')?.value;
    if (postDilatation !== '') filters.post_dilation = postDilatation === 'true';
    
    // 总术时
    const totalProcedureTimeMin = document.getElementById('total-procedure-time-min')?.value;
    const totalProcedureTimeMax = document.getElementById('total-procedure-time-max')?.value;
    if (totalProcedureTimeMin) filters.total_procedure_time_min = parseFloat(totalProcedureTimeMin);
    if (totalProcedureTimeMax) filters.total_procedure_time_max = parseFloat(totalProcedureTimeMax);
    
    // 造影时间
    const fluoroscopyTimeMin = document.getElementById('fluoroscopy-time-min')?.value;
    const fluoroscopyTimeMax = document.getElementById('fluoroscopy-time-max')?.value;
    if (fluoroscopyTimeMin) filters.fluoroscopy_time_min = parseFloat(fluoroscopyTimeMin);
    if (fluoroscopyTimeMax) filters.fluoroscopy_time_max = parseFloat(fluoroscopyTimeMax);
    
    // 造影量
    const contrastVolumeMin = document.getElementById('contrast-volume-min')?.value;
    const contrastVolumeMax = document.getElementById('contrast-volume-max')?.value;
    if (contrastVolumeMin) filters.contrast_volume_min = parseFloat(contrastVolumeMin);
    if (contrastVolumeMax) filters.contrast_volume_max = parseFloat(contrastVolumeMax);
    
    // 术后即刻左心室射血分数
    const immediateLvefMin = document.getElementById('immediate-lvef-min')?.value;
    const immediateLvefMax = document.getElementById('immediate-lvef-max')?.value;
    if (immediateLvefMin) filters.immediate_lvef_min = parseFloat(immediateLvefMin);
    if (immediateLvefMax) filters.immediate_lvef_max = parseFloat(immediateLvefMax);
    
    // 过大尺寸
    const excessiveOversizing = document.getElementById('excessive-oversizing')?.value;
    if (excessiveOversizing !== '') filters.excessive_oversizing = excessiveOversizing === 'true';
    
    // 尺寸过大≥15%
    const oversizingGte15 = document.getElementById('oversizing-gte-15')?.value;
    if (oversizingGte15 !== '') filters.oversizing_gte_15 = oversizingGte15 === 'true';
    
    // 二尖瓣返流变化
    const mitralRegurgitationChange = document.getElementById('mitral-regurgitation-change')?.value;
    if (mitralRegurgitationChange) filters.mitral_regurgitation_change_proc = mitralRegurgitationChange;
    
    // 出院前评价
    const deathBeforeDischarge = document.getElementById('death-before-discharge')?.value;
    if (deathBeforeDischarge !== '') filters.death_before_discharge = deathBeforeDischarge === 'true';
    
    const strokeBeforeDischarge = document.getElementById('stroke-before-discharge')?.value;
    if (strokeBeforeDischarge !== '') filters.stroke_before_discharge = strokeBeforeDischarge === 'true';
    
    const majorBleeding = document.getElementById('major-bleeding')?.value;
    if (majorBleeding !== '') filters.major_bleeding = majorBleeding === 'true';
    
    const acuteKidneyInjury = document.getElementById('acute-kidney-injury')?.value;
    if (acuteKidneyInjury !== '') filters.aki = acuteKidneyInjury === 'true';
    
    const majorVascularComplications = document.getElementById('major-vascular-complications')?.value;
    if (majorVascularComplications !== '') filters.major_vascular_complication = majorVascularComplications === 'true';
    
    const pacemakerImplantation = document.getElementById('pacemaker-implantation')?.value;
    if (pacemakerImplantation !== '') filters.pacemaker_implantation = pacemakerImplantation === 'true';
    
    // 更多出院前评价字段
    const acsBeforeDischarge = document.getElementById('acs-before-discharge')?.value;
    if (acsBeforeDischarge !== '') filters.acs_ihd = acsBeforeDischarge === 'true';
    
    const pvlSeverityDischarge = document.getElementById('pvl-severity-discharge')?.value;
    if (pvlSeverityDischarge) filters.pvl_severity = pvlSeverityDischarge;
    
    // 出院前最大主动脉瓣跨瓣压差
    const dischargeMaxPgMin = document.getElementById('discharge-max-pg-min')?.value;
    const dischargeMaxPgMax = document.getElementById('discharge-max-pg-max')?.value;
    if (dischargeMaxPgMin) filters.max_pg_min = parseFloat(dischargeMaxPgMin);
    if (dischargeMaxPgMax) filters.max_pg_max = parseFloat(dischargeMaxPgMax);
    
    // 出院前主动脉瓣口流速
    const dischargeFlowVelocityMin = document.getElementById('discharge-flow-velocity-min')?.value;
    const dischargeFlowVelocityMax = document.getElementById('discharge-flow-velocity-max')?.value;
    if (dischargeFlowVelocityMin) filters.flow_velocity_min = parseFloat(dischargeFlowVelocityMin);
    if (dischargeFlowVelocityMax) filters.flow_velocity_max = parseFloat(dischargeFlowVelocityMax);
    
    // 出院前平均主动脉瓣跨瓣压差
    const dischargeMeanPgMin = document.getElementById('discharge-mean-pg-min')?.value;
    const dischargeMeanPgMax = document.getElementById('discharge-mean-pg-max')?.value;
    if (dischargeMeanPgMin) filters.mean_pg_min = parseFloat(dischargeMeanPgMin);
    if (dischargeMeanPgMax) filters.mean_pg_max = parseFloat(dischargeMeanPgMax);
    
    // 出院前实测有效瓣口面积指数
    const dischargeEoaiMin = document.getElementById('discharge-eoai-min')?.value;
    const dischargeEoaiMax = document.getElementById('discharge-eoai-max')?.value;
    if (dischargeEoaiMin) filters.eoai_min = parseFloat(dischargeEoaiMin);
    if (dischargeEoaiMax) filters.eoai_max = parseFloat(dischargeEoaiMax);
    
    // 随访信息
    const mortality30d = document.getElementById('death-30-days')?.value;
    if (mortality30d !== '') filters.mortality_30d = mortality30d === 'true';
    
    const mi30d = document.getElementById('mi-30-days')?.value;
    if (mi30d !== '') filters.mi_30d = mi30d === 'true';
    
    const stroke30d = document.getElementById('stroke-30-days')?.value;
    if (stroke30d !== '') filters.stroke_30d = stroke30d === 'true';
    
    const hfReadmission30d = document.getElementById('hf-readmission-30-days')?.value;
    if (hfReadmission30d !== '') filters.hf_readmission_30d = hfReadmission30d === 'true';
    
    const mortality1y = document.getElementById('death-1-year')?.value;
    if (mortality1y !== '') filters.mortality_1y = mortality1y === 'true';
    
    const mi1y = document.getElementById('mi-1-year')?.value;
    if (mi1y !== '') filters.mi_1y = mi1y === 'true';
    
    // 更多随访信息字段
    // 随访时左心室射血分数
    const followupLvefMin = document.getElementById('followup-lvef-min')?.value;
    const followupLvefMax = document.getElementById('followup-lvef-max')?.value;
    if (followupLvefMin) filters.lvef_last_followup_min = parseFloat(followupLvefMin);
    if (followupLvefMax) filters.lvef_last_followup_max = parseFloat(followupLvefMax);
    
    // 随访时NYHA分级
    const followupNyha = document.getElementById('followup-nyha')?.value;
    if (followupNyha) filters.nyha_last_followup = followupNyha;
    
    // 随访时最大跨瓣压差
    const followupMaxPgMin = document.getElementById('followup-max-pg-min')?.value;
    const followupMaxPgMax = document.getElementById('followup-max-pg-max')?.value;
    if (followupMaxPgMin) filters.max_pg_last_followup_min = parseFloat(followupMaxPgMin);
    if (followupMaxPgMax) filters.max_pg_last_followup_max = parseFloat(followupMaxPgMax);
    
    // 随访时瓣口流速
    const followupFlowVelocityMin = document.getElementById('followup-flow-velocity-min')?.value;
    const followupFlowVelocityMax = document.getElementById('followup-flow-velocity-max')?.value;
    if (followupFlowVelocityMin) filters.flow_velocity_last_followup_min = parseFloat(followupFlowVelocityMin);
    if (followupFlowVelocityMax) filters.flow_velocity_last_followup_max = parseFloat(followupFlowVelocityMax);
    
    // 随访时平均跨瓣压差
    const followupMeanPgMin = document.getElementById('followup-mean-pg-min')?.value;
    const followupMeanPgMax = document.getElementById('followup-mean-pg-max')?.value;
    if (followupMeanPgMin) filters.mean_pg_last_followup_min = parseFloat(followupMeanPgMin);
    if (followupMeanPgMax) filters.mean_pg_last_followup_max = parseFloat(followupMeanPgMax);
    
    // 随访时有效瓣口面积
    const followupEoaMin = document.getElementById('followup-eoa-min')?.value;
    const followupEoaMax = document.getElementById('followup-eoa-max')?.value;
    if (followupEoaMin) filters.eoa_last_followup_min = parseFloat(followupEoaMin);
    if (followupEoaMax) filters.eoa_last_followup_max = parseFloat(followupEoaMax);
    
    // 随访时有效瓣口面积指数
    const followupEoaiMin = document.getElementById('followup-eoai-min')?.value;
    const followupEoaiMax = document.getElementById('followup-eoai-max')?.value;
    if (followupEoaiMin) filters.eoai_last_followup_min = parseFloat(followupEoaiMin);
    if (followupEoaiMax) filters.eoai_last_followup_max = parseFloat(followupEoaiMax);
    
    // 随访时是否瓣周漏
    const followupPvlDetected = document.getElementById('followup-pvl-detected')?.value;
    if (followupPvlDetected !== '') filters.pvl_detected_last_followup = followupPvlDetected === 'true';
    
    // 随访时瓣周漏程度
    const followupPvlSeverity = document.getElementById('followup-pvl-severity')?.value;
    if (followupPvlSeverity) filters.pvl_severity_last_followup = followupPvlSeverity;
    
    // 后续干预
    const subsequentIntervention = document.getElementById('subsequent-intervention')?.value;
    if (subsequentIntervention !== '') filters.subsequent_intervention = subsequentIntervention === '有';
    
    // 二次手术
    const reoperation = document.getElementById('reoperation')?.value;
    if (reoperation !== '') filters.reoperation = reoperation === 'true';
    
    // 术后中转开胸
    const conversionToOpenSurgery = document.getElementById('conversion-to-open-surgery')?.value;
    if (conversionToOpenSurgery !== '') filters.conversion_to_open = conversionToOpenSurgery === 'true';
    
    // 术后起搏器植入
    const pacemakerPostTavi = document.getElementById('pacemaker-post-tavi')?.value;
    if (pacemakerPostTavi !== '') filters.pacemaker_post = pacemakerPostTavi === 'true';
    
    // 术后心衰
    const heartFailurePost = document.getElementById('heart-failure-post')?.value;
    if (heartFailurePost !== '') filters.heart_failure_post = heartFailurePost === 'true';
    
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

// 更新统计数据 - 现在通过API获取
// 这个函数已被 updateStatisticsDisplay 替代，保留为兼容性

// 初始化图表
function initializeCharts() {
    // 创建空图表，等待数据加载后更新
    createAgeDistributionChart();
    createNyhaChart();
    createValveDiameterChart();
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
        
        const modal = new bootstrap.Modal(document.getElementById('case-detail-modal'));
        const content = document.getElementById('case-details-content');
        
        content.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>基本信息</h6>
                    <table class="table table-sm">
                        <tr><th>患者ID</th><td>${caseData.patient_id || 'N/A'}</td></tr>
                        <tr><th>年龄</th><td>${caseData.age || 'N/A'}岁</td></tr>
                        <tr><th>性别</th><td>${caseData.sex === 'Male' ? '男' : caseData.sex === 'Female' ? '女' : 'N/A'}</td></tr>
                        <tr><th>BMI</th><td>${caseData.bmi || 'N/A'}</td></tr>
                        <tr><th>NYHA分级</th><td>${caseData.nyha_classification || 'N/A'}</td></tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h6>手术信息</h6>
                    <table class="table table-sm">
                        <tr><th>瓣膜类型</th><td>${caseData.thv_type || 'N/A'}</td></tr>
                        <tr><th>瓣膜尺寸</th><td>${caseData.thv_size || 'N/A'}mm</td></tr>
                        <tr><th>瓣膜品牌</th><td>${caseData.thv_brand || 'N/A'}</td></tr>
                        <tr><th>术前平均压差</th><td>${caseData.aortic_valve_mean_pg || 'N/A'}mmHg</td></tr>
                    </table>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-md-12">
                    <h6>术后结果</h6>
                    <table class="table table-sm">
                        <tr><th>术后即刻瓣周漏</th><td>${caseData.immediate_pvl_occurred ? '是' : '否'}</td></tr>
                        <tr><th>瓣周漏程度</th><td>${caseData.immediate_pvl_severity || 'N/A'}</td></tr>
                        <tr><th>30天死亡</th><td>${caseData.mortality_30d ? '是' : '否'}</td></tr>
                        <tr><th>1年死亡</th><td>${caseData.mortality_1y ? '是' : '否'}</td></tr>
                    </table>
                </div>
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
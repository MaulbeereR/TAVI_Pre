// 全局变量
let allData = [];
let filteredData = [];
let charts = {};
let currentPage = 1;
let itemsPerPage = 20;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');
    
    // 直接初始化UI组件，不依赖数据
    initializeTabs();
    initializeDropdowns();
    
    // 等待一段时间让数据文件加载
    setTimeout(() => {
        // 检查数据是否加载
        if (typeof mergedFinalTaviCases !== 'undefined') {
            allData = mergedFinalTaviCases;
            console.log(`成功加载 ${allData.length} 条数据`);
            
            // 处理数据
            processData();
            
            // 初始化筛选器
            initializeFilters();
            
            // 初始化图表
            initializeCharts();
            
            // 更新统计信息
            updateStatistics();
            
            // 更新图表数据
            updateCharts();
            
            // 更新表格
            updateTable();
        } else {
            console.error('数据未加载！请检查以下几点：');
            console.error('1. 确认 Progress/520_final_cleaned.js 文件存在');
            console.error('2. 确认文件中包含 mergedFinalTaviCases 变量');
            console.error('3. 检查浏览器控制台是否有其他错误');
            
            // 显示错误信息给用户
            showErrorMessage('数据加载失败，请检查数据文件是否存在');
            
            // 即使没有数据，也要初始化基本的UI功能
            initializeWithoutData();
        }
    }, 1000); // 等待1秒让数据文件加载
    
    console.log('系统初始化完成');
});

// 初始化系统
function initializeSystem() {
    console.log('开始初始化系统...');
    
    // 处理数据
    processData();
    
    // 初始化UI组件
    initializeTabs();
    initializeDropdowns();
    initializeFilters();
    
    // 初始化图表
    initializeCharts();
    
    // 更新统计信息
    updateStatistics();
    
    // 更新表格
    updateTable();
    
    console.log('系统初始化完成');
}

// 处理数据，提取需要的字段
function processData() {
    console.log('开始处理数据...');
    
    filteredData = allData.map(item => {
        // 提取年龄 - 从Baseline_Characteristics.Age
        let age = null;
        if (item.Baseline_Characteristics && item.Baseline_Characteristics.Age) {
            const ageValue = item.Baseline_Characteristics.Age;
            age = typeof ageValue === 'string' ? parseInt(ageValue) : ageValue;
            if (isNaN(age)) age = null;
        }
        
        // 提取性别 - 从Baseline_Characteristics.Sex
        let gender = null;
        if (item.Baseline_Characteristics && item.Baseline_Characteristics.Sex) {
            const sexValue = item.Baseline_Characteristics.Sex.toString().toLowerCase();
            if (sexValue === 'male' || sexValue === 'm' || sexValue === '男') {
                gender = 'male';
            } else if (sexValue === 'female' || sexValue === 'f' || sexValue === '女') {
                gender = 'female';
            }
        }
        
        // 提取瓣膜类型 - 从TAVI_R_Procedural_Details.THV_Type
        let valveType = null;
        if (item.TAVI_R_Procedural_Details && item.TAVI_R_Procedural_Details.THV_Type) {
            valveType = item.TAVI_R_Procedural_Details.THV_Type.toString();
        }
        
        // 提取瓣膜品牌 - 从TAVI_R_Procedural_Details.THV_Brand
        let valveBrand = null;
        if (item.TAVI_R_Procedural_Details && item.TAVI_R_Procedural_Details.THV_Brand) {
            valveBrand = item.TAVI_R_Procedural_Details.THV_Brand.toString();
        }
        
        // 提取NYHA分级 - 从Baseline_Characteristics.New_York_Heart_Association_NYHA_Classification
        let nyha = null;
        if (item.Baseline_Characteristics && item.Baseline_Characteristics.New_York_Heart_Association_NYHA_Classification) {
            nyha = item.Baseline_Characteristics.New_York_Heart_Association_NYHA_Classification.toString();
        }
        
        // 提取射血分数 - 从TAVI_R_Preprocedural_Imaging_Assessment.LVEF
        let ef = null;
        if (item.TAVI_R_Preprocedural_Imaging_Assessment && item.TAVI_R_Preprocedural_Imaging_Assessment.LVEF) {
            const efValue = item.TAVI_R_Preprocedural_Imaging_Assessment.LVEF;
            ef = typeof efValue === 'string' ? parseFloat(efValue) : efValue;
            if (isNaN(ef)) ef = null;
        }
        
        // 提取最大主动脉瓣跨瓣压差 - 从TAVI_R_Preprocedural_Imaging_Assessment.Peak_Aortic_Valve_Gradient
        let maxGradient = null;
        if (item.TAVI_R_Preprocedural_Imaging_Assessment && item.TAVI_R_Preprocedural_Imaging_Assessment.Peak_Aortic_Valve_Gradient) {
            const gradientValue = item.TAVI_R_Preprocedural_Imaging_Assessment.Peak_Aortic_Valve_Gradient;
            maxGradient = typeof gradientValue === 'string' ? parseFloat(gradientValue) : gradientValue;
            if (isNaN(maxGradient)) maxGradient = null;
        }
        
        // 提取平均主动脉瓣跨瓣压差 - 从TAVI_R_Preprocedural_Imaging_Assessment.Mean_Aortic_Valve_Gradient
        let meanGradient = null;
        if (item.TAVI_R_Preprocedural_Imaging_Assessment && item.TAVI_R_Preprocedural_Imaging_Assessment.Mean_Aortic_Valve_Gradient) {
            const gradientValue = item.TAVI_R_Preprocedural_Imaging_Assessment.Mean_Aortic_Valve_Gradient;
            meanGradient = typeof gradientValue === 'string' ? parseFloat(gradientValue) : gradientValue;
            if (isNaN(meanGradient)) meanGradient = null;
        }
        
        // 提取有效瓣口面积 - 从TAVI_R_Preprocedural_Imaging_Assessment.Effective_Orifice_Area_Aortic_Valve
        let effectiveArea = null;
        if (item.TAVI_R_Preprocedural_Imaging_Assessment && item.TAVI_R_Preprocedural_Imaging_Assessment.Effective_Orifice_Area_Aortic_Valve) {
            const areaValue = item.TAVI_R_Preprocedural_Imaging_Assessment.Effective_Orifice_Area_Aortic_Valve;
            effectiveArea = typeof areaValue === 'string' ? parseFloat(areaValue) : areaValue;
            if (isNaN(effectiveArea)) effectiveArea = null;
        }
        
        // 提取术后瓣周漏 - 从TAVI_R_Evaluation_PostProcedure_Before_Discharge.PVL_Detected_Before_Discharge
        let pvl = null;
        if (item.TAVI_R_Evaluation_PostProcedure_Before_Discharge && 
            item.TAVI_R_Evaluation_PostProcedure_Before_Discharge.PVL_Detected_Before_Discharge !== null &&
            item.TAVI_R_Evaluation_PostProcedure_Before_Discharge.PVL_Detected_Before_Discharge !== undefined) {
            const pvlValue = item.TAVI_R_Evaluation_PostProcedure_Before_Discharge.PVL_Detected_Before_Discharge;
            if (typeof pvlValue === 'boolean') {
                pvl = pvlValue;
            } else if (typeof pvlValue === 'string') {
                const pvlStr = pvlValue.toLowerCase();
                pvl = pvlStr === 'true' || pvlStr === 'yes' || pvlStr === '是';
            }
        }
        
        // 提取出院前死亡 - 从TAVI_R_Evaluation_PostProcedure_Before_Discharge.All_Cause_Mortality_Before_Discharge
        let death = null;
        if (item.TAVI_R_Evaluation_PostProcedure_Before_Discharge && 
            item.TAVI_R_Evaluation_PostProcedure_Before_Discharge.All_Cause_Mortality_Before_Discharge !== null &&
            item.TAVI_R_Evaluation_PostProcedure_Before_Discharge.All_Cause_Mortality_Before_Discharge !== undefined) {
            const deathValue = item.TAVI_R_Evaluation_PostProcedure_Before_Discharge.All_Cause_Mortality_Before_Discharge;
            if (typeof deathValue === 'boolean') {
                death = deathValue;
            } else if (typeof deathValue === 'string') {
                const deathStr = deathValue.toLowerCase();
                death = deathStr === 'true' || deathStr === 'yes' || deathStr === '是';
            }
        }
        
        return {
            id: item.id || Math.random().toString(36).substr(2, 9),
            age: age,
            gender: gender,
            valveType: valveType,
            valveBrand: valveBrand,
            nyha: nyha,
            ef: ef,
            maxGradient: maxGradient,
            meanGradient: meanGradient,
            effectiveArea: effectiveArea,
            pvl: pvl,
            death: death,
            originalData: item
        };
    });
    
    // 按ID排序
    filteredData.sort((a, b) => {
        // 尝试按数字排序，如果不是数字则按字符串排序
        const aId = isNaN(a.id) ? a.id : parseInt(a.id);
        const bId = isNaN(b.id) ? b.id : parseInt(b.id);
        
        if (typeof aId === 'number' && typeof bId === 'number') {
            return aId - bId;
        } else {
            return a.id.toString().localeCompare(b.id.toString());
        }
    });
    
    // 重置到第一页
    currentPage = 1;
    
    console.log(`处理完成，有效数据 ${filteredData.length} 条`);
    
    // 数据完整性统计
    const ageCount = filteredData.filter(item => item.age !== null).length;
    const genderCount = filteredData.filter(item => item.gender !== null).length;
    const valveTypeCount = filteredData.filter(item => item.valveType !== null).length;
    const valveBrandCount = filteredData.filter(item => item.valveBrand !== null).length;
    const nyhaCount = filteredData.filter(item => item.nyha !== null).length;
    const efCount = filteredData.filter(item => item.ef !== null).length;
    const maxGradientCount = filteredData.filter(item => item.maxGradient !== null).length;
    const meanGradientCount = filteredData.filter(item => item.meanGradient !== null).length;
    const effectiveAreaCount = filteredData.filter(item => item.effectiveArea !== null).length;
    const pvlCount = filteredData.filter(item => item.pvl !== null).length;
    const deathCount = filteredData.filter(item => item.death !== null).length;
    
    console.log('数据完整性统计:');
    console.log(`年龄: ${ageCount}/${filteredData.length} (${(ageCount/filteredData.length*100).toFixed(1)}%)`);
    console.log(`性别: ${genderCount}/${filteredData.length} (${(genderCount/filteredData.length*100).toFixed(1)}%)`);
    console.log(`瓣膜类型: ${valveTypeCount}/${filteredData.length} (${(valveTypeCount/filteredData.length*100).toFixed(1)}%)`);
    console.log(`瓣膜品牌: ${valveBrandCount}/${filteredData.length} (${(valveBrandCount/filteredData.length*100).toFixed(1)}%)`);
    console.log(`NYHA分级: ${nyhaCount}/${filteredData.length} (${(nyhaCount/filteredData.length*100).toFixed(1)}%)`);
    console.log(`射血分数: ${efCount}/${filteredData.length} (${(efCount/filteredData.length*100).toFixed(1)}%)`);
    console.log(`最大跨瓣压差: ${maxGradientCount}/${filteredData.length} (${(maxGradientCount/filteredData.length*100).toFixed(1)}%)`);
    console.log(`平均跨瓣压差: ${meanGradientCount}/${filteredData.length} (${(meanGradientCount/filteredData.length*100).toFixed(1)}%)`);
    console.log(`有效瓣口面积: ${effectiveAreaCount}/${filteredData.length} (${(effectiveAreaCount/filteredData.length*100).toFixed(1)}%)`);
    console.log(`术后瓣周漏: ${pvlCount}/${filteredData.length} (${(pvlCount/filteredData.length*100).toFixed(1)}%)`);
    console.log(`出院前死亡: ${deathCount}/${filteredData.length} (${(deathCount/filteredData.length*100).toFixed(1)}%)`);
}

// 初始化标签页
function initializeTabs() {
    console.log('初始化标签页...');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log(`找到 ${tabs.length} 个标签页，${tabContents.length} 个内容区域`);
    
    tabs.forEach((tab, index) => {
        console.log(`绑定标签页 ${index}: ${tab.getAttribute('data-tab')}`);
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`点击标签页: ${this.getAttribute('data-tab')}`);
            
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有活动状态
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // 添加活动状态
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab + '-content');
            if (targetContent) {
                targetContent.classList.add('active');
                console.log(`显示内容区域: ${targetTab}-content`);
            } else {
                console.error(`找不到内容区域: ${targetTab}-content`);
            }
        });
    });
}

// 初始化下拉菜单
function initializeDropdowns() {
    console.log('初始化下拉菜单...');
    const dropdowns = document.querySelectorAll('.dropdown');
    const filterForm = document.querySelector('.filter-form');
    
    console.log(`找到 ${dropdowns.length} 个下拉菜单`);
    
    dropdowns.forEach((dropdown, index) => {
        const header = dropdown.querySelector('.dropdown-header');
        const menu = dropdown.querySelector('.dropdown-menu');
        const items = dropdown.querySelectorAll('.dropdown-item');
        const filterItem = dropdown.closest('.filter-item');
        
        if (!header || !menu) {
            console.warn(`下拉菜单 ${index} 缺少必要元素`);
            return;
        }
        
        console.log(`绑定下拉菜单 ${index}，包含 ${items.length} 个选项`);
        
        // 点击头部切换菜单显示
        header.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`点击下拉菜单头部 ${index}`);
            
            // 关闭其他所有下拉菜单
            dropdowns.forEach((otherDropdown, otherIndex) => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                    const otherMenu = otherDropdown.querySelector('.dropdown-menu');
                    const otherFilterItem = otherDropdown.closest('.filter-item');
                    if (otherMenu) {
                        otherMenu.style.display = 'none';
                    }
                    if (otherFilterItem) {
                        otherFilterItem.classList.remove('active-dropdown-parent');
                    }
                }
            });
            
            // 移除表单的活动状态类
            if (filterForm) {
                filterForm.classList.remove('has-active-dropdown');
            }
            
            // 切换当前下拉菜单
            const isActive = dropdown.classList.contains('active');
            if (isActive) {
                dropdown.classList.remove('active');
                menu.style.display = 'none';
                if (filterItem) {
                    filterItem.classList.remove('active-dropdown-parent');
                }
                console.log(`关闭下拉菜单 ${index}`);
            } else {
                dropdown.classList.add('active');
                menu.style.display = 'block';
                if (filterItem) {
                    filterItem.classList.add('active-dropdown-parent');
                }
                if (filterForm) {
                    filterForm.classList.add('has-active-dropdown');
                }
                console.log(`打开下拉菜单 ${index}`);
            }
        });
        
        // 点击选项
        items.forEach((item, itemIndex) => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const text = this.textContent.trim();
                console.log(`选择选项: ${text}`);
                
                // 更新显示文本
                const headerSpan = header.querySelector('span');
                if (headerSpan) {
                    headerSpan.textContent = text;
                }
                
                // 设置选中状态
                items.forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
                
                // 关闭菜单
                dropdown.classList.remove('active');
                menu.style.display = 'none';
                if (filterItem) {
                    filterItem.classList.remove('active-dropdown-parent');
                }
                if (filterForm) {
                    filterForm.classList.remove('has-active-dropdown');
                }
                
                // 触发筛选（如果有数据的话）
                if (typeof applyFilters === 'function') {
                    applyFilters();
                }
            });
        });
    });
    
    // 点击外部关闭所有菜单
    document.addEventListener('click', function(e) {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
                const menu = dropdown.querySelector('.dropdown-menu');
                const filterItem = dropdown.closest('.filter-item');
                if (menu) {
                    menu.style.display = 'none';
                }
                if (filterItem) {
                    filterItem.classList.remove('active-dropdown-parent');
                }
            }
        });
        
        // 移除表单的活动状态类
        if (filterForm) {
            filterForm.classList.remove('has-active-dropdown');
        }
    });
}

// 初始化筛选器
function initializeFilters() {
    console.log('初始化筛选器...');
    
    // 年龄范围筛选
    const ageMin = document.querySelector('.range-min');
    const ageMax = document.querySelector('.range-max');
    
    if (ageMin && ageMax) {
        ageMin.addEventListener('input', applyFilters);
        ageMax.addEventListener('input', applyFilters);
        console.log('年龄筛选器初始化成功');
    } else {
        console.warn('找不到年龄筛选器元素');
    }
    
    // 射血分数范围筛选 - 查找体表面积输入框作为射血分数
    const efInputs = document.querySelectorAll('input[placeholder="e.g. 2.4"]');
    if (efInputs.length >= 2) {
        efInputs[0].addEventListener('input', applyFilters);
        efInputs[1].addEventListener('input', applyFilters);
        console.log('射血分数筛选器初始化成功');
    } else {
        console.warn('找不到射血分数筛选器元素');
    }
}

// 应用筛选器
function applyFilters() {
    console.log('应用筛选器...');
    
    if (!allData || allData.length === 0) {
        console.warn('没有数据可筛选');
        return;
    }
    
    // 获取年龄筛选条件
    const ageMin = document.querySelector('.range-min');
    const ageMax = document.querySelector('.range-max');
    
    let minAge = null;
    let maxAge = null;
    
    if (ageMin && ageMin.value) {
        minAge = parseInt(ageMin.value);
    }
    if (ageMax && ageMax.value) {
        maxAge = parseInt(ageMax.value);
    }
    
    // 获取性别筛选条件
    const genderDropdown = document.querySelector('[data-filter="gender"]');
    let selectedGender = null;
    if (genderDropdown) {
        const selectedItem = genderDropdown.querySelector('.dropdown-item.selected');
        if (selectedItem) {
            const genderText = selectedItem.textContent.trim();
            if (genderText === '男性') selectedGender = 'male';
            else if (genderText === '女性') selectedGender = 'female';
        }
    }
    
    // 应用筛选
    filteredData = allData.map(item => {
        // 重新处理数据以确保格式正确
        return processDataItem(item);
    }).filter(item => {
        // 年龄筛选
        if (minAge !== null && (item.age === null || item.age < minAge)) return false;
        if (maxAge !== null && (item.age === null || item.age > maxAge)) return false;
        
        // 性别筛选
        if (selectedGender && item.gender !== selectedGender) return false;
        
        return true;
    });
    
    // 按ID排序
    filteredData.sort((a, b) => {
        const aId = isNaN(a.id) ? a.id : parseInt(a.id);
        const bId = isNaN(b.id) ? b.id : parseInt(b.id);
        
        if (typeof aId === 'number' && typeof bId === 'number') {
            return aId - bId;
        } else {
            return a.id.toString().localeCompare(b.id.toString());
        }
    });
    
    // 重置到第一页
    currentPage = 1;
    
    console.log(`筛选后数据: ${filteredData.length} 条`);
    
    // 更新显示
    updateStatistics();
    updateCharts();
    updateTable();
}

// 处理单个数据项
function processDataItem(item) {
    // 提取年龄
    let age = null;
    if (item.Baseline_Characteristics && item.Baseline_Characteristics.Age) {
        const ageValue = item.Baseline_Characteristics.Age;
        age = typeof ageValue === 'string' ? parseInt(ageValue) : ageValue;
        if (isNaN(age)) age = null;
    }
    
    // 提取性别
    let gender = null;
    if (item.Baseline_Characteristics && item.Baseline_Characteristics.Sex) {
        const sexValue = item.Baseline_Characteristics.Sex.toString().toLowerCase();
        if (sexValue === 'male' || sexValue === 'm' || sexValue === '男') {
            gender = 'male';
        } else if (sexValue === 'female' || sexValue === 'f' || sexValue === '女') {
            gender = 'female';
        }
    }
    
    // 提取瓣膜类型
    let valveType = null;
    if (item.TAVI_R_Procedural_Details && item.TAVI_R_Procedural_Details.THV_Type) {
        valveType = item.TAVI_R_Procedural_Details.THV_Type.toString();
    }
    
    // 提取瓣膜品牌
    let valveBrand = null;
    if (item.TAVI_R_Procedural_Details && item.TAVI_R_Procedural_Details.THV_Brand) {
        valveBrand = item.TAVI_R_Procedural_Details.THV_Brand.toString();
    }
    
    // 提取NYHA分级
    let nyha = null;
    if (item.Baseline_Characteristics && item.Baseline_Characteristics.New_York_Heart_Association_NYHA_Classification) {
        nyha = item.Baseline_Characteristics.New_York_Heart_Association_NYHA_Classification.toString();
    }
    
    // 提取射血分数
    let ef = null;
    if (item.TAVI_R_Preprocedural_Imaging_Assessment && item.TAVI_R_Preprocedural_Imaging_Assessment.LVEF) {
        const efValue = item.TAVI_R_Preprocedural_Imaging_Assessment.LVEF;
        ef = typeof efValue === 'string' ? parseFloat(efValue) : efValue;
        if (isNaN(ef)) ef = null;
    }
    
    // 提取最大主动脉瓣跨瓣压差
    let maxGradient = null;
    if (item.TAVI_R_Preprocedural_Imaging_Assessment && item.TAVI_R_Preprocedural_Imaging_Assessment.Peak_Aortic_Valve_Gradient) {
        const gradientValue = item.TAVI_R_Preprocedural_Imaging_Assessment.Peak_Aortic_Valve_Gradient;
        maxGradient = typeof gradientValue === 'string' ? parseFloat(gradientValue) : gradientValue;
        if (isNaN(maxGradient)) maxGradient = null;
    }
    
    // 提取平均主动脉瓣跨瓣压差
    let meanGradient = null;
    if (item.TAVI_R_Preprocedural_Imaging_Assessment && item.TAVI_R_Preprocedural_Imaging_Assessment.Mean_Aortic_Valve_Gradient) {
        const gradientValue = item.TAVI_R_Preprocedural_Imaging_Assessment.Mean_Aortic_Valve_Gradient;
        meanGradient = typeof gradientValue === 'string' ? parseFloat(gradientValue) : gradientValue;
        if (isNaN(meanGradient)) meanGradient = null;
    }
    
    // 提取有效瓣口面积
    let effectiveArea = null;
    if (item.TAVI_R_Preprocedural_Imaging_Assessment && item.TAVI_R_Preprocedural_Imaging_Assessment.Effective_Orifice_Area_Aortic_Valve) {
        const areaValue = item.TAVI_R_Preprocedural_Imaging_Assessment.Effective_Orifice_Area_Aortic_Valve;
        effectiveArea = typeof areaValue === 'string' ? parseFloat(areaValue) : areaValue;
        if (isNaN(effectiveArea)) effectiveArea = null;
    }
    
    // 提取术后瓣周漏
    let pvl = null;
    if (item.TAVI_R_Evaluation_PostProcedure_Before_Discharge && 
        item.TAVI_R_Evaluation_PostProcedure_Before_Discharge.PVL_Detected_Before_Discharge !== null &&
        item.TAVI_R_Evaluation_PostProcedure_Before_Discharge.PVL_Detected_Before_Discharge !== undefined) {
        const pvlValue = item.TAVI_R_Evaluation_PostProcedure_Before_Discharge.PVL_Detected_Before_Discharge;
        if (typeof pvlValue === 'boolean') {
            pvl = pvlValue;
        } else if (typeof pvlValue === 'string') {
            const pvlStr = pvlValue.toLowerCase();
            pvl = pvlStr === 'true' || pvlStr === 'yes' || pvlStr === '是';
        }
    }
    
    // 提取出院前死亡
    let death = null;
    if (item.TAVI_R_Evaluation_PostProcedure_Before_Discharge && 
        item.TAVI_R_Evaluation_PostProcedure_Before_Discharge.All_Cause_Mortality_Before_Discharge !== null &&
        item.TAVI_R_Evaluation_PostProcedure_Before_Discharge.All_Cause_Mortality_Before_Discharge !== undefined) {
        const deathValue = item.TAVI_R_Evaluation_PostProcedure_Before_Discharge.All_Cause_Mortality_Before_Discharge;
        if (typeof deathValue === 'boolean') {
            death = deathValue;
        } else if (typeof deathValue === 'string') {
            const deathStr = deathValue.toLowerCase();
            death = deathStr === 'true' || deathStr === 'yes' || deathStr === '是';
        }
    }
    
    return {
        id: item.id || Math.random().toString(36).substr(2, 9),
        age: age,
        gender: gender,
        valveType: valveType,
        valveBrand: valveBrand,
        nyha: nyha,
        ef: ef,
        maxGradient: maxGradient,
        meanGradient: meanGradient,
        effectiveArea: effectiveArea,
        pvl: pvl,
        death: death,
        originalData: item
    };
}

// 初始化图表（使用数据标签插件版本）
function initializeCharts() {
    console.log('初始化图表...');
    
    // 年龄分布图
    const ageCtx = document.getElementById('ageChart');
    if (ageCtx) {
        charts.age = new Chart(ageCtx, {
            type: 'bar',
            data: {
                labels: ['无数据'],
                datasets: [{
                    label: '患者数量',
                    data: [0],
                    backgroundColor: 'rgba(200, 200, 200, 0.6)',
                    borderColor: 'rgba(200, 200, 200, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false
                    },
                    datalabels: {
                        display: true,
                        anchor: 'end',
                        align: 'top',
                        color: '#333',
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        formatter: function(value) {
                            return value > 0 ? value : '';
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            },
            plugins: [ChartDataLabels] // 注册数据标签插件
        });
    }
    
    // NYHA分级分布图
    const nyhaCtx = document.getElementById('nyhaChart');
    if (nyhaCtx) {
        charts.nyha = new Chart(nyhaCtx, {
            type: 'pie',
            data: {
                labels: ['无数据'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['rgba(200, 200, 200, 0.6)'],
                    borderColor: ['rgba(200, 200, 200, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false
                    }
                }
            }
        });
    }
    
    // 初始化完成后更新图表数据
    updateCharts();
}

// 更新图表数据
function updateCharts() {
    console.log('更新图表数据...');
    
    if (!filteredData || filteredData.length === 0) {
        console.log('没有数据可显示');
        return;
    }
    
    // 更新年龄分布图
    if (charts.age) {
        const ageGroups = {};
        filteredData.forEach(item => {
            if (item.age !== null && item.age !== undefined) {
                let ageLabel;
                if (item.age >= 90) {
                    // 90岁及以上归入"90岁以上"组
                    ageLabel = '90岁以上';
                } else {
                    const ageGroup = Math.floor(item.age / 10) * 10;
                    ageLabel = `${ageGroup}-${ageGroup + 9}岁`;
                }
                ageGroups[ageLabel] = (ageGroups[ageLabel] || 0) + 1;
            }
        });
        
        // 按年龄组排序，确保"90岁以上"在最后
        const ageLabels = Object.keys(ageGroups).sort((a, b) => {
            if (a === '90岁以上') return 1;
            if (b === '90岁以上') return -1;
            const aStart = parseInt(a.split('-')[0]);
            const bStart = parseInt(b.split('-')[0]);
            return aStart - bStart;
        });
        const ageData = ageLabels.map(label => ageGroups[label]);
        
        if (ageLabels.length > 0) {
            charts.age.data.labels = ageLabels;
            charts.age.data.datasets[0].data = ageData;
            charts.age.data.datasets[0].backgroundColor = 'rgba(54, 162, 235, 0.6)';
            charts.age.data.datasets[0].borderColor = 'rgba(54, 162, 235, 1)';
        } else {
            charts.age.data.labels = ['无数据'];
            charts.age.data.datasets[0].data = [0];
            charts.age.data.datasets[0].backgroundColor = 'rgba(200, 200, 200, 0.6)';
            charts.age.data.datasets[0].borderColor = 'rgba(200, 200, 200, 1)';
        }
        charts.age.update();
    }
    
    // 更新NYHA分级分布图
    if (charts.nyha) {
        const nyhaGroups = {
            'I级': 0,
            'II级': 0,
            'III级': 0,
            'IV级': 0
        };
        
        filteredData.forEach(item => {
            if (item.nyha !== null && item.nyha !== undefined) {
                let nyhaLevel = item.nyha.toString().trim();
                
                // 标准化NYHA分级格式，只统计I-IV级
                if (nyhaLevel === '1' || nyhaLevel.toLowerCase() === 'i' || nyhaLevel.toLowerCase().includes('i级')) {
                    nyhaGroups['I级']++;
                } else if (nyhaLevel === '2' || nyhaLevel.toLowerCase() === 'ii' || nyhaLevel.toLowerCase().includes('ii级')) {
                    nyhaGroups['II级']++;
                } else if (nyhaLevel === '3' || nyhaLevel.toLowerCase() === 'iii' || nyhaLevel.toLowerCase().includes('iii级')) {
                    nyhaGroups['III级']++;
                } else if (nyhaLevel === '4' || nyhaLevel.toLowerCase() === 'iv' || nyhaLevel.toLowerCase().includes('iv级')) {
                    nyhaGroups['IV级']++;
                }
                // 其他不标准的分级不统计
            }
        });
        
        // 只显示有数据的分级
        const nyhaLabels = [];
        const nyhaData = [];
        const nyhaColors = [];
        const nyhaBorderColors = [];
        
        const colorMap = {
            'I级': { bg: 'rgba(75, 192, 192, 0.6)', border: 'rgba(75, 192, 192, 1)' },
            'II级': { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgba(54, 162, 235, 1)' },
            'III级': { bg: 'rgba(255, 206, 86, 0.6)', border: 'rgba(255, 206, 86, 1)' },
            'IV级': { bg: 'rgba(255, 99, 132, 0.6)', border: 'rgba(255, 99, 132, 1)' }
        };
        
        Object.keys(nyhaGroups).forEach(level => {
            if (nyhaGroups[level] > 0) {
                nyhaLabels.push(level);
                nyhaData.push(nyhaGroups[level]);
                nyhaColors.push(colorMap[level].bg);
                nyhaBorderColors.push(colorMap[level].border);
            }
        });
        
        if (nyhaLabels.length > 0) {
            charts.nyha.data.labels = nyhaLabels;
            charts.nyha.data.datasets[0].data = nyhaData;
            charts.nyha.data.datasets[0].backgroundColor = nyhaColors;
            charts.nyha.data.datasets[0].borderColor = nyhaBorderColors;
        } else {
            charts.nyha.data.labels = ['无数据'];
            charts.nyha.data.datasets[0].data = [1];
            charts.nyha.data.datasets[0].backgroundColor = ['rgba(200, 200, 200, 0.6)'];
            charts.nyha.data.datasets[0].borderColor = ['rgba(200, 200, 200, 1)'];
        }
        charts.nyha.update();
    }
    
    console.log('图表更新完成');
}

// 更新统计信息
function updateStatistics() {
    console.log('更新统计信息...');
    
    const totalPatients = filteredData.length;
    const validAgeData = filteredData.filter(item => item.age !== null);
    const avgAge = validAgeData.length > 0 ? 
        validAgeData.reduce((sum, item) => sum + item.age, 0) / validAgeData.length : 0;
    
    const maleCount = filteredData.filter(item => item.gender === 'male').length;
    const femaleCount = filteredData.filter(item => item.gender === 'female').length;
    const genderTotal = maleCount + femaleCount;
    
    const pvlCount = filteredData.filter(item => item.pvl === true).length;
    const deathCount = filteredData.filter(item => item.death === true).length;
    const complicationTotal = pvlCount + deathCount;
    
    // 更新统计卡片
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
        // 总病例数
        statCards[0].querySelector('.stat-value').textContent = totalPatients;
        
        // 平均年龄
        statCards[1].querySelector('h3').textContent = '平均年龄';
        statCards[1].querySelector('.stat-value').textContent = avgAge > 0 ? avgAge.toFixed(1) + '岁' : 'N/A';
        
        // 男性比例
        statCards[2].querySelector('h3').textContent = '男性比例';
        statCards[2].querySelector('.stat-value').textContent = genderTotal > 0 ? 
            ((maleCount / genderTotal) * 100).toFixed(1) + '%' : 'N/A';
        
        // 并发症率
        statCards[3].querySelector('h3').textContent = '并发症率';
        statCards[3].querySelector('.stat-value').textContent = totalPatients > 0 ? 
            ((complicationTotal / totalPatients) * 100).toFixed(1) + '%' : 'N/A';
    }
}

// 更新表格
function updateTable() {
    console.log('更新表格...');
    
    const tableBody = document.getElementById('dataTableBody');
    if (!tableBody) {
        console.error('找不到表格body元素');
        return;
    }
    
    tableBody.innerHTML = '';
    
    // 计算分页数据
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
    const displayData = filteredData.slice(startIndex, endIndex);
    
    // 显示当前页数据
    displayData.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.age !== null ? item.age : '-'}</td>
            <td>${item.gender === 'male' ? '男' : item.gender === 'female' ? '女' : '-'}</td>
            <td>${formatLongText(item.valveType)}</td>
            <td>${formatLongText(item.valveBrand)}</td>
            <td>${item.nyha || '-'}</td>
            <td>${item.ef !== null ? item.ef.toFixed(1) : '-'}</td>
            <td>${item.maxGradient !== null ? item.maxGradient.toFixed(1) : '-'}</td>
            <td>${item.meanGradient !== null ? item.meanGradient.toFixed(1) : '-'}</td>
            <td>${item.effectiveArea !== null ? item.effectiveArea.toFixed(2) : '-'}</td>
            <td>${item.pvl === true ? '是' : item.pvl === false ? '否' : '-'}</td>
            <td>${item.death === true ? '是' : item.death === false ? '否' : '-'}</td>
            <td><button class="detail-btn" onclick="showPatientDetail('${item.id}')">详情</button></td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // 初始化工具提示
    initializeTooltips();
    
    // 更新分页信息
    updatePagination(totalPages);
}

// 格式化长文本
function formatLongText(text) {
    if (!text) return '-';
    
    const maxLength = 15;
    if (text.length > maxLength) {
        return `<span class="long-text" data-full-text="${text}">${text.substring(0, maxLength)}...</span>`;
    }
    return text;
}

// 初始化工具提示
function initializeTooltips() {
    const longTextElements = document.querySelectorAll('.long-text');
    
    longTextElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

// 显示工具提示
function showTooltip(event) {
    const element = event.target;
    const fullText = element.getAttribute('data-full-text');
    
    if (!fullText) return;
    
    // 创建工具提示元素
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = fullText;
    
    // 添加到页面
    document.body.appendChild(tooltip);
    
    // 计算位置 - 使用固定定位
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top - tooltipRect.height - 10;
    
    // 确保工具提示不超出屏幕边界
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) {
        top = rect.bottom + 10;
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    
    // 显示工具提示
    setTimeout(() => {
        tooltip.classList.add('show');
    }, 100);
    
    // 存储引用以便清理
    element._tooltip = tooltip;
}

// 隐藏工具提示
function hideTooltip(event) {
    const element = event.target;
    const tooltip = element._tooltip;
    
    if (tooltip) {
        tooltip.classList.remove('show');
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 300);
        element._tooltip = null;
    }
}

// 更新分页控件
function updatePagination(totalPages) {
    // 查找或创建分页容器
    let paginationContainer = document.querySelector('.pagination-container');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container';
        
        const tableContainer = document.querySelector('.data-table-container');
        if (tableContainer) {
            tableContainer.appendChild(paginationContainer);
        }
    }
    
    // 清空分页容器
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) {
        return; // 如果只有一页或没有数据，不显示分页
    }
    
    // 创建分页信息
    const pageInfo = document.createElement('div');
    pageInfo.className = 'page-info';
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);
    pageInfo.textContent = `显示 ${startIndex}-${endIndex} 条，共 ${filteredData.length} 条数据`;
    
    // 创建分页按钮容器
    const pageButtons = document.createElement('div');
    pageButtons.className = 'page-buttons';
    
    // 上一页按钮
    const prevButton = document.createElement('button');
    prevButton.className = 'page-btn';
    prevButton.textContent = '上一页';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            updateTable();
        }
    };
    pageButtons.appendChild(prevButton);
    
    // 页码按钮
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // 调整起始页
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // 如果起始页不是1，显示第一页和省略号
    if (startPage > 1) {
        const firstPageBtn = document.createElement('button');
        firstPageBtn.className = 'page-btn';
        firstPageBtn.textContent = '1';
        firstPageBtn.onclick = () => {
            currentPage = 1;
            updateTable();
        };
        pageButtons.appendChild(firstPageBtn);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'page-ellipsis';
            ellipsis.textContent = '...';
            pageButtons.appendChild(ellipsis);
        }
    }
    
    // 显示页码按钮
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-btn';
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.textContent = i;
        pageBtn.onclick = () => {
            currentPage = i;
            updateTable();
        };
        pageButtons.appendChild(pageBtn);
    }
    
    // 如果结束页不是最后一页，显示省略号和最后一页
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'page-ellipsis';
            ellipsis.textContent = '...';
            pageButtons.appendChild(ellipsis);
        }
        
        const lastPageBtn = document.createElement('button');
        lastPageBtn.className = 'page-btn';
        lastPageBtn.textContent = totalPages;
        lastPageBtn.onclick = () => {
            currentPage = totalPages;
            updateTable();
        };
        pageButtons.appendChild(lastPageBtn);
    }
    
    // 下一页按钮
    const nextButton = document.createElement('button');
    nextButton.className = 'page-btn';
    nextButton.textContent = '下一页';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateTable();
        }
    };
    pageButtons.appendChild(nextButton);
    
    // 添加到容器
    paginationContainer.appendChild(pageInfo);
    paginationContainer.appendChild(pageButtons);
}

// 显示患者详情
function showPatientDetail(patientId) {
    const patient = filteredData.find(item => item.id === patientId);
    if (patient) {
        console.log('患者详情:', patient);
        // 这里可以添加详情弹窗或跳转逻辑
        alert(`患者ID: ${patient.id}\n年龄: ${patient.age || '未知'}\n性别: ${patient.gender || '未知'}`);
    }
}

// 显示错误信息
function showErrorMessage(message) {
    const tableBody = document.getElementById('dataTableBody');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; color: #ff6b6b; padding: 20px;">
                    <strong>错误：${message}</strong><br>
                    <small>请检查浏览器控制台获取详细信息</small>
                </td>
            </tr>
        `;
    }
}

// 无数据时的初始化
function initializeWithoutData() {
    // 设置默认的统计数据
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
        statCards[0].querySelector('.stat-value').textContent = '0';
        statCards[1].querySelector('h3').textContent = '平均年龄';
        statCards[1].querySelector('.stat-value').textContent = 'N/A';
        statCards[2].querySelector('h3').textContent = '男性比例';
        statCards[2].querySelector('.stat-value').textContent = 'N/A';
        statCards[3].querySelector('h3').textContent = '并发症率';
        statCards[3].querySelector('.stat-value').textContent = 'N/A';
    }
    
    // 初始化空图表
    initializeEmptyCharts();
}

// 初始化空图表
function initializeEmptyCharts() {
    // 年龄分布图
    const ageCtx = document.getElementById('ageChart');
    if (ageCtx) {
        charts.age = new Chart(ageCtx, {
            type: 'bar',
            data: {
                labels: ['无数据'],
                datasets: [{
                    label: '患者数量',
                    data: [0],
                    backgroundColor: 'rgba(200, 200, 200, 0.6)',
                    borderColor: 'rgba(200, 200, 200, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '年龄分布（无数据）'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // NYHA分级分布图
    const nyhaCtx = document.getElementById('nyhaChart');
    if (nyhaCtx) {
        charts.nyha = new Chart(nyhaCtx, {
            type: 'pie',
            data: {
                labels: ['无数据'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['rgba(200, 200, 200, 0.6)'],
                    borderColor: ['rgba(200, 200, 200, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'NYHA分级分布（无数据）'
                    }
                }
            }
        });
    }
}

// 切换图表展开/折叠状态
function toggleChart(chartId) {
    const chartContainer = document.getElementById(chartId);
    const toggleButton = chartContainer.querySelector('.chart-toggle');
    
    if (chartContainer.classList.contains('expanded')) {
        // 折叠图表
        chartContainer.classList.remove('expanded');
        chartContainer.classList.add('collapsed');
        toggleButton.textContent = '展开';
    } else {
        // 展开图表
        chartContainer.classList.remove('collapsed');
        chartContainer.classList.add('expanded');
        toggleButton.textContent = '收起';
        
        // 重新调整图表大小（Chart.js需要在容器可见时重新渲染）
        setTimeout(() => {
            const chartCanvas = chartContainer.querySelector('canvas');
            const chartId = chartCanvas.id;
            if (charts[chartId.replace('Chart', '')]) {
                charts[chartId.replace('Chart', '')].resize();
            }
        }, 300);
    }
}

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
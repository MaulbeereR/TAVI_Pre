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
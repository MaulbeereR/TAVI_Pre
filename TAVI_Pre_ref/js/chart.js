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
        'Medtronic Mosaic': 'rgba(148, 0, 211,.7)',   // 深紫色
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
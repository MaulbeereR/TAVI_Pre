// 替代方案：将数据标签显示在饼图外面
// 如果您更喜欢这种方式，可以替换现有的NYHA图表代码

function createNyhaChartWithExternalLabels() {
    const ctx = document.getElementById('nyha-chart');
    if (!ctx) return;
    
    charts.nyha = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: ['#4facfe', '#00f2fe', '#43e97b', '#f093fb']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    offset: 10,
                    color: '#333',
                    font: {
                        weight: 'bold',
                        size: 12
                    },
                    formatter: function(value, context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        const label = context.chart.data.labels[context.dataIndex];
                        return `${label}\n${value} (${percentage}%)`;
                    },
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: '#333',
                    borderRadius: 4,
                    borderWidth: 1,
                    padding: 6
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

// 使用说明：
// 1. 当前实现：数据显示在图例中，饼图保持简洁
// 2. 替代方案：数据标签显示在饼图外面，带有背景框
// 
// 如果要使用替代方案，请将 createNyhaChart 函数替换为 createNyhaChartWithExternalLabels 
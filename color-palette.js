/**
 * TAVI智能分析系统 - 配色库
 * 根据数据分类数量自动选择合适的配色方案
 */

class ColorPalette {
    constructor() {
        // 定义配色方案库
        this.colorSchemes = {
            // 2色方案
            2: [
                ['#5edb90', '#005a78'],
                ['#c48570', '#99766a'],
                ['#e7c0c1', '#af575e'],
                ['#85b8d9', '#5e3fc6']
            ],
            
            // 3色方案
            3: [
                ['#dfd6bc', '#d2c899', '#c6ba76'],
                ['#b7afa5', '#9f988f', '#87817a'],
                ['#b3a400', '#fff580', '#ffea00']
            ],
            
            // 4色方案
            4: [
                ['#e5be87', '#c48a3f', '#8f6d55', '#465799'],
                ['#4e2c61', '#685846', '#7b7e69', '#84a0d3']
            ],
            
            // 5色方案
            5: [
                ['#dce5cf', '#83c9ba', '#82c08e', '#8db06a', '#5a817a'],
                ['#a169c3', '#b792d6', '#ccbbe9', '#e2e5fb', '#f2468d']
            ],
            
            // 6色方案
            6: [
                ['#cb9a8f', '#c19f8f', '#b7a48f', '#a0ae8f', '#86b68e', '#62bf8e'],
                ['#f2468d', '#f38ec9', '#ef9beb', '#ec75f0', '#a169c3', '#b792d6']
            ],
            
            // 7色方案
            7: [
                ['#cecfcc', '#ceccc0', '#cdc9b4', '#ccc29c', '#bcb698', '#9ea4a8', '#8092b4']
            ],
            
            // 8色及以上的通用方案
            8: [
                ['#dce5cf', '#83c9ba', '#82c08e', '#8db06a', '#5a817a', '#cb9a8f', '#c19f8f', '#b7a48f'],
                ['#a169c3', '#b792d6', '#ccbbe9', '#e2e5fb', '#f2468d', '#f38ec9', '#ef9beb', '#ec75f0']
            ]
        };
        
        // 当前使用的配色方案索引
        this.currentSchemeIndex = 0;
    }
    
    /**
     * 根据分类数量获取配色方案
     * @param {number} count - 分类数量
     * @param {string} chartType - 图表类型 ('pie', 'bar', 'line', etc.)
     * @returns {Array} 颜色数组
     */
    getColors(count, chartType = 'default') {
        if (count <= 0) return [];
        
        // 确定使用哪个配色方案组
        let schemeKey = count;
        if (count > 8) {
            schemeKey = 8; // 使用8色方案并扩展
        } else if (!this.colorSchemes[count]) {
            // 如果没有对应数量的方案，使用最接近的较大方案
            const availableKeys = Object.keys(this.colorSchemes).map(Number).sort((a, b) => a - b);
            schemeKey = availableKeys.find(key => key >= count) || 8;
        }
        
        // 获取配色方案组
        const schemes = this.colorSchemes[schemeKey];
        const selectedScheme = schemes[this.currentSchemeIndex % schemes.length];
        
        // 如果需要的颜色数量超过方案提供的数量，进行扩展
        if (count > selectedScheme.length) {
            return this.extendColors(selectedScheme, count);
        }
        
        // 返回所需数量的颜色
        return selectedScheme.slice(0, count);
    }
    
    /**
     * 扩展颜色数组到指定数量
     * @param {Array} baseColors - 基础颜色数组
     * @param {number} targetCount - 目标数量
     * @returns {Array} 扩展后的颜色数组
     */
    extendColors(baseColors, targetCount) {
        const extended = [...baseColors];
        
        while (extended.length < targetCount) {
            // 通过调整亮度来生成新颜色
            const baseColor = baseColors[extended.length % baseColors.length];
            const newColor = this.adjustBrightness(baseColor, 0.8 + (extended.length % 3) * 0.1);
            extended.push(newColor);
        }
        
        return extended.slice(0, targetCount);
    }
    
    /**
     * 调整颜色亮度
     * @param {string} hex - 十六进制颜色值
     * @param {number} factor - 亮度因子 (0-2, 1为原色)
     * @returns {string} 调整后的颜色
     */
    adjustBrightness(hex, factor) {
        // 移除 # 符号
        hex = hex.replace('#', '');
        
        // 转换为 RGB
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // 调整亮度
        const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
        const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
        const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
        
        // 转换回十六进制
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    
    /**
     * 切换到下一个配色方案
     */
    nextScheme() {
        this.currentSchemeIndex++;
    }
    
    /**
     * 重置配色方案索引
     */
    resetScheme() {
        this.currentSchemeIndex = 0;
    }
    
    /**
     * 获取特定图表类型的推荐配色
     * @param {number} count - 分类数量
     * @param {string} chartType - 图表类型
     * @returns {Array} 颜色数组
     */
    getChartColors(count, chartType) {
        const colors = this.getColors(count, chartType);
        
        // 根据图表类型进行特殊处理
        switch (chartType) {
            case 'pie':
            case 'doughnut':
                // 饼图使用对比度更高的颜色
                return colors;
                
            case 'bar':
            case 'column':
                // 柱状图可以使用渐变效果
                return colors;
                
            case 'line':
                // 折线图使用更鲜明的颜色
                return colors.map(color => this.adjustBrightness(color, 1.1));
                
            default:
                return colors;
        }
    }
    
    /**
     * 预览所有配色方案
     * @returns {Object} 所有配色方案
     */
    getAllSchemes() {
        return this.colorSchemes;
    }
}

// 创建全局配色实例
const colorPalette = new ColorPalette();

// 导出配色函数供图表使用
window.getChartColors = function(count, chartType = 'default') {
    return colorPalette.getChartColors(count, chartType);
};

window.nextColorScheme = function() {
    colorPalette.nextScheme();
};

window.resetColorScheme = function() {
    colorPalette.resetScheme();
};

// 使用示例：
// const colors = getChartColors(4, 'pie'); // 获取4色饼图配色
// const barColors = getChartColors(6, 'bar'); // 获取6色柱状图配色 
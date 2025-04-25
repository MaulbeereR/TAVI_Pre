/**
 * 辅助函数：截断文本
 * 如果文本长度超过指定值，截断并添加省略号
 * @param {String} text - 原始文本
 * @param {Number} maxLength - 最大长度
 * @returns {String} 处理后的文本
 */
function truncateText(text, maxLength) {
    if (text === 'N/A') return text;
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
} 
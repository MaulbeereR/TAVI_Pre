#!/usr/bin/env node

/**
 * TAVI字段映射知识库验证脚本
 * 用于验证 data/tavi_field_mapping.json 文件的有效性
 */

const fs = require('fs');
const path = require('path');

const KNOWLEDGE_BASE_PATH = path.join(__dirname, '../data/tavi_field_mapping.json');

console.log('🔍 TAVI字段映射知识库验证工具');
console.log('='.repeat(50));

// 验证函数
function validateKnowledgeBase() {
    let errors = [];
    let warnings = [];
    let stats = {
        totalMappings: 0,
        booleanFields: 0,
        numericFields: 0,
        categoricalFields: 0
    };

    try {
        // 1. 检查文件是否存在
        if (!fs.existsSync(KNOWLEDGE_BASE_PATH)) {
            errors.push(`❌ 知识库文件不存在: ${KNOWLEDGE_BASE_PATH}`);
            return { errors, warnings, stats };
        }

        // 2. 读取并解析JSON文件
        const content = fs.readFileSync(KNOWLEDGE_BASE_PATH, 'utf8');
        let data;
        
        try {
            data = JSON.parse(content);
        } catch (parseError) {
            errors.push(`❌ JSON格式错误: ${parseError.message}`);
            return { errors, warnings, stats };
        }

        console.log('✅ 文件格式正确');

        // 3. 验证顶级结构
        const requiredKeys = ['field_mapping', 'data_type_info', 'units'];
        requiredKeys.forEach(key => {
            if (!data[key]) {
                errors.push(`❌ 缺少必需的顶级键: ${key}`);
            }
        });

        if (errors.length > 0) return { errors, warnings, stats };

        // 4. 验证field_mapping结构
        const fieldMapping = data.field_mapping;
        const categories = Object.keys(fieldMapping);
        
        console.log(`📂 发现 ${categories.length} 个分类:`);
        categories.forEach(category => {
            const mappings = fieldMapping[category];
            const count = Object.keys(mappings).length;
            stats.totalMappings += count;
            console.log(`   • ${category}: ${count} 个字段映射`);
        });

        // 5. 验证data_type_info
        const dataTypeInfo = data.data_type_info;
        const typeKeys = ['boolean_fields', 'numeric_fields', 'categorical_fields'];
        
        typeKeys.forEach(typeKey => {
            if (!Array.isArray(dataTypeInfo[typeKey])) {
                errors.push(`❌ ${typeKey} 必须是数组`);
            } else {
                stats[typeKey.replace('_fields', 'Fields')] = dataTypeInfo[typeKey].length;
            }
        });

        // 6. 检查字段映射一致性
        const allEnglishFields = new Set();
        Object.values(fieldMapping).forEach(categoryMappings => {
            Object.values(categoryMappings).forEach(englishField => {
                if (allEnglishFields.has(englishField)) {
                    warnings.push(`⚠️  重复的英文字段: ${englishField}`);
                }
                allEnglishFields.add(englishField);
            });
        });

        // 7. 检查数据类型字段是否都在映射中存在
        const allTypeFields = new Set([
            ...dataTypeInfo.boolean_fields,
            ...dataTypeInfo.numeric_fields,
            ...dataTypeInfo.categorical_fields
        ]);

        allTypeFields.forEach(field => {
            if (!allEnglishFields.has(field)) {
                warnings.push(`⚠️  数据类型中的字段未在映射中找到: ${field}`);
            }
        });

        allEnglishFields.forEach(field => {
            if (!allTypeFields.has(field)) {
                warnings.push(`⚠️  映射中的字段未定义数据类型: ${field}`);
            }
        });

        // 8. 检查单位信息
        const units = data.units;
        const numericFields = new Set(dataTypeInfo.numeric_fields);
        
        Object.keys(units).forEach(field => {
            if (!numericFields.has(field)) {
                warnings.push(`⚠️  为非数值字段定义了单位: ${field}`);
            }
        });

        numericFields.forEach(field => {
            if (!units[field]) {
                warnings.push(`⚠️  数值字段缺少单位定义: ${field}`);
            }
        });

        console.log('✅ 结构验证完成');

    } catch (error) {
        errors.push(`❌ 验证过程出错: ${error.message}`);
    }

    return { errors, warnings, stats };
}

// 执行验证
const result = validateKnowledgeBase();

// 输出结果
console.log('\n📊 统计信息:');
console.log(`   • 总字段映射数: ${result.stats.totalMappings}`);
console.log(`   • 布尔值字段数: ${result.stats.booleanFields}`);
console.log(`   • 数值字段数: ${result.stats.numericFields}`);
console.log(`   • 分类字段数: ${result.stats.categoricalFields}`);

if (result.errors.length > 0) {
    console.log('\n🚨 发现错误:');
    result.errors.forEach(error => console.log(`   ${error}`));
}

if (result.warnings.length > 0) {
    console.log('\n⚠️  警告信息:');
    result.warnings.forEach(warning => console.log(`   ${warning}`));
}

if (result.errors.length === 0) {
    console.log('\n🎉 知识库验证通过！');
    console.log('💡 建议: 定期运行此脚本以确保知识库的完整性');
} else {
    console.log('\n❌ 知识库验证失败，请修复上述错误');
    process.exit(1);
}

// 生成使用示例
console.log('\n📝 使用示例:');
console.log('   node tools/validate_knowledge_base.js');
console.log('   npm run validate-kb  # 如果已配置npm脚本');

module.exports = { validateKnowledgeBase }; 
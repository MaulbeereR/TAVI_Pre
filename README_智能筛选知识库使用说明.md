# TAVI智能筛选知识库使用说明

## 概述

本系统已升级支持知识库辅助的智能筛选功能，能够更准确地将自然语言查询转换为数据库筛选条件，并在UI中提供可解释的筛选结果展示。

## 新增功能

### 1. 字段映射知识库

**文件位置**: `data/tavi_field_mapping.json`

该文件包含了完整的中英文字段映射表，支持：
- 🟢 **基线资料** - 年龄、性别、疾病史等
- 🟠 **术前影像学评估** - LVEF、跨瓣压差、瓣环指标等  
- 🔴 **手术信息** - 瓣膜类型、入路方式、并发症等
- 🟣 **出院前评价** - 死亡率、起搏器植入等
- 🔵 **随访信息** - 长期预后指标等

### 2. 智能筛选增强

**配置选项**: 
```javascript
const INTELLIGENT_FILTER_CONFIG = {
    useKnowledgeBase: true,  // 控制是否使用知识库
    knowledgeBasePath: './data/tavi_field_mapping.json'
};
```

**功能特点**:
- ✅ 自动加载字段映射知识库
- ✅ 支持200+医学术语的中英文映射
- ✅ 智能识别数据类型（布尔、数值、分类）
- ✅ 提供单位信息辅助解析

### 3. 可解释的筛选结果

**UI增强**:
- 🎯 AI解析结果实时展示
- 🏷️ 彩色标签分类显示筛选条件
- 🔍 筛选条件自动映射到UI控件
- 📊 支持通用字段的动态处理

## 后端API适配说明

### 请求格式更新

智能筛选API (`/api/text-to-sql-to-filter`) 现在接收以下格式：

```json
{
    "query": "查找年龄大于75岁且有高血压的女性患者",
    "knowledge_base": {
        "field_mapping": {
            "基线资料": {
                "年龄": "age",
                "性别": "sex",
                "高血压": "hypertension"
            }
        },
        "data_type_info": {
            "boolean_fields": ["hypertension"],
            "numeric_fields": ["age"],
            "categorical_fields": ["sex"]
        },
        "units": {
            "age": "岁"
        }
    }
}
```

### 建议的后端处理逻辑

```python
def process_natural_language_query(request_data):
    query = request_data.get('query')
    knowledge_base = request_data.get('knowledge_base', {})
    
    # 使用知识库信息辅助AI解析
    if knowledge_base:
        # 1. 构建提示词，包含字段映射信息
        field_mapping = knowledge_base.get('field_mapping', {})
        data_types = knowledge_base.get('data_type_info', {})
        units = knowledge_base.get('units', {})
        
        # 2. 生成增强的提示词
        enhanced_prompt = f"""
        用户查询: {query}
        
        可用字段映射:
        {json.dumps(field_mapping, ensure_ascii=False, indent=2)}
        
        数据类型信息:
        {json.dumps(data_types, ensure_ascii=False, indent=2)}
        
        字段单位:
        {json.dumps(units, ensure_ascii=False, indent=2)}
        
        请根据以上信息将查询转换为筛选条件...
        """
        
        # 3. 调用AI服务处理增强提示词
        filters = ai_service.process_query(enhanced_prompt)
    else:
        # 4. 降级处理：使用原有逻辑
        filters = ai_service.process_query(query)
    
    return filters
```

## 字段映射扩展指南

### 添加新字段映射

如需添加新的字段映射，请编辑 `data/tavi_field_mapping.json`:

```json
{
    "field_mapping": {
        "新分类": {
            "中文字段名": "english_field_name",
            "另一个中文名": "another_field"
        }
    },
    "data_type_info": {
        "boolean_fields": ["english_field_name"],
        "numeric_fields": ["another_field"]
    },
    "units": {
        "another_field": "单位"
    }
}
```

### 支持的数据类型

- **boolean_fields**: 布尔值字段（是/否）
- **numeric_fields**: 数值字段（支持范围查询）
- **categorical_fields**: 分类字段（下拉选择）

## 使用示例

### 示例1: 基本查询
```
输入: "查找年龄大于70岁的男性患者"
解析: age_min=70, gender=["Male"]
展示: [年龄: ≥70岁] [性别: 男性]
```

### 示例2: 复杂查询
```
输入: "查找有高血压和糖尿病的患者，LVEF低于50%"
解析: hypertension=true, diabetes_mellitus=true, lvef_max=50
展示: [高血压: 是] [糖尿病: 是] [LVEF: ≤50%]
```

### 示例3: 术后评价
```
输入: "查找术后30天内死亡的病例"
解析: mortality_30d=true
展示: [30天全因死亡: 是]
```

## 配置管理

### 启用/禁用知识库

```javascript
// 启用知识库
INTELLIGENT_FILTER_CONFIG.useKnowledgeBase = true;

// 禁用知识库（降级到基础模式）
INTELLIGENT_FILTER_CONFIG.useKnowledgeBase = false;
```

### 自定义知识库路径

```javascript
INTELLIGENT_FILTER_CONFIG.knowledgeBasePath = './custom/path/to/mapping.json';
```

## 故障排除

### 常见问题

1. **知识库加载失败**
   - 检查文件路径是否正确
   - 确认JSON格式是否有效
   - 查看浏览器控制台错误信息

2. **字段映射不准确**
   - 验证知识库中是否包含相关字段
   - 检查中英文映射是否正确
   - 确认数据类型配置是否匹配

3. **UI控件未更新**
   - 确认HTML中的输入框ID与映射表一致
   - 检查JavaScript控制台是否有错误
   - 验证applyFiltersToUI函数是否正常执行

### 调试模式

开启浏览器开发者工具，查看控制台输出：
- 知识库加载状态
- AI解析结果
- 字段映射过程
- UI控件更新情况

## 性能优化建议

1. **知识库缓存**: 知识库在页面加载时一次性加载并缓存
2. **增量更新**: 只更新变化的UI控件，避免全量重绘
3. **异步处理**: AI解析和UI更新并行进行
4. **错误降级**: 知识库加载失败时自动降级到基础模式

## 更新日志

### v2.0.0 (当前版本)
- ✅ 新增字段映射知识库支持
- ✅ 增强智能筛选准确性
- ✅ 添加可解释的筛选结果展示
- ✅ 支持通用字段动态处理
- ✅ 优化UI交互体验

### 未来规划
- 🔄 支持知识库热更新
- 🌐 多语言字段映射支持
- 🤖 AI学习用户筛选习惯
- 📱 移动端适配优化 
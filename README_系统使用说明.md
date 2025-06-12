# TAVI智能分析系统使用说明

## 系统概述

TAVI智能分析系统是一个基于Web的医疗数据分析平台，用于TAVI（经导管主动脉瓣置换术）患者数据的筛选、分析和可视化展示。

## 系统架构

- **前端**: HTML + CSS + JavaScript (Bootstrap 5 + Chart.js)
- **后端**: Python Flask + PyMySQL
- **数据库**: MySQL
- **数据**: 1300条TAVI患者记录

## 功能特性

### 📊 数据筛选
- **基线资料筛选**: 年龄、性别、BMI、房颤、NYHA分级、心梗史、PCI史、CABG史、STS评分、NT-proBNP等
- **术前影像学评估**: LVEF、跨瓣压差、有效瓣口面积、瓣环参数等
- **手术信息**: 入路方式、瓣膜类型/尺寸/品牌、术后即刻指标等
- **出院前评价**: 死亡、卒中、出血、起搏器植入等并发症
- **随访信息**: 30天/1年死亡率、心梗、卒中、心衰再住院等

### 📈 数据可视化
- **统计概览**: 总病例数、筛选病例数、瓣周漏率、死亡率
- **图表分析**: 年龄分布、NYHA分级分布、瓣膜尺寸分布、并发症发生率等
- **详细数据表**: 分页显示、病例详情查看、数据导出

### 🔄 实时交互
- **动态筛选**: 实时应用筛选条件，更新统计和图表
- **分页浏览**: 支持大数据量的分页显示
- **响应式设计**: 适配不同屏幕尺寸

## 安装和启动

### 方法一：使用启动脚本（推荐）

1. **运行启动脚本**
   ```bash
   python start_server.py
   ```
   
   启动脚本会自动：
   - 检查并安装Python依赖
   - 测试数据库连接
   - 启动Flask服务器

### 方法二：手动启动

1. **安装Python依赖**
   ```bash
   pip install -r requirements.txt
   ```

2. **启动后端服务**
   ```bash
   python app.py
   ```

3. **访问前端页面**
   - 在浏览器中打开 `index.html` 文件
   - 或者使用本地服务器访问

## 系统配置

### 数据库配置

在 `app.py` 中修改数据库连接配置：

```python
DB_CONFIG = {
    'host': '192.168.23.247',      # 数据库主机
    'user': 'root',                # 数据库用户名
    'password': 'sB4L4XfTNarkuAyD', # 数据库密码
    'database': 'tavi_data',       # 数据库名称
    'charset': 'utf8mb4'
}
```

### API端点配置

在 `app.js` 中修改API基础URL：

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## API接口说明

### 1. 获取筛选数据
- **URL**: `POST /api/data`
- **功能**: 根据筛选条件获取患者数据
- **参数**: 
  ```json
  {
    "filters": {...},
    "page": 1,
    "page_size": 20
  }
  ```

### 2. 获取统计数据
- **URL**: `POST /api/statistics`
- **功能**: 获取统计概览数据
- **参数**: 
  ```json
  {
    "filters": {...}
  }
  ```

### 3. 获取图表数据
- **URL**: `POST /api/charts`
- **功能**: 获取图表可视化数据
- **参数**: 
  ```json
  {
    "filters": {...}
  }
  ```

### 4. 健康检查
- **URL**: `GET /api/health`
- **功能**: 检查API服务状态

## 筛选条件字段映射

### 基线资料
- `age_min/age_max`: 年龄范围
- `gender`: 性别 ['Male', 'Female']
- `bmi_min/bmi_max`: BMI范围
- `atrial_fibrillation`: 房颤 (true/false)
- `nyha_classification`: NYHA分级 ['I', 'II', 'III']
- `mi_history`: 心梗史 (true/false)
- `pci_history`: PCI史 (true/false)
- `cabg_history`: CABG史 (true/false)

### 术前影像学评估
- `lvef_min/lvef_max`: LVEF范围
- `aortic_valve_peak_pg_min/max`: 最大跨瓣压差范围
- `aortic_valve_mean_pg_min/max`: 平均跨瓣压差范围
- `aortic_valve_eoa_min/max`: 有效瓣口面积范围

### 手术信息
- `transfemoral_access`: 经股动脉入路 (true/false)
- `transapical_access`: 经心尖入路 (true/false)
- `thv_size`: 瓣膜尺寸 [23, 26, 29]
- `thv_type`: 瓣膜类型
- `thv_brand`: 瓣膜品牌

### 随访信息
- `mortality_30d`: 30天死亡 (true/false)
- `mortality_1y`: 1年死亡 (true/false)

## 数据库表结构

系统使用的主表 `tavi_patients` 包含以下主要字段：

- **基线资料**: age, sex, bmi, nyha_classification, atrial_fibrillation等
- **术前影像**: lvef, aortic_valve_peak_pg, aortic_valve_mean_pg等
- **手术信息**: thv_size, thv_type, thv_brand, immediate_pvl_occurred等
- **出院前评价**: death_before_discharge, stroke_before_discharge等
- **随访信息**: mortality_30d, mortality_1y, pvl_detected_last_followup等

详细的表结构请参考 `create_tavi_database.sql` 文件。

## 故障排除

### 1. 数据库连接失败
- 检查数据库服务是否运行
- 验证数据库配置信息
- 确认网络连接正常

### 2. 前端无法连接后端
- 确认Flask服务器已启动
- 检查API_BASE_URL配置
- 查看浏览器控制台错误信息

### 3. 数据显示异常
- 检查数据库中是否有数据
- 验证字段映射是否正确
- 查看后端日志错误信息

### 4. 依赖安装失败
```bash
# 升级pip
python -m pip install --upgrade pip

# 手动安装依赖
pip install Flask==2.3.3
pip install Flask-CORS==4.0.0
pip install PyMySQL==1.1.0
pip install cryptography==41.0.7
```

## 开发说明

### 添加新的筛选条件

1. **前端**: 在 `index.html` 中添加筛选控件
2. **前端**: 在 `app.js` 的 `collectFilterValues()` 函数中添加字段收集逻辑
3. **后端**: 在 `app.py` 的 `build_where_clause()` 函数中添加SQL条件构建逻辑

### 添加新的图表

1. **前端**: 在 `index.html` 中添加图表容器
2. **前端**: 在 `app.js` 中添加图表创建和更新逻辑
3. **后端**: 在 `app.py` 的 `get_chart_data()` 函数中添加数据查询逻辑

## 技术支持

如有问题，请检查：
1. 系统日志文件
2. 浏览器开发者工具
3. 数据库连接状态
4. 网络连接情况

---

**版本**: 1.0.0  
**更新日期**: 2024年12月 
# TAVI数据库导入使用说明

## 概述
本文档说明如何使用提供的SQL脚本和Python脚本将TAVI数据导入到MySQL数据库中。

## 文件说明

### 1. create_tavi_database.sql
- **用途**: 创建TAVI数据库和表结构
- **包含内容**:
  - 数据库创建语句
  - 完整的表结构定义（包含所有JSON schema中的字段）
  - 索引定义
  - 视图定义
  - 示例数据插入语句

### 2. import_tavi_data.py
- **用途**: Python数据导入脚本
- **功能**:
  - 从JSON文件读取TAVI数据
  - 将数据映射到数据库表结构
  - 批量导入数据到MySQL数据库
  - 错误处理和日志记录

## 使用步骤

### 第一步：准备环境

1. **安装MySQL数据库**
   - 确保MySQL服务正在运行
   - 记录数据库连接信息（主机、用户名、密码）

2. **安装Python依赖**
   ```bash
   pip install mysql-connector-python
   ```

### 第二步：创建数据库

1. **执行SQL脚本**
   ```bash
   mysql -u root -p < create_tavi_database.sql
   ```
   
   或者在MySQL命令行中执行：
   ```sql
   SOURCE create_tavi_database.sql;
   ```

2. **验证数据库创建**
   ```sql
   USE tavi_data;
   SHOW TABLES;
   DESCRIBE tavi_patients;
   ```

### 第三步：准备JSON数据

1. **JSON数据格式要求**
   
   数据应该按照以下结构组织：
   
   **选项1：数组格式**
   ```json
   [
     {
       "patient_id": "TAVI001",
       "baseline_characteristics": {
         "age": 75,
         "sex": "Male",
         "bmi": 24.5,
         "diabetes_mellitus": true,
         ...
       },
       "preprocedural_imaging": {
         "lvef": 55.0,
         "aortic_valve_mean_pg": 45.2,
         ...
       },
       "procedural_details": {
         "thv_type": "Self-expandable",
         "thv_brand": "CoreValve",
         ...
       },
       "predischarge_evaluation": {
         ...
       },
       "followup_characteristics": {
         ...
       }
     }
   ]
   ```
   
   **选项2：对象格式**
   ```json
   {
     "patients": {
       "TAVI001": {
         "baseline_characteristics": {...},
         "preprocedural_imaging": {...},
         ...
       },
       "TAVI002": {
         ...
       }
     }
   }
   ```

### 第四步：配置导入脚本

1. **修改数据库连接配置**
   
   编辑 `import_tavi_data.py` 文件中的 `DB_CONFIG` 部分：
   ```python
   DB_CONFIG = {
       'host': 'localhost',        # 数据库服务器地址
       'user': 'root',             # 数据库用户名
       'password': 'your_password', # 数据库密码
       'database': 'tavi_data'     # 数据库名称
   }
   ```

2. **修改JSON文件路径**
   ```python
   json_file_path = 'your_data_file.json'  # 替换为实际的JSON文件路径
   ```

### 第五步：执行数据导入

1. **运行导入脚本**
   ```bash
   python import_tavi_data.py
   ```

2. **查看导入结果**
   - 检查控制台输出
   - 查看生成的日志文件 `tavi_import.log`
   - 在数据库中验证数据：
     ```sql
     SELECT COUNT(*) FROM tavi_patients;
     SELECT * FROM tavi_patients LIMIT 5;
     SELECT * FROM statistics_summary;
     ```

## 数据库表结构说明

### 主表：tavi_patients
包含所有TAVI患者的完整数据，字段分为5个主要类别：

1. **基线资料** (baseline_characteristics)
   - 年龄、性别、BMI、合并症等

2. **术前影像学评估** (preprocedural_imaging)
   - LVEF、瓣膜参数、解剖测量等

3. **手术信息** (procedural_details)
   - 手术方式、瓣膜类型、术中参数等

4. **出院前评价** (predischarge_evaluation)
   - 并发症、瓣膜功能等

5. **随访信息** (followup_characteristics)
   - 随访结果、长期预后等

### 视图
- `important_data_view`: 重要数据筛选视图
- `statistics_summary`: 统计汇总视图

## 故障排除

### 常见错误及解决方案

1. **数据库连接失败**
   - 检查MySQL服务是否运行
   - 验证连接参数（主机、用户名、密码）
   - 确认用户有足够权限

2. **JSON解析错误**
   - 验证JSON文件格式是否正确
   - 检查文件编码（应为UTF-8）
   - 确认文件路径正确

3. **数据类型错误**
   - 检查JSON中的数据类型是否与数据库字段类型匹配
   - 确认枚举值是否在允许范围内

4. **重复数据**
   - 脚本使用 `ON DUPLICATE KEY UPDATE` 处理重复数据
   - 相同 `patient_id` 的数据会被更新而不是插入

### 日志文件
- 导入过程中的所有操作都会记录在 `tavi_import.log` 文件中
- 包含成功/失败的详细信息
- 出现问题时可查看此文件进行诊断

## 性能优化建议

1. **大数据量导入**
   - 考虑分批导入
   - 在导入前暂时禁用索引
   - 使用事务批量提交

2. **索引优化**
   - 根据查询需求调整索引
   - 定期维护数据库统计信息

## 安全注意事项

1. **数据库权限**
   - 为导入脚本创建专用数据库用户
   - 限制权限为必要的最小权限

2. **数据备份**
   - 导入前备份现有数据
   - 定期备份导入后的数据

3. **敏感信息**
   - 不要在脚本中硬编码密码
   - 考虑使用环境变量或配置文件

## 联系支持

如遇到问题，请检查：
1. 日志文件 `tavi_import.log`
2. 数据库连接和权限
3. JSON数据格式
4. 字段映射是否正确 
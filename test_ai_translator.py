# test_ai_translator.py

import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from sql_metadata.parser import Parser

# --- 1. 从app.py中“借用”的核心代码 (已修正) ---

# 加载配置
load_dotenv()

# 初始化DeepSeek客户端
deepseek_client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1"
)

def get_db_schema_for_prompt():
    """数据库说明书，与app.py中的保持一致"""
    schema_description = """
表名: tavi_patients

字段名 (数据类型) -- 中文描述
---
age (int) -- 年龄(岁)
sex (enum: 'Male', 'Female') -- 性别
bmi (decimal) -- 体重指数(kg/m²)
lvef (decimal) -- 左心室射血分数(%)
diabetes_mellitus (tinyint) -- 糖尿病 (1=是, 0=否)
hypertension (tinyint) -- 高血压 (1=是, 0=否)
nyha_classification (enum: 'I', 'II', 'III') -- 纽约心脏病协会分级
thv_type (enum: 'Self-expandable', 'Balloon-expandable') -- 瓣膜类型, 自膨胀式或球囊扩张式
"""
    return schema_description.strip()

DB_SCHEMA_PROMPT = get_db_schema_for_prompt()



# 这是修正后的、能正确工作的函数

def translate_sql_conditions_to_filters(sql_string):
    """
    SQL到filters的翻译函数 (最终健壮版)
    - 使用库推荐的 parser.where_conditions 属性，这对于简单和复杂的SQL都有效。
    """
    filters = {}
    try:
        if 'where' not in sql_string.lower():
            return filters
            
        parser = Parser(sql_string)

        # 【核心修正】: 不再使用 parser.where_clause，而是用 parser.where_conditions
        # 这个属性更稳定，它是一个字典，我们从中提取条件列表
        if not hasattr(parser, 'where_conditions') or not parser.where_conditions:
            return filters 

        # 从字典中获取条件列表，我们的Prompt引导AI只用AND，所以我们主要关心'and'键
        # 如果 'and' 不存在，就取 'or'，如果都没有，就取空列表
        conditions_list = parser.where_conditions.get('and', parser.where_conditions.get('or', []))
        
        # 遍历所有解析出的条件
        for condition_parts in conditions_list:
            if len(condition_parts) != 3:
                continue
            
            field, op, value = condition_parts
            
            field = field.strip()
            op = op.lower().strip()
            
            # value可能是元组(来自IN)或字符串，需要分别处理
            if isinstance(value, (list, tuple)):
                # 如果是元组，例如 ('II', 'III')，直接清理里面的每个元素
                 processed_value = [str(v).strip().strip("'") for v in value]
            else:
                # 如果是字符串，例如 'Female' 或 '1'，清理它自己
                 processed_value = value.strip().strip("'").strip('"')

            # --- 开始翻译规则 ---
            if op == '>' or op == '>=':
                filters[f"{field}_min"] = float(processed_value)
            elif op == '<' or op == '<=':
                filters[f"{field}_max"] = float(processed_value)
            elif op == '=':
                target_field = 'gender' if field == 'sex' else field
                
                final_value = (processed_value == '1') if processed_value in ['1', '0'] else processed_value

                if target_field in filters:
                    if not isinstance(filters[target_field], list):
                        filters[target_field] = [filters[target_field]]
                    filters[target_field].append(final_value)
                else:
                    if field in ['sex', 'nyha_classification', 'thv_type']:
                         filters[target_field] = [final_value]
                    else:
                         filters[target_field] = final_value

            elif op == 'in':
                # .where_conditions 已经将 IN 的内容解析为元组，我们直接使用
                filters[field] = processed_value

        return filters

    except Exception as e:
        import traceback
        print(f"DEBUG: 解析SQL时出错: {e}")
        traceback.print_exc() 
        return {"error": "解析SQL失败", "sql": sql_string, "details": str(e)}

# --- 2. 核心测试函数 (已修正) ---

def test_single_query(user_query):
    """
    对单个用户查询进行完整的 Text-to-SQL-to-Filter 测试 (结构优化版)
    """
    print("="*80)
    print(f"测试语句: '{user_query}'")
    print("-"*80)

    # --- 步骤1: AI生成SQL (使用优化后的Prompt) ---
    prompt_for_sql = f"""
你是一个MySQL专家。请根据以下数据库表结构和用户请求，生成一条精确、简单的SELECT查询语句的WHERE子句部分。

规则:
1.  你的回答必须只包含WHERE子句之后的内容，不要包含'WHERE'关键字本身。
2.  对于同一个字段的多个值的筛选 (例如 'II级或III级')，你必须使用 `IN` 语法。例如: `nyha_classification IN ('II', 'III')`。
3.  对于布尔类型的字段(diabetes_mellitus, hypertension)，使用 1 代表 '是/有'，0 代表 '否/没有'。
4.  尽量只使用AND连接不同的字段条件。

【数据库表结构】
{DB_SCHEMA_PROMPT}

【用户请求】
{user_query}

【WHERE子句之后的内容】
"""
    
    generated_sql = ""
    try:
        response = deepseek_client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role": "user", "content": prompt_for_sql}],
            temperature=0.0, # 使用低温确保输出的稳定性
        )
        where_part = response.choices[0].message.content.strip().rstrip(';')
        generated_sql = f"SELECT * FROM tavi_patients WHERE {where_part}"
        
        print(f"✅ [第1步: SQL生成成功]")
        print(f"  - AI生成的SQL: {generated_sql}")

    except Exception as e:
        print(f"❌ [第1步: SQL生成失败] 调用API时出错: {e}")
        return # 如果SQL生成失败，则终止后续步骤

    # --- 步骤2: Python将SQL翻译成filters JSON (职责分离) ---
    translated_filters = translate_sql_conditions_to_filters(generated_sql)

    # 打印结果的逻辑统一放在这里
    if 'error' in translated_filters:
        print(f"❌ [第2步: JSON翻译失败]")
        print(f"  - 错误信息: {translated_filters['error']}")
        print(f"  - 失败的SQL: {translated_filters.get('sql', 'N/A')}")
        print(f"  - 详情: {translated_filters.get('details', 'N/A')}")
    else:
        print(f"✅ [第2步: JSON翻译成功]")
        print(f"  - 翻译后的JSON: {json.dumps(translated_filters, ensure_ascii=False, indent=2)}")
    
    print("="*80 + "\n")


# --- 3. 定义我们的测试用例 ---

if __name__ == "__main__":
    test_queries = [
        "找出年龄在70到80岁之间，没有糖尿病的男性患者", # 之前的失败用例
        "找出所有女性患者",
        "年龄大于85岁的病人有哪些",
        "查找LVEF小于40%并且有高血压的病例",
        "筛选出所有自膨胀式瓣膜的病例",
        "NYHA分级是II级或者III级的病人", # 【关键测试用例】现在应该能正确处理
    ]

    for query in test_queries:
        test_single_query(query)
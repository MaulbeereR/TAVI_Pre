import json
import pandas as pd
from collections import Counter
import re
import os

def extract_json_from_js_robust(file_path):
    """
    更robust的JavaScript文件解析方法
    """
    print(f"正在读取JavaScript文件: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"文件大小: {len(content)} 字符")
    
    # 查找数组的开始
    start_idx = content.find('[')
    if start_idx == -1:
        raise ValueError("找不到数组开始标记")
    
    print(f"找到数组开始位置: {start_idx}")
    
    # 尝试分块处理，找到完整的对象
    data = []
    current_pos = start_idx + 1  # 跳过开始的 [
    
    while current_pos < len(content):
        # 跳过空白字符
        while current_pos < len(content) and content[current_pos].isspace():
            current_pos += 1
        
        if current_pos >= len(content):
            break
            
        # 如果遇到 ]，说明数组结束
        if content[current_pos] == ']':
            break
            
        # 如果遇到 ,，跳过
        if content[current_pos] == ',':
            current_pos += 1
            continue
            
        # 查找下一个完整的对象
        if content[current_pos] == '{':
            obj_start = current_pos
            obj_end = find_matching_brace(content, obj_start)
            
            if obj_end == -1:
                print(f"在位置 {obj_start} 找不到匹配的大括号")
                break
                
            # 提取对象字符串
            obj_str = content[obj_start:obj_end + 1]
            
            try:
                # 尝试解析这个对象
                obj_json = fix_single_object_to_json(obj_str)
                obj_data = json.loads(obj_json)
                data.append(obj_data)
                
                if len(data) % 10 == 0:
                    print(f"已解析 {len(data)} 个对象...")
                    
            except Exception as e:
                print(f"解析对象失败 (位置 {obj_start}): {e}")
                # 保存有问题的对象用于调试
                with open(f'debug_object_{len(data)}.txt', 'w', encoding='utf-8') as f:
                    f.write(obj_str[:1000])  # 只保存前1000字符
                
            current_pos = obj_end + 1
        else:
            current_pos += 1
    
    print(f"成功解析 {len(data)} 个对象")
    return data

def find_matching_brace(content, start_pos):
    """
    找到匹配的大括号
    """
    if content[start_pos] != '{':
        return -1
        
    brace_count = 0
    in_string = False
    escape_next = False
    
    for i in range(start_pos, len(content)):
        char = content[i]
        
        if escape_next:
            escape_next = False
            continue
            
        if char == '\\':
            escape_next = True
            continue
            
        if char == '"' and not escape_next:
            in_string = not in_string
            continue
            
        if not in_string:
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    return i
                    
    return -1

def fix_single_object_to_json(obj_str):
    """
    修复单个对象的JavaScript格式到JSON格式
    """
    # 移除注释
    obj_str = re.sub(r'//.*?\n', '\n', obj_str)
    obj_str = re.sub(r'/\*.*?\*/', '', obj_str, flags=re.DOTALL)
    
    # 处理JavaScript特殊值
    obj_str = obj_str.replace('null', 'null')
    obj_str = obj_str.replace('true', 'true')
    obj_str = obj_str.replace('false', 'false')
    
    # 处理键名 - 逐行处理
    lines = obj_str.split('\n')
    fixed_lines = []
    
    for line in lines:
        if ':' in line and not line.strip().startswith('"'):
            # 查找键名模式，但要小心字符串值
            # 只处理行首的键名
            match = re.match(r'(\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', line)
            if match:
                indent = match.group(1)
                key = match.group(2)
                rest = line[match.end():]
                line = f'{indent}"{key}":{rest}'
        
        # 移除尾随逗号（在 } 或 ] 前面的逗号）
        line = re.sub(r',(\s*[}\]])$', r'\1', line)
        fixed_lines.append(line)
    
    result = '\n'.join(fixed_lines)
    
    # 处理路径中的反斜杠 - 更精确的处理
    def fix_backslash(match):
        full_match = match.group(0)
        # 只处理路径字符串中的反斜杠
        if ':\\' in full_match or full_match.count('\\') > 1:
            return full_match.replace('\\', '\\\\')
        return full_match
    
    result = re.sub(r'"[^"]*\\[^"]*"', fix_backslash, result)
    
    return result

def load_and_analyze_data(file_path):
    """
    加载数据并分析指定字段的有效数据统计
    """
    # 确保文件路径正确
    if not os.path.exists(file_path):
        print(f"文件不存在: {file_path}")
        print(f"当前工作目录: {os.getcwd()}")
        print("当前目录下的文件:")
        for f in os.listdir('.'):
            if f.endswith('.js') or f.endswith('.json'):
                print(f"  - {f}")
        return None
    
    # 读取数据
    if file_path.endswith('.js'):
        print("检测到JavaScript文件，正在提取数据...")
        try:
            data = extract_json_from_js_robust(file_path)
            print(f"成功提取数据，共 {len(data)} 条记录")
        except Exception as e:
            print(f"提取数据失败: {e}")
            return None
    else:
        print("读取JSON文件...")
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    
    # 定义要分析的字段
    target_fields = [
        "Baseline_Characteristics",
        "TAVI_R_Preprocedural_Imaging_Assessment", 
        "TAVI_R_Procedural_Details",
        "TAVI_R_Evaluation_PostProcedure_Before_Discharge",
        "TAVI_R_Follow_up_Characteristics"
    ]
    
    # 定义无效值（更全面的无效值列表）
    invalid_values = {
        None, "null", "NULL", "Null", 
        "N/A", "n/a", "NA", "na",
        "", " ", "  ",  # 空字符串和空格
        "undefined", "NaN", "nan",
        "None", "NONE", "none",
        "Not available", "not available",
        "Unknown", "unknown", "UNKNOWN",
        "-", "--", "---",
        "TBD", "tbd", "To be determined"
    }
    
    # 统计每个字段的有效数据
    field_stats = {}
    
    for field_name in target_fields:
        print(f"\n=== 分析字段: {field_name} ===")
        
        # 收集该字段下所有列的有效数据计数
        column_counts = Counter()
        total_records = 0
        
        for record in data:
            if field_name in record and record[field_name] is not None:
                total_records += 1
                field_data = record[field_name]
                
                if isinstance(field_data, dict):
                    for column_name, value in field_data.items():
                        # 检查值是否有效
                        if is_valid_value(value, invalid_values):
                            column_counts[column_name] += 1
        
        # 获取前20个有效数据最多的列
        top_20_columns = column_counts.most_common(20)
        
        field_stats[field_name] = {
            'columns': top_20_columns,
            'total_records': total_records,
            'total_columns': len(column_counts)
        }
        
        # 打印结果
        print(f"总共找到 {len(column_counts)} 个不同的列")
        print(f"总记录数: {total_records}")
        print("前20个有效数据最多的列:")
        print("-" * 70)
        print(f"{'排名':<4} {'列名':<50} {'有效数据数量':<10} {'覆盖率':<8}")
        print("-" * 70)
        
        for i, (column_name, count) in enumerate(top_20_columns, 1):
            coverage = f"{count/total_records*100:.1f}%" if total_records > 0 else "0%"
            print(f"{i:<4} {column_name:<50} {count:<10} {coverage:<8}")
    
    return field_stats

def is_valid_value(value, invalid_values):
    """
    判断值是否有效
    """
    # 检查是否在无效值列表中
    if value in invalid_values:
        return False
    
    # 字符串类型的额外检查
    if isinstance(value, str):
        stripped = value.strip()
        if stripped == "" or stripped in invalid_values:
            return False
        # 检查是否只包含特殊字符
        if re.match(r'^[^\w\s]*$', stripped) and stripped not in ['True', 'False']:
            return False
    
    # 布尔值总是有效的
    if isinstance(value, bool):
        return True
    
    # 数字类型（包含0，因为0可能是有效的测量值）
    if isinstance(value, (int, float)):
        return True
    
    # 列表和字典如果非空则有效
    if isinstance(value, (list, dict)):
        return len(value) > 0
    
    return True

def export_to_excel(field_stats, output_file="tavi_data_statistics.xlsx"):
    """
    将统计结果导出到Excel文件
    """
    with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
        # 创建汇总sheet
        summary_data = []
        for field_name, stats in field_stats.items():
            summary_data.append({
                '字段名': field_name,
                '总记录数': stats['total_records'],
                '总列数': stats['total_columns'],
                '最高覆盖率': f"{stats['columns'][0][1]/stats['total_records']*100:.1f}%" if stats['columns'] else "0%"
            })
        
        summary_df = pd.DataFrame(summary_data)
        summary_df.to_excel(writer, sheet_name='汇总', index=False)
        
        # 为每个字段创建详细sheet
        for field_name, stats in field_stats.items():
            columns_data = stats['columns']
            total_records = stats['total_records']
            
            # 创建DataFrame
            df_data = []
            for i, (column_name, count) in enumerate(columns_data, 1):
                coverage = f"{count/total_records*100:.1f}%" if total_records > 0 else "0%"
                df_data.append({
                    '排名': i,
                    '列名': column_name,
                    '有效数据数量': count,
                    '覆盖率': coverage
                })
            
            df = pd.DataFrame(df_data)
            
            # 写入Excel，使用字段名作为sheet名（截取部分避免名称过长）
            sheet_name = field_name.replace("TAVI_R_", "").replace("_", " ")[:31]
            df.to_excel(writer, sheet_name=sheet_name, index=False)
    
    print(f"\n统计结果已导出到: {output_file}")

def analyze_data_quality(field_stats):
    """
    分析数据质量
    """
    print("\n" + "="*80)
    print("数据质量分析汇总")
    print("="*80)
    
    for field_name, stats in field_stats.items():
        columns_data = stats['columns']
        total_records = stats['total_records']
        
        if columns_data:
            max_count = columns_data[0][1]  # 最高的有效数据数量
            min_count = columns_data[-1][1] if len(columns_data) >= 20 else columns_data[-1][1]
            avg_count = sum(count for _, count in columns_data) / len(columns_data)
            max_coverage = max_count / total_records * 100 if total_records > 0 else 0
            
            print(f"\n{field_name}:")
            print(f"  - 总记录数: {total_records}")
            print(f"  - 最高有效数据数量: {max_count} (覆盖率: {max_coverage:.1f}%)")
            print(f"  - 最低有效数据数量(前20中): {min_count}")
            print(f"  - 平均有效数据数量: {avg_count:.2f}")
            print(f"  - 有数据的列总数: {stats['total_columns']}")

def main():
    """
    主函数
    """
    # 文件路径 - 使用相对路径，假设在同一文件夹下
    file_path = "520_final_cleaned.js"
    
    print(f"当前工作目录: {os.getcwd()}")
    print(f"尝试读取文件: {file_path}")
    
    try:
        # 分析数据
        field_stats = load_and_analyze_data(file_path)
        
        if field_stats is None:
            return
        
        # 导出到Excel
        export_to_excel(field_stats)
        
        # 数据质量分析
        analyze_data_quality(field_stats)
        
    except FileNotFoundError:
        print(f"错误: 找不到文件 {file_path}")
        print("请确保文件在当前目录下，或者修改file_path变量")
        print("当前目录下的.js文件:")
        for f in os.listdir('.'):
            if f.endswith('.js'):
                print(f"  - {f}")
    except Exception as e:
        print(f"错误: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
import json
from pathlib import Path

def count_fields_in_schema(schema_file_path):
    """
    统计TAVI变量模式文件中每个类别下的字段数量
    
    Args:
        schema_file_path (str): JSON模式文件的路径
    
    Returns:
        dict: 包含每个类别及其字段数量的字典
    """
    try:
        # 读取JSON文件
        with open(schema_file_path, 'r', encoding='utf-8') as file:
            schema = json.load(file)
        
        # 统计每个类别的字段数量
        field_counts = {}
        total_fields = 0
        
        print("TAVI变量模式字段统计")
        print("=" * 50)
        
        for category_key, category_data in schema['categories'].items():
            field_count = len(category_data['fields'])
            field_counts[category_key] = {
                'name_cn': category_data['name'],
                'name_en': category_data['name_en'],
                'field_count': field_count
            }
            total_fields += field_count
            
            print(f"{category_data['name']} ({category_data['name_en']}): {field_count} 个字段")
        
        print("=" * 50)
        print(f"总计: {total_fields} 个字段")
        print(f"总计: {len(schema['categories'])} 个类别")
        
        return field_counts, total_fields
        
    except FileNotFoundError:
        print(f"错误: 找不到文件 {schema_file_path}")
        return None, 0
    except json.JSONDecodeError:
        print(f"错误: JSON文件格式不正确 {schema_file_path}")
        return None, 0
    except Exception as e:
        print(f"错误: {str(e)}")
        return None, 0

def generate_detailed_report(schema_file_path, output_file=None):
    """
    生成详细的字段统计报告
    
    Args:
        schema_file_path (str): JSON模式文件的路径
        output_file (str, optional): 输出报告文件路径
    """
    try:
        with open(schema_file_path, 'r', encoding='utf-8') as file:
            schema = json.load(file)
        
        report_lines = []
        report_lines.append("TAVI变量模式详细字段统计报告")
        report_lines.append("=" * 60)
        report_lines.append(f"模式版本: {schema.get('schema_version', 'N/A')}")
        report_lines.append(f"描述: {schema.get('description', 'N/A')}")
        report_lines.append("")
        
        total_fields = 0
        
        for category_key, category_data in schema['categories'].items():
            fields = category_data['fields']
            field_count = len(fields)
            total_fields += field_count
            
            report_lines.append(f"类别: {category_data['name']} ({category_data['name_en']})")
            report_lines.append(f"字段数量: {field_count}")
            report_lines.append("-" * 40)
            
            # 按数据类型分组统计
            type_counts = {}
            for field_key, field_data in fields.items():
                field_type = field_data.get('type', 'unknown')
                type_counts[field_type] = type_counts.get(field_type, 0) + 1
            
            report_lines.append("按数据类型统计:")
            for data_type, count in sorted(type_counts.items()):
                report_lines.append(f"  - {data_type}: {count} 个")
            
            report_lines.append("")
        
        report_lines.append("=" * 60)
        report_lines.append(f"总计: {total_fields} 个字段")
        report_lines.append(f"总计: {len(schema['categories'])} 个类别")
        
        # 全局数据类型统计
        global_type_counts = {}
        for category_data in schema['categories'].values():
            for field_data in category_data['fields'].values():
                field_type = field_data.get('type', 'unknown')
                global_type_counts[field_type] = global_type_counts.get(field_type, 0) + 1
        
        report_lines.append("")
        report_lines.append("全局数据类型统计:")
        for data_type, count in sorted(global_type_counts.items()):
            report_lines.append(f"  - {data_type}: {count} 个")
        
        # 输出报告
        report_content = "\n".join(report_lines)
        print(report_content)
        
        # 如果指定了输出文件，保存报告
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(report_content)
            print(f"\n详细报告已保存到: {output_file}")
        
        return report_content
        
    except Exception as e:
        print(f"生成报告时出错: {str(e)}")
        return None

def main():
    """主函数"""
    # 设置文件路径
    schema_file = "TAVI_variables_schema.json"
    
    # 检查文件是否存在
    if not Path(schema_file).exists():
        print(f"错误: 找不到文件 {schema_file}")
        print("请确保文件在当前目录下")
        return
    
    print("开始统计TAVI变量模式字段...")
    print()
    
    # 基本统计
    field_counts, total_fields = count_fields_in_schema(schema_file)
    
    if field_counts:
        print("\n" + "=" * 50)
        print("详细统计信息:")
        
        # 生成详细报告
        report_file = "TAVI_fields_report.txt"
        generate_detailed_report(schema_file, report_file)
        
        # 返回统计结果供其他程序使用
        return field_counts, total_fields
    
    return None, 0

if __name__ == "__main__":
    main() 
# debug_parser.py

import json
from sql_metadata.parser import Parser

# =================================================================================
#  重要：从 app.py 中复制以下两个部分到这里，确保测试环境与实际环境完全一致
# =================================================================================
COLUMN_TO_FILTER_KEY_MAP = {
    # 'sql_column_name': 'filter_key_or_prefix'
    'age': 'age',
    'sex': 'gender',
    'bmi': 'bmi',
    'surface_area': 'surface_area',
    'diabetes_mellitus': 'diabetes_mellitus',
    'hypertension': 'hypertension',
    'hyperlipidemia': 'hyperlipidemia',
    'coronary_artery_disease': 'coronary_artery_disease',
    'copd': 'copd',
    'dialysis': 'dialysis',
    'atrial_fibrillation': 'atrial_fibrillation',
    'nyha_classification': 'nyha_classification',
    'acei_arb': 'acei_arb',
    'beta_blocker': 'beta_blocker',
    'calcium_blocker': 'calcium_blocker',
    'diuretic': 'diuretic',
    'aspirin': 'aspirin',
    'lvef': 'lvef',
    'aortic_valve_peak_pg': 'aortic_valve_peak_pg',
    'aortic_valve_mean_pg': 'aortic_valve_mean_pg',
    'aortic_valve_eoa': 'aortic_valve_eoa',
    'annular_area': 'annular_area',
    'annular_mean_diameter': 'annular_mean_diameter',
    'annular_max_diameter': 'annular_max_diameter',
    'annular_perimeter': 'annular_perimeter',
    'aortic_valve_flow_velocity': 'aortic_valve_flow_velocity',
    'stj_height': 'stj_height',
    'stj_diameter': 'stj_diameter',
    'sinus_diameter': 'sinus_diameter',
    'ascending_aorta_diameter': 'ascending_aorta_diameter',
    'supraannular_calcification': 'supraannular_calcification',
    'annular_calcification': 'annular_calcification',
    'lvot_diameter': 'lvot_diameter',
    'lvot_calcification': 'lvot_calcification',
    'left_coronary_height': 'left_coronary_height',
    'right_coronary_height': 'right_coronary_height',
    'annulus_to_mitral_distance': 'annulus_to_mitral_distance',
    'transfemoral_access': 'transfemoral_access',
    'transapical_access': 'transapical_access',
    'other_access': 'other_access',
    'thv_size': 'thv_size',
    'thv_type': 'thv_type',
    'thv_brand': 'thv_brand',
    'pre_dilation': 'pre_dilation',
    'post_dilation': 'post_dilation',
    'total_procedure_time': 'total_procedure_time',
    'fluoroscopy_time': 'fluoroscopy_time',
    'contrast_volume': 'contrast_volume',
    'immediate_lvef': 'immediate_lvef',
    'immediate_mean_pg': 'immediate_mean_pg',
    'mean_pg_gte_20': 'mean_pg_gte_20',
    'prosthesis_malposition': 'prosthesis_malposition',
    'annular_rupture': 'annular_rupture',
    'excessive_oversizing': 'excessive_oversizing',
    'oversizing_gte_15': 'oversizing_gte_15',
    'immediate_pvl_occurred': 'immediate_pvl_occurred',
    'immediate_pvl_severity': 'immediate_pvl_severity',
    'pvl_severity': 'pvl_severity',
    'pvl_severity_last_followup': 'pvl_severity_last_followup',
    'thv_displacement': 'thv_displacement',
    'conversion_to_savr': 'conversion_to_savr',
    'cpb_required': 'cpb_required',
    'valve_in_valve': 'valve_in_valve',
    'periprocedural_death': 'periprocedural_death',
    'mitral_regurgitation_change_proc': 'mitral_regurgitation_change_proc',
    'death_before_discharge': 'death_before_discharge',
    'stroke_before_discharge': 'stroke_before_discharge',
    'major_bleeding': 'major_bleeding',
    'aki': 'aki',
    'major_vascular_complication': 'major_vascular_complication',
    'mi_ami': 'mi_ami',
    'acs_ihd': 'acs_ihd',
    'heart_failure': 'heart_failure',
    'all_cause_cv_death': 'all_cause_cv_death',
    'pacemaker_implantation': 'pacemaker_implantation',
    'pvl_detected': 'pvl_detected',
    'max_pg': 'max_pg',
    'flow_velocity': 'flow_velocity',
    'mean_pg': 'mean_pg',
    'eoai': 'eoai',
    'mitral_regurgitation_change': 'mitral_regurgitation_change',
    'mortality_30d': 'mortality_30d',
    'mi_30d': 'mi_30d',
    'stroke_30d': 'stroke_30d',
    'hf_readmission_30d': 'hf_readmission_30d',
    'mortality_1y': 'mortality_1y',
    'mi_1y': 'mi_1y',
    'stroke_1y': 'stroke_1y',
    'hf_readmission_1y': 'hf_readmission_1y',
    'subsequent_intervention': 'subsequent_intervention',
    'mitral_regurgitation_change_followup': 'mitral_regurgitation_change_followup',
    'patient_id': 'patient_id'
}
# =================================================================================
#  全新重写的 parse_sql_to_filters 函数 (v3)
# =================================================================================
def parse_sql_to_filters(sql):
    """(v3 - 重写版) 解析SQL的WHERE子句，并将其转换为filters对象"""
    filters = {}
    if not sql:
        return filters

    try:
        # 1. 获取最底层的、完整的词法单元列表
        parser = Parser(sql)
        all_tokens = [str(token) for token in parser.tokens]

        # 2. 手动定位 WHERE 关键字的位置
        try:
            where_index = [token.upper() for token in all_tokens].index('WHERE')
        except ValueError:
            # 如果没有WHERE, 直接返回空字典
            return filters
        
        # 3. 提取 WHERE 子句之后的所有词法单元
        where_clause_tokens = all_tokens[where_index + 1:]
        
        # 4. 按 'AND' 分割条件
        conditions = []
        current_condition = []
        for token in where_clause_tokens:
            if token.upper() == 'AND':
                if current_condition:
                    conditions.append(current_condition)
                    current_condition = []
            else:
                current_condition.append(token)
        if current_condition:
            conditions.append(current_condition)

        # 5. 逐一处理每个解析出的条件
        for cond_parts in conditions:
            if not cond_parts: continue

            # 标准化 'IN' 子句: ['nyha_classification', 'IN', '(', "'II'", ',', "'III'", ')'] -> ['nyha_classification', 'IN', "('II','III')"]
            if 'IN' in [p.upper() for p in cond_parts]:
                in_index = [p.upper() for p in cond_parts].index('IN')
                col_name = cond_parts[in_index - 1]
                values_in_parentheses = "".join(cond_parts[in_index + 1:])
                cond_parts = [col_name, 'IN', values_in_parentheses]

            if len(cond_parts) != 3:
                print(f"警告: 条件 '{' '.join(cond_parts)}' 格式不标准 (预期3部分)，已跳过。")
                continue

            col_name, operator, val_str = [part.strip() for part in cond_parts]
            col_name = col_name.lower()

            filter_key = COLUMN_TO_FILTER_KEY_MAP.get(col_name)
            if not filter_key:
                print(f"警告: 无法映射SQL列 '{col_name}' 到filter key。")
                continue
            
            # 去除值的引号
            if (val_str.startswith("'") and val_str.endswith("'")) or \
               (val_str.startswith('"') and val_str.endswith('"')):
                val_str = val_str[1:-1]

            # 填充filters对象
            if operator in ('>', '>='):
                filters[f"{filter_key}_min"] = float(val_str)
            elif operator in ('<', '<='):
                filters[f"{filter_key}_max"] = float(val_str)
            elif operator == '=':
                if val_str.lower() in ('1', 'true'): filters[filter_key] = True
                elif val_str.lower() in ('0', 'false'): filters[filter_key] = False
                elif filter_key == 'gender': filters[filter_key] = [val_str.capitalize()]
                else: filters[filter_key] = val_str
            elif operator.upper() == 'IN':
                # 清理括号和空格，然后按逗号分割
                vals = [v.strip().strip("'\"") for v in val_str.strip("() \t\n\r").split(',')]
                filters[filter_key] = vals

    except Exception as e:
        print(f"致命错误: 解析SQL '{sql}' 时发生意外: {e}")
        # 在调试时，打印更详细的堆栈跟踪信息
        import traceback
        traceback.print_exc()
        return {}
    
    return filters

# =================================================================================
#  测试用例定义区域 (保持不变)
# =================================================================================
def run_tests():
    test_cases = [
        { "description": "基本年龄和性别查询", "sql": "SELECT * FROM tavi_patients WHERE age > 75 AND sex = 'Female'", "expected": {"age_min": 75.0, "gender": ["Female"]} },
        { "description": "带有布尔值的复杂查询", "sql": "SELECT * FROM tavi_patients WHERE hypertension = 1 AND diabetes_mellitus = 0 AND age <= 80", "expected": {"hypertension": True, "diabetes_mellitus": False, "age_max": 80.0} },
        { "description": "带有范围和特定值的查询", "sql": "SELECT * FROM tavi_patients WHERE lvef >= 50.5 AND thv_type = 'Self-expandable'", "expected": {"lvef_min": 50.5, "thv_type": "Self-expandable"} },
        { "description": "带有IN子句的查询 (NYHA分级)", "sql": "SELECT * FROM tavi_patients WHERE nyha_classification IN ('II', 'III')", "expected": {"nyha_classification": ["II", "III"]} },
        { "description": "混合大小写和多余空格的查询", "sql": "  SELECT * from tavi_patients   WHERE   AGE < 65   and    SEX = 'male' ", "expected": {"age_max": 65.0, "gender": ["Male"]} },
        { "description": "没有WHERE子句的查询", "sql": "SELECT * FROM tavi_patients", "expected": {} },
        { "description": "无效SQL (不含WHERE)", "sql": "SELECT age FROM something", "expected": {} }
    ]

    print("="*20 + " 开始测试SQL解析逻辑 (v3 - 核心API) " + "="*20)
    all_passed = True
    for i, test in enumerate(test_cases):
        print(f"\n--- 测试 {i+1}: {test['description']} ---")
        print(f"输入SQL: {test['sql']}")
        
        actual_output = parse_sql_to_filters(test['sql'])
        
        expected_json = json.dumps(test['expected'], sort_keys=True, indent=2)
        actual_json = json.dumps(actual_output, sort_keys=True, indent=2)
        
        print(f"预期输出: {expected_json}")
        print(f"实际输出: {actual_json}")
        
        if actual_json == expected_json:
            print("结果: \033[92m通过\033[0m")
        else:
            print("结果: \033[91m失败\033[0m")
            all_passed = False
    
    print("\n" + "="*25 + " 测试总结 " + "="*25)
    if all_passed:
        print("\033[92m所有测试用例均已通过！新的转换逻辑可靠。\033[0m")
    else:
        print("\033[91m部分测试用例失败，请检查失败项的输出和代码逻辑。\033[0m")

if __name__ == '__main__':
    run_tests()
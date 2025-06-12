#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TAVI智能分析系统后端服务
提供API接口用于前端数据筛选和展示
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import logging
from datetime import datetime
import json
from decimal import Decimal

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 数据库配置
DB_CONFIG = {
    'host': '192.168.23.247',
    'user': 'root',
    'password': 'sB4L4XfTNarkuAyD',
    'database': 'tavi_data',
    'charset': 'utf8mb4'
}

class TaviDataAPI:
    def __init__(self, db_config):
        self.db_config = db_config
        self.connection = None
    
    def connect_database(self):
        """连接数据库"""
        try:
            self.connection = pymysql.connect(**self.db_config)
            return True
        except Exception as e:
            logging.error(f"数据库连接失败: {e}")
            return False
    
    def close_connection(self):
        """关闭数据库连接"""
        if self.connection:
            self.connection.close()
    
    def decimal_to_float(self, obj):
        """将Decimal对象转换为float，用于JSON序列化"""
        if isinstance(obj, Decimal):
            return float(obj)
        return obj
    
    def process_row(self, row):
        """处理数据库行，转换数据类型"""
        if not row:
            return None
        
        processed_row = {}
        for key, value in row.items():
            if isinstance(value, Decimal):
                processed_row[key] = float(value)
            elif value is None:
                processed_row[key] = None
            else:
                processed_row[key] = value
        return processed_row
    
    def build_where_clause(self, filters):
        """根据筛选条件构建WHERE子句"""
        where_conditions = []
        params = []
        
        # 基线资料筛选
        if filters.get('age_min'):
            where_conditions.append("age >= %s")
            params.append(filters['age_min'])
        if filters.get('age_max'):
            where_conditions.append("age <= %s")
            params.append(filters['age_max'])
        
        if filters.get('gender'):
            if isinstance(filters['gender'], list):
                placeholders = ','.join(['%s'] * len(filters['gender']))
                where_conditions.append(f"sex IN ({placeholders})")
                params.extend(filters['gender'])
            else:
                where_conditions.append("sex = %s")
                params.append(filters['gender'])
        
        if filters.get('bmi_min'):
            where_conditions.append("bmi >= %s")
            params.append(filters['bmi_min'])
        if filters.get('bmi_max'):
            where_conditions.append("bmi <= %s")
            params.append(filters['bmi_max'])
        
        if filters.get('surface_area_min'):
            where_conditions.append("surface_area >= %s")
            params.append(filters['surface_area_min'])
        if filters.get('surface_area_max'):
            where_conditions.append("surface_area <= %s")
            params.append(filters['surface_area_max'])
        
        # 基线疾病史
        if filters.get('diabetes_mellitus') is not None:
            where_conditions.append("diabetes_mellitus = %s")
            params.append(filters['diabetes_mellitus'])
        
        if filters.get('hypertension') is not None:
            where_conditions.append("hypertension = %s")
            params.append(filters['hypertension'])
        
        if filters.get('hyperlipidemia') is not None:
            where_conditions.append("hyperlipidemia = %s")
            params.append(filters['hyperlipidemia'])
        
        if filters.get('coronary_artery_disease') is not None:
            where_conditions.append("coronary_artery_disease = %s")
            params.append(filters['coronary_artery_disease'])
        
        if filters.get('copd') is not None:
            where_conditions.append("copd = %s")
            params.append(filters['copd'])
        
        if filters.get('dialysis') is not None:
            where_conditions.append("dialysis = %s")
            params.append(filters['dialysis'])
        
        if filters.get('atrial_fibrillation') is not None:
            where_conditions.append("atrial_fibrillation = %s")
            params.append(filters['atrial_fibrillation'])
        
        if filters.get('nyha_classification'):
            if isinstance(filters['nyha_classification'], list):
                placeholders = ','.join(['%s'] * len(filters['nyha_classification']))
                where_conditions.append(f"nyha_classification IN ({placeholders})")
                params.extend(filters['nyha_classification'])
            else:
                where_conditions.append("nyha_classification = %s")
                params.append(filters['nyha_classification'])
        
        # 药物治疗
        if filters.get('acei_arb') is not None:
            where_conditions.append("acei_arb = %s")
            params.append(filters['acei_arb'])
        
        if filters.get('beta_blocker') is not None:
            where_conditions.append("beta_blocker = %s")
            params.append(filters['beta_blocker'])
        
        if filters.get('calcium_blocker') is not None:
            where_conditions.append("calcium_blocker = %s")
            params.append(filters['calcium_blocker'])
        
        if filters.get('diuretic') is not None:
            where_conditions.append("diuretic = %s")
            params.append(filters['diuretic'])
        
        if filters.get('aspirin') is not None:
            where_conditions.append("aspirin = %s")
            params.append(filters['aspirin'])
        
        if filters.get('anticoagulant') is not None:
            where_conditions.append("anticoagulant = %s")
            params.append(filters['anticoagulant'])
        
        if filters.get('statins') is not None:
            where_conditions.append("statins = %s")
            params.append(filters['statins'])
        
        if filters.get('sglt2_inhibitors') is not None:
            where_conditions.append("sglt2_inhibitors = %s")
            params.append(filters['sglt2_inhibitors'])
        
        # 既往手术史
        if filters.get('mi_history') is not None:
            where_conditions.append("mi_history = %s")
            params.append(filters['mi_history'])
        
        if filters.get('pci_history') is not None:
            where_conditions.append("pci_history = %s")
            params.append(filters['pci_history'])
        
        if filters.get('cabg_history') is not None:
            where_conditions.append("cabg_history = %s")
            params.append(filters['cabg_history'])
        
        # 评分系统
        if filters.get('sts_score_min'):
            where_conditions.append("sts_score >= %s")
            params.append(filters['sts_score_min'])
        if filters.get('sts_score_max'):
            where_conditions.append("sts_score <= %s")
            params.append(filters['sts_score_max'])
        
        if filters.get('nt_probnp_min'):
            where_conditions.append("nt_probnp >= %s")
            params.append(filters['nt_probnp_min'])
        if filters.get('nt_probnp_max'):
            where_conditions.append("nt_probnp <= %s")
            params.append(filters['nt_probnp_max'])
        
        # 术前影像学评估筛选
        if filters.get('lvef_min'):
            where_conditions.append("lvef >= %s")
            params.append(filters['lvef_min'])
        if filters.get('lvef_max'):
            where_conditions.append("lvef <= %s")
            params.append(filters['lvef_max'])
        
        if filters.get('aortic_valve_peak_pg_min'):
            where_conditions.append("aortic_valve_peak_pg >= %s")
            params.append(filters['aortic_valve_peak_pg_min'])
        if filters.get('aortic_valve_peak_pg_max'):
            where_conditions.append("aortic_valve_peak_pg <= %s")
            params.append(filters['aortic_valve_peak_pg_max'])
        
        if filters.get('aortic_valve_mean_pg_min'):
            where_conditions.append("aortic_valve_mean_pg >= %s")
            params.append(filters['aortic_valve_mean_pg_min'])
        if filters.get('aortic_valve_mean_pg_max'):
            where_conditions.append("aortic_valve_mean_pg <= %s")
            params.append(filters['aortic_valve_mean_pg_max'])
        
        if filters.get('aortic_valve_eoa_min'):
            where_conditions.append("aortic_valve_eoa >= %s")
            params.append(filters['aortic_valve_eoa_min'])
        if filters.get('aortic_valve_eoa_max'):
            where_conditions.append("aortic_valve_eoa <= %s")
            params.append(filters['aortic_valve_eoa_max'])
        
        if filters.get('aortic_valve_eoai_min'):
            where_conditions.append("aortic_valve_eoai >= %s")
            params.append(filters['aortic_valve_eoai_min'])
        if filters.get('aortic_valve_eoai_max'):
            where_conditions.append("aortic_valve_eoai <= %s")
            params.append(filters['aortic_valve_eoai_max'])
        
        if filters.get('moderate_severe_ar') is not None:
            where_conditions.append("moderate_severe_ar = %s")
            params.append(filters['moderate_severe_ar'])
        
        if filters.get('moderate_severe_mr') is not None:
            where_conditions.append("moderate_severe_mr = %s")
            params.append(filters['moderate_severe_mr'])
        
        if filters.get('lvedv_min'):
            where_conditions.append("lvedv >= %s")
            params.append(filters['lvedv_min'])
        if filters.get('lvedv_max'):
            where_conditions.append("lvedv <= %s")
            params.append(filters['lvedv_max'])
        
        if filters.get('lvesv_min'):
            where_conditions.append("lvesv >= %s")
            params.append(filters['lvesv_min'])
        if filters.get('lvesv_max'):
            where_conditions.append("lvesv <= %s")
            params.append(filters['lvesv_max'])
        
        # 瓣环相关参数
        if filters.get('annular_area_min'):
            where_conditions.append("annular_area >= %s")
            params.append(filters['annular_area_min'])
        if filters.get('annular_area_max'):
            where_conditions.append("annular_area <= %s")
            params.append(filters['annular_area_max'])
        
        if filters.get('annular_mean_diameter_min'):
            where_conditions.append("annular_mean_diameter >= %s")
            params.append(filters['annular_mean_diameter_min'])
        if filters.get('annular_mean_diameter_max'):
            where_conditions.append("annular_mean_diameter <= %s")
            params.append(filters['annular_mean_diameter_max'])
        
        if filters.get('annular_min_diameter_min'):
            where_conditions.append("annular_min_diameter >= %s")
            params.append(filters['annular_min_diameter_min'])
        if filters.get('annular_min_diameter_max'):
            where_conditions.append("annular_min_diameter <= %s")
            params.append(filters['annular_min_diameter_max'])
        
        if filters.get('annular_max_diameter_min'):
            where_conditions.append("annular_max_diameter >= %s")
            params.append(filters['annular_max_diameter_min'])
        if filters.get('annular_max_diameter_max'):
            where_conditions.append("annular_max_diameter <= %s")
            params.append(filters['annular_max_diameter_max'])
        
        if filters.get('annular_perimeter_min'):
            where_conditions.append("annular_perimeter >= %s")
            params.append(filters['annular_perimeter_min'])
        if filters.get('annular_perimeter_max'):
            where_conditions.append("annular_perimeter <= %s")
            params.append(filters['annular_perimeter_max'])
        
        if filters.get('annular_eccentricity_min'):
            where_conditions.append("annular_eccentricity >= %s")
            params.append(filters['annular_eccentricity_min'])
        if filters.get('annular_eccentricity_max'):
            where_conditions.append("annular_eccentricity <= %s")
            params.append(filters['annular_eccentricity_max'])
        
        if filters.get('area_derived_diameter_min'):
            where_conditions.append("area_derived_diameter >= %s")
            params.append(filters['area_derived_diameter_min'])
        if filters.get('area_derived_diameter_max'):
            where_conditions.append("area_derived_diameter <= %s")
            params.append(filters['area_derived_diameter_max'])
        
        if filters.get('perimeter_derived_diameter_min'):
            where_conditions.append("perimeter_derived_diameter >= %s")
            params.append(filters['perimeter_derived_diameter_min'])
        if filters.get('perimeter_derived_diameter_max'):
            where_conditions.append("perimeter_derived_diameter <= %s")
            params.append(filters['perimeter_derived_diameter_max'])
        
        # 血流动力学参数
        if filters.get('aortic_valve_flow_velocity_min'):
            where_conditions.append("aortic_valve_flow_velocity >= %s")
            params.append(filters['aortic_valve_flow_velocity_min'])
        if filters.get('aortic_valve_flow_velocity_max'):
            where_conditions.append("aortic_valve_flow_velocity <= %s")
            params.append(filters['aortic_valve_flow_velocity_max'])
        
        # 解剖结构参数
        if filters.get('stj_height_min'):
            where_conditions.append("stj_height >= %s")
            params.append(filters['stj_height_min'])
        if filters.get('stj_height_max'):
            where_conditions.append("stj_height <= %s")
            params.append(filters['stj_height_max'])
        
        if filters.get('stj_diameter_min'):
            where_conditions.append("stj_diameter >= %s")
            params.append(filters['stj_diameter_min'])
        if filters.get('stj_diameter_max'):
            where_conditions.append("stj_diameter <= %s")
            params.append(filters['stj_diameter_max'])
        
        if filters.get('sinus_diameter_min'):
            where_conditions.append("sinus_diameter >= %s")
            params.append(filters['sinus_diameter_min'])
        if filters.get('sinus_diameter_max'):
            where_conditions.append("sinus_diameter <= %s")
            params.append(filters['sinus_diameter_max'])
        
        if filters.get('ascending_aorta_diameter_min'):
            where_conditions.append("ascending_aorta_diameter >= %s")
            params.append(filters['ascending_aorta_diameter_min'])
        if filters.get('ascending_aorta_diameter_max'):
            where_conditions.append("ascending_aorta_diameter <= %s")
            params.append(filters['ascending_aorta_diameter_max'])
        
        # 钙化相关参数
        if filters.get('supraannular_calcification_min'):
            where_conditions.append("supraannular_calcification >= %s")
            params.append(filters['supraannular_calcification_min'])
        if filters.get('supraannular_calcification_max'):
            where_conditions.append("supraannular_calcification <= %s")
            params.append(filters['supraannular_calcification_max'])
        
        if filters.get('annular_calcification_min'):
            where_conditions.append("annular_calcification >= %s")
            params.append(filters['annular_calcification_min'])
        if filters.get('annular_calcification_max'):
            where_conditions.append("annular_calcification <= %s")
            params.append(filters['annular_calcification_max'])
        
        # LVOT相关参数
        if filters.get('lvot_diameter_min'):
            where_conditions.append("lvot_diameter >= %s")
            params.append(filters['lvot_diameter_min'])
        if filters.get('lvot_diameter_max'):
            where_conditions.append("lvot_diameter <= %s")
            params.append(filters['lvot_diameter_max'])
        
        if filters.get('lvot_calcification_min'):
            where_conditions.append("lvot_calcification >= %s")
            params.append(filters['lvot_calcification_min'])
        if filters.get('lvot_calcification_max'):
            where_conditions.append("lvot_calcification <= %s")
            params.append(filters['lvot_calcification_max'])
        
        # 冠脉高度
        if filters.get('left_coronary_height_min'):
            where_conditions.append("left_coronary_height >= %s")
            params.append(filters['left_coronary_height_min'])
        if filters.get('left_coronary_height_max'):
            where_conditions.append("left_coronary_height <= %s")
            params.append(filters['left_coronary_height_max'])
        
        if filters.get('right_coronary_height_min'):
            where_conditions.append("right_coronary_height >= %s")
            params.append(filters['right_coronary_height_min'])
        if filters.get('right_coronary_height_max'):
            where_conditions.append("right_coronary_height <= %s")
            params.append(filters['right_coronary_height_max'])
        
        if filters.get('annulus_to_mitral_distance_min'):
            where_conditions.append("annulus_to_mitral_distance >= %s")
            params.append(filters['annulus_to_mitral_distance_min'])
        if filters.get('annulus_to_mitral_distance_max'):
            where_conditions.append("annulus_to_mitral_distance <= %s")
            params.append(filters['annulus_to_mitral_distance_max'])
        
        # 手术信息筛选
        if filters.get('transfemoral_access') is not None:
            where_conditions.append("transfemoral_access = %s")
            params.append(filters['transfemoral_access'])
        
        if filters.get('transapical_access') is not None:
            where_conditions.append("transapical_access = %s")
            params.append(filters['transapical_access'])
        
        if filters.get('other_access') is not None:
            where_conditions.append("other_access IS NOT NULL")
        
        if filters.get('thv_size'):
            if isinstance(filters['thv_size'], list):
                placeholders = ','.join(['%s'] * len(filters['thv_size']))
                where_conditions.append(f"thv_size IN ({placeholders})")
                params.extend(filters['thv_size'])
            else:
                where_conditions.append("thv_size = %s")
                params.append(filters['thv_size'])
        
        if filters.get('thv_type'):
            where_conditions.append("thv_type = %s")
            params.append(filters['thv_type'])
        
        if filters.get('thv_brand'):
            where_conditions.append("thv_brand LIKE %s")
            params.append(f"%{filters['thv_brand']}%")
        
        if filters.get('pre_dilation') is not None:
            where_conditions.append("pre_dilation = %s")
            params.append(filters['pre_dilation'])
        
        if filters.get('post_dilation') is not None:
            where_conditions.append("post_dilation = %s")
            params.append(filters['post_dilation'])
        
        # 手术时间参数
        if filters.get('total_procedure_time_min'):
            where_conditions.append("total_procedure_time >= %s")
            params.append(filters['total_procedure_time_min'])
        if filters.get('total_procedure_time_max'):
            where_conditions.append("total_procedure_time <= %s")
            params.append(filters['total_procedure_time_max'])
        
        if filters.get('fluoroscopy_time_min'):
            where_conditions.append("fluoroscopy_time >= %s")
            params.append(filters['fluoroscopy_time_min'])
        if filters.get('fluoroscopy_time_max'):
            where_conditions.append("fluoroscopy_time <= %s")
            params.append(filters['fluoroscopy_time_max'])
        
        if filters.get('contrast_volume_min'):
            where_conditions.append("contrast_volume >= %s")
            params.append(filters['contrast_volume_min'])
        if filters.get('contrast_volume_max'):
            where_conditions.append("contrast_volume <= %s")
            params.append(filters['contrast_volume_max'])
        
        # 术后即刻参数
        if filters.get('immediate_lvef_min'):
            where_conditions.append("immediate_lvef >= %s")
            params.append(filters['immediate_lvef_min'])
        if filters.get('immediate_lvef_max'):
            where_conditions.append("immediate_lvef <= %s")
            params.append(filters['immediate_lvef_max'])
        
        if filters.get('immediate_mean_pg_min'):
            where_conditions.append("immediate_mean_pg >= %s")
            params.append(filters['immediate_mean_pg_min'])
        if filters.get('immediate_mean_pg_max'):
            where_conditions.append("immediate_mean_pg <= %s")
            params.append(filters['immediate_mean_pg_max'])
        
        if filters.get('mean_pg_gte_20') is not None:
            where_conditions.append("mean_pg_gte_20 = %s")
            params.append(filters['mean_pg_gte_20'])
        
        # 并发症
        if filters.get('prosthesis_malposition') is not None:
            where_conditions.append("prosthesis_malposition = %s")
            params.append(filters['prosthesis_malposition'])
        
        if filters.get('annular_rupture') is not None:
            where_conditions.append("annular_rupture = %s")
            params.append(filters['annular_rupture'])
        
        if filters.get('excessive_oversizing') is not None:
            where_conditions.append("excessive_oversizing = %s")
            params.append(filters['excessive_oversizing'])
        
        if filters.get('oversizing_gte_15') is not None:
            where_conditions.append("oversizing_gte_15 = %s")
            params.append(filters['oversizing_gte_15'])
        
        if filters.get('immediate_pvl_occurred') is not None:
            where_conditions.append("immediate_pvl_occurred = %s")
            params.append(filters['immediate_pvl_occurred'])
        
        if filters.get('immediate_pvl_severity'):
            where_conditions.append("immediate_pvl_severity = %s")
            params.append(filters['immediate_pvl_severity'])
        
        if filters.get('thv_displacement') is not None:
            where_conditions.append("thv_displacement = %s")
            params.append(filters['thv_displacement'])
        
        if filters.get('conversion_to_savr') is not None:
            where_conditions.append("conversion_to_savr = %s")
            params.append(filters['conversion_to_savr'])
        
        if filters.get('cpb_required') is not None:
            where_conditions.append("cpb_required = %s")
            params.append(filters['cpb_required'])
        
        if filters.get('valve_in_valve') is not None:
            where_conditions.append("valve_in_valve = %s")
            params.append(filters['valve_in_valve'])
        
        if filters.get('periprocedural_death') is not None:
            where_conditions.append("periprocedural_death = %s")
            params.append(filters['periprocedural_death'])
        
        if filters.get('mitral_regurgitation_change_proc'):
            where_conditions.append("mitral_regurgitation_change_proc = %s")
            params.append(filters['mitral_regurgitation_change_proc'])
        
        # 出院前评价筛选
        if filters.get('death_before_discharge') is not None:
            where_conditions.append("death_before_discharge = %s")
            params.append(filters['death_before_discharge'])
        
        if filters.get('stroke_before_discharge') is not None:
            where_conditions.append("stroke_before_discharge = %s")
            params.append(filters['stroke_before_discharge'])
        
        if filters.get('major_bleeding') is not None:
            where_conditions.append("major_bleeding = %s")
            params.append(filters['major_bleeding'])
        
        if filters.get('aki') is not None:
            where_conditions.append("aki = %s")
            params.append(filters['aki'])
        
        if filters.get('major_vascular_complication') is not None:
            where_conditions.append("major_vascular_complication = %s")
            params.append(filters['major_vascular_complication'])
        
        if filters.get('mi_ami') is not None:
            where_conditions.append("mi_ami = %s")
            params.append(filters['mi_ami'])
        
        if filters.get('acs_ihd') is not None:
            where_conditions.append("acs_ihd = %s")
            params.append(filters['acs_ihd'])
        
        if filters.get('heart_failure') is not None:
            where_conditions.append("heart_failure = %s")
            params.append(filters['heart_failure'])
        
        if filters.get('all_cause_cv_death') is not None:
            where_conditions.append("all_cause_cv_death = %s")
            params.append(filters['all_cause_cv_death'])
        
        if filters.get('pacemaker_implantation') is not None:
            where_conditions.append("pacemaker_implantation = %s")
            params.append(filters['pacemaker_implantation'])
        
        if filters.get('pvl_detected') is not None:
            where_conditions.append("pvl_detected = %s")
            params.append(filters['pvl_detected'])
        
        if filters.get('pvl_severity'):
            where_conditions.append("pvl_severity = %s")
            params.append(filters['pvl_severity'])
        
        # 出院前血流动力学参数
        if filters.get('max_pg_min'):
            where_conditions.append("max_pg >= %s")
            params.append(filters['max_pg_min'])
        if filters.get('max_pg_max'):
            where_conditions.append("max_pg <= %s")
            params.append(filters['max_pg_max'])
        
        if filters.get('flow_velocity_min'):
            where_conditions.append("flow_velocity >= %s")
            params.append(filters['flow_velocity_min'])
        if filters.get('flow_velocity_max'):
            where_conditions.append("flow_velocity <= %s")
            params.append(filters['flow_velocity_max'])
        
        if filters.get('mean_pg_min'):
            where_conditions.append("mean_pg >= %s")
            params.append(filters['mean_pg_min'])
        if filters.get('mean_pg_max'):
            where_conditions.append("mean_pg <= %s")
            params.append(filters['mean_pg_max'])
        
        if filters.get('eoai_min'):
            where_conditions.append("eoai >= %s")
            params.append(filters['eoai_min'])
        if filters.get('eoai_max'):
            where_conditions.append("eoai <= %s")
            params.append(filters['eoai_max'])
        
        if filters.get('mitral_regurgitation_change_discharge'):
            where_conditions.append("mitral_regurgitation_change_discharge = %s")
            params.append(filters['mitral_regurgitation_change_discharge'])
        
        # 随访信息筛选
        if filters.get('mortality_30d') is not None:
            where_conditions.append("mortality_30d = %s")
            params.append(filters['mortality_30d'])
        
        if filters.get('mi_30d') is not None:
            where_conditions.append("mi_30d = %s")
            params.append(filters['mi_30d'])
        
        if filters.get('stroke_30d') is not None:
            where_conditions.append("stroke_30d = %s")
            params.append(filters['stroke_30d'])
        
        if filters.get('hf_readmission_30d') is not None:
            where_conditions.append("hf_readmission_30d = %s")
            params.append(filters['hf_readmission_30d'])
        
        if filters.get('mortality_1y') is not None:
            where_conditions.append("mortality_1y = %s")
            params.append(filters['mortality_1y'])
        
        if filters.get('mi_1y') is not None:
            where_conditions.append("mi_1y = %s")
            params.append(filters['mi_1y'])
        
        if filters.get('stroke_1y') is not None:
            where_conditions.append("stroke_1y = %s")
            params.append(filters['stroke_1y'])
        
        if filters.get('hf_readmission_1y') is not None:
            where_conditions.append("hf_readmission_1y = %s")
            params.append(filters['hf_readmission_1y'])
        
        # 随访时血流动力学参数
        if filters.get('lvef_last_followup_min'):
            where_conditions.append("lvef_last_followup >= %s")
            params.append(filters['lvef_last_followup_min'])
        if filters.get('lvef_last_followup_max'):
            where_conditions.append("lvef_last_followup <= %s")
            params.append(filters['lvef_last_followup_max'])
        
        if filters.get('nyha_last_followup'):
            where_conditions.append("nyha_last_followup = %s")
            params.append(filters['nyha_last_followup'])
        
        if filters.get('max_pg_last_followup_min'):
            where_conditions.append("max_pg_last_followup >= %s")
            params.append(filters['max_pg_last_followup_min'])
        if filters.get('max_pg_last_followup_max'):
            where_conditions.append("max_pg_last_followup <= %s")
            params.append(filters['max_pg_last_followup_max'])
        
        if filters.get('flow_velocity_last_followup_min'):
            where_conditions.append("flow_velocity_last_followup >= %s")
            params.append(filters['flow_velocity_last_followup_min'])
        if filters.get('flow_velocity_last_followup_max'):
            where_conditions.append("flow_velocity_last_followup <= %s")
            params.append(filters['flow_velocity_last_followup_max'])
        
        if filters.get('mean_pg_last_followup_min'):
            where_conditions.append("mean_pg_last_followup >= %s")
            params.append(filters['mean_pg_last_followup_min'])
        if filters.get('mean_pg_last_followup_max'):
            where_conditions.append("mean_pg_last_followup <= %s")
            params.append(filters['mean_pg_last_followup_max'])
        
        if filters.get('eoa_last_followup_min'):
            where_conditions.append("eoa_last_followup >= %s")
            params.append(filters['eoa_last_followup_min'])
        if filters.get('eoa_last_followup_max'):
            where_conditions.append("eoa_last_followup <= %s")
            params.append(filters['eoa_last_followup_max'])
        
        if filters.get('eoai_last_followup_min'):
            where_conditions.append("eoai_last_followup >= %s")
            params.append(filters['eoai_last_followup_min'])
        if filters.get('eoai_last_followup_max'):
            where_conditions.append("eoai_last_followup <= %s")
            params.append(filters['eoai_last_followup_max'])
        
        if filters.get('pvl_detected_last_followup') is not None:
            where_conditions.append("pvl_detected_last_followup = %s")
            params.append(filters['pvl_detected_last_followup'])
        
        if filters.get('pvl_severity_last_followup'):
            where_conditions.append("pvl_severity_last_followup = %s")
            params.append(filters['pvl_severity_last_followup'])
        
        # 后续干预和并发症
        if filters.get('subsequent_intervention') is not None:
            where_conditions.append("subsequent_intervention = %s")
            params.append(filters['subsequent_intervention'])
        
        if filters.get('occlusion_procedure') is not None:
            where_conditions.append("occlusion_procedure = %s")
            params.append(filters['occlusion_procedure'])
        
        if filters.get('reoperation') is not None:
            where_conditions.append("reoperation = %s")
            params.append(filters['reoperation'])
        
        if filters.get('conversion_to_open') is not None:
            where_conditions.append("conversion_to_open = %s")
            params.append(filters['conversion_to_open'])
        
        if filters.get('pacemaker_post') is not None:
            where_conditions.append("pacemaker_post = %s")
            params.append(filters['pacemaker_post'])
        
        if filters.get('valve_dislodgement') is not None:
            where_conditions.append("valve_dislodgement = %s")
            params.append(filters['valve_dislodgement'])
        
        if filters.get('aortic_dissection') is not None:
            where_conditions.append("aortic_dissection = %s")
            params.append(filters['aortic_dissection'])
        
        if filters.get('hematoma') is not None:
            where_conditions.append("hematoma = %s")
            params.append(filters['hematoma'])
        
        if filters.get('heart_failure_post') is not None:
            where_conditions.append("heart_failure_post = %s")
            params.append(filters['heart_failure_post'])
        
        if filters.get('mitral_regurgitation_change_followup'):
            where_conditions.append("mitral_regurgitation_change_followup = %s")
            params.append(filters['mitral_regurgitation_change_followup'])
        
        return where_conditions, params
    
    def get_filtered_data(self, filters, page=1, page_size=50):
        """获取筛选后的数据"""
        if not self.connect_database():
            return None
        
        try:
            cursor = self.connection.cursor(pymysql.cursors.DictCursor)
            
            # 构建WHERE子句
            where_conditions, params = self.build_where_clause(filters)
            
            # 构建基础查询 - 选择所有字段以支持完整筛选
            base_query = """
            SELECT *
            FROM tavi_patients
            """
            
            # 添加WHERE条件
            if where_conditions:
                base_query += " WHERE " + " AND ".join(where_conditions)
            
            # 获取总数
            count_query = f"SELECT COUNT(*) as total FROM ({base_query}) as filtered_data"
            cursor.execute(count_query, params)
            total_count = cursor.fetchone()['total']
            
            # 添加分页
            base_query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
            params.extend([page_size, (page - 1) * page_size])
            
            # 执行查询
            cursor.execute(base_query, params)
            results = cursor.fetchall()
            
            # 处理结果
            processed_results = [self.process_row(row) for row in results]
            
            return {
                'data': processed_results,
                'total': total_count,
                'page': page,
                'page_size': page_size,
                'total_pages': (total_count + page_size - 1) // page_size
            }
            
        except Exception as e:
            logging.error(f"查询数据失败: {e}")
            return None
        finally:
            self.close_connection()
    
    def get_statistics(self, filters=None):
        """获取统计数据"""
        if not self.connect_database():
            return None
        
        try:
            cursor = self.connection.cursor(pymysql.cursors.DictCursor)
            
            # 构建WHERE子句
            where_conditions, params = self.build_where_clause(filters or {})
            
            # 基础查询
            base_query = "SELECT * FROM tavi_patients"
            if where_conditions:
                base_query += " WHERE " + " AND ".join(where_conditions)
            
            # 获取基础统计
            stats_query = f"""
            SELECT 
                COUNT(*) as total_cases,
                COUNT(CASE WHEN immediate_pvl_occurred = 1 OR pvl_detected_last_followup = 1 THEN 1 END) as pvl_cases,
                COUNT(CASE WHEN mortality_30d = 1 OR mortality_1y = 1 OR death_before_discharge = 1 THEN 1 END) as death_cases,
                AVG(age) as avg_age,
                COUNT(CASE WHEN sex = 'Male' THEN 1 END) as male_count,
                COUNT(CASE WHEN sex = 'Female' THEN 1 END) as female_count
            FROM ({base_query}) as filtered_data
            """
            
            cursor.execute(stats_query, params)
            stats = cursor.fetchone()
            
            # 计算百分比
            total = stats['total_cases']
            if total > 0:
                pvl_rate = round((stats['pvl_cases'] / total) * 100, 1)
                death_rate = round((stats['death_cases'] / total) * 100, 1)
            else:
                pvl_rate = 0
                death_rate = 0
            
            return {
                'total_cases': total,
                'filtered_cases': total,
                'pvl_rate': f"{pvl_rate}%",
                'death_rate': f"{death_rate}%",
                'avg_age': round(float(stats['avg_age']) if stats['avg_age'] else 0, 1),
                'male_count': stats['male_count'],
                'female_count': stats['female_count']
            }
            
        except Exception as e:
            logging.error(f"获取统计数据失败: {e}")
            return None
        finally:
            self.close_connection()
    
    def get_chart_data(self, filters=None):
        """获取图表数据"""
        if not self.connect_database():
            return None
        
        try:
            cursor = self.connection.cursor(pymysql.cursors.DictCursor)
            
            # 构建WHERE子句
            where_conditions, params = self.build_where_clause(filters or {})
            
            base_query = "SELECT * FROM tavi_patients"
            if where_conditions:
                base_query += " WHERE " + " AND ".join(where_conditions)
            
            # 添加调试日志
            logging.info(f"图表查询SQL: {base_query}")
            logging.info(f"查询参数: {params}")
            
            chart_data = {}
            
            # 年龄分布
            age_query = f"""
            SELECT 
                CASE 
                    WHEN age < 60 THEN '<60'
                    WHEN age BETWEEN 60 AND 69 THEN '60-69'
                    WHEN age BETWEEN 70 AND 79 THEN '70-79'
                    WHEN age BETWEEN 80 AND 89 THEN '80-89'
                    WHEN age >= 90 THEN '≥90'
                    ELSE 'Unknown'
                END as age_group,
                COUNT(*) as count
            FROM ({base_query}) as filtered_data
            WHERE age IS NOT NULL
            GROUP BY age_group
            ORDER BY age_group
            """
            cursor.execute(age_query, params)
            chart_data['age_distribution'] = cursor.fetchall()
            
            # NYHA分级分布
            nyha_query = f"""
            SELECT nyha_classification, COUNT(*) as count
            FROM ({base_query}) as filtered_data
            WHERE nyha_classification IS NOT NULL
            GROUP BY nyha_classification
            ORDER BY nyha_classification
            """
            cursor.execute(nyha_query, params)
            chart_data['nyha_distribution'] = cursor.fetchall()
            
            # 瓣膜尺寸分布
            valve_size_query = f"""
            SELECT thv_size, COUNT(*) as count
            FROM ({base_query}) as filtered_data
            WHERE thv_size IS NOT NULL
            GROUP BY thv_size
            ORDER BY thv_size
            """
            cursor.execute(valve_size_query, params)
            chart_data['valve_size_distribution'] = cursor.fetchall()
            
            # 并发症统计 - 简化查询
            complications_query = f"""
            SELECT 
                'PVL' as complication, 
                COUNT(CASE WHEN immediate_pvl_occurred = 1 THEN 1 END) as count
            FROM ({base_query}) as filtered_data
            UNION ALL
            SELECT 
                '死亡' as complication,
                COUNT(CASE WHEN death_before_discharge = 1 THEN 1 END) as count
            FROM ({base_query}) as filtered_data
            UNION ALL
            SELECT 
                '卒中' as complication,
                COUNT(CASE WHEN stroke_before_discharge = 1 THEN 1 END) as count
            FROM ({base_query}) as filtered_data
            UNION ALL
            SELECT 
                '大出血' as complication,
                COUNT(CASE WHEN major_bleeding = 1 THEN 1 END) as count
            FROM ({base_query}) as filtered_data
            UNION ALL
            SELECT 
                '起搏器植入' as complication,
                COUNT(CASE WHEN pacemaker_implantation = 1 THEN 1 END) as count
            FROM ({base_query}) as filtered_data
            """
            
            # 执行并发症查询
            cursor.execute(complications_query, params * 5)  # 5个子查询，每个都需要参数
            complications_result = cursor.fetchall()
            
            # 获取总数用于计算百分比
            total_query = f"SELECT COUNT(*) as total FROM ({base_query}) as filtered_data"
            cursor.execute(total_query, params)
            total_cases = cursor.fetchone()['total']
            
            # 计算百分比
            for comp in complications_result:
                comp['rate'] = round((comp['count'] / total_cases * 100), 1) if total_cases > 0 else 0
            
            chart_data['complications'] = complications_result
            
            # 术前术后对比数据
            pre_post_query = f"""
            SELECT 
                AVG(aortic_valve_mean_pg) as pre_mean_pg,
                AVG(immediate_mean_pg) as post_mean_pg,
                AVG(lvef) as pre_lvef,
                AVG(immediate_lvef) as post_lvef
            FROM ({base_query}) as filtered_data
            WHERE aortic_valve_mean_pg IS NOT NULL 
               OR immediate_mean_pg IS NOT NULL 
               OR lvef IS NOT NULL 
               OR immediate_lvef IS NOT NULL
            """
            cursor.execute(pre_post_query, params)
            pre_post_result = cursor.fetchone()
            
            chart_data['pre_post_comparison'] = {
                'pre_mean_pg': round(float(pre_post_result['pre_mean_pg']) if pre_post_result['pre_mean_pg'] else 0, 1),
                'post_mean_pg': round(float(pre_post_result['post_mean_pg']) if pre_post_result['post_mean_pg'] else 0, 1),
                'pre_lvef': round(float(pre_post_result['pre_lvef']) if pre_post_result['pre_lvef'] else 0, 1),
                'post_lvef': round(float(pre_post_result['post_lvef']) if pre_post_result['post_lvef'] else 0, 1)
            }
            
            return chart_data
            
        except Exception as e:
            logging.error(f"获取图表数据失败: {e}")
            return None
        finally:
            self.close_connection()

# API实例将在每个请求中独立创建

@app.route('/api/data', methods=['POST'])
def get_data():
    """获取筛选后的数据"""
    try:
        filters = request.json.get('filters', {})
        page = request.json.get('page', 1)
        page_size = request.json.get('page_size', 50)
        
        # 为每个请求创建独立的API实例
        data_api = TaviDataAPI(DB_CONFIG)
        result = data_api.get_filtered_data(filters, page, page_size)
        
        if result is None:
            return jsonify({'error': '数据库查询失败'}), 500
        
        return jsonify(result)
        
    except Exception as e:
        logging.error(f"API错误: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/statistics', methods=['POST'])
def get_statistics():
    """获取统计数据"""
    try:
        filters = request.json.get('filters', {})
        
        # 为每个请求创建独立的API实例
        stats_api = TaviDataAPI(DB_CONFIG)
        result = stats_api.get_statistics(filters)
        
        if result is None:
            return jsonify({'error': '统计数据获取失败'}), 500
        
        return jsonify(result)
        
    except Exception as e:
        logging.error(f"统计API错误: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/charts', methods=['POST'])
def get_charts():
    """获取图表数据"""
    try:
        filters = request.json.get('filters', {})
        
        # 为每个请求创建独立的API实例
        chart_api = TaviDataAPI(DB_CONFIG)
        result = chart_api.get_chart_data(filters)
        
        if result is None:
            return jsonify({'error': '图表数据获取失败'}), 500
        
        return jsonify(result)
        
    except Exception as e:
        logging.error(f"图表API错误: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查"""
    return jsonify({'status': 'ok', 'timestamp': datetime.now().isoformat()})

@app.route('/', methods=['GET'])
def index():
    """首页"""
    return jsonify({
        'message': 'TAVI智能分析系统API服务',
        'version': '1.0.0',
        'endpoints': [
            '/api/data - 获取筛选数据',
            '/api/statistics - 获取统计数据', 
            '/api/charts - 获取图表数据',
            '/api/health - 健康检查'
        ]
    })

if __name__ == '__main__':
    logging.info("启动TAVI智能分析系统API服务...")
    app.run(host='0.0.0.0', port=5000, debug=True) 
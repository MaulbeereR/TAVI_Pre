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
import os
from logging.handlers import RotatingFileHandler

# 创建日志目录
log_dir = 'logs'
if not os.path.exists(log_dir):
    os.makedirs(log_dir)

# 配置日志记录
def setup_logger():
    # 创建日志记录器
    logger = logging.getLogger('tavi_system')
    logger.setLevel(logging.DEBUG)

    # 创建日志格式
    formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    # 创建文件处理器（按大小轮转）
    file_handler = RotatingFileHandler(
        os.path.join(log_dir, 'tavi_system.log'),
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5,
        encoding='utf-8'
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)

    # 创建错误日志文件处理器
    error_file_handler = RotatingFileHandler(
        os.path.join(log_dir, 'error.log'),
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5,
        encoding='utf-8'
    )
    error_file_handler.setLevel(logging.ERROR)
    error_file_handler.setFormatter(formatter)

    # 添加处理器到日志记录器
    logger.addHandler(file_handler)
    logger.addHandler(error_file_handler)

    return logger

# 初始化日志记录器
logger = setup_logger()

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
            logger.info("数据库连接成功")
            return True
        except Exception as e:
            logger.error(f"数据库连接失败: {e}")
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
        try:
            logger.info(f"开始构建WHERE子句，筛选条件: {filters}")
            where_conditions = []
            params = []
            
            # 基线资料筛选
            if filters.get('age_min'):
                where_conditions.append("age >= %s")
                params.append(filters['age_min'])
                logger.info(f"添加年龄最小值筛选: {filters['age_min']}")
            if filters.get('age_max'):
                where_conditions.append("age <= %s")
                params.append(filters['age_max'])
                logger.info(f"添加年龄最大值筛选: {filters['age_max']}")
            
            if filters.get('gender'):
                if isinstance(filters['gender'], list):
                    placeholders = ','.join(['%s'] * len(filters['gender']))
                    where_conditions.append(f"sex IN ({placeholders})")
                    params.extend(filters['gender'])
                    logger.info(f"添加性别筛选: {filters['gender']}")
                else:
                    where_conditions.append("sex = %s")
                    params.append(filters['gender'])
                    logger.info(f"添加性别筛选: {filters['gender']}")
            
            if filters.get('bmi_min'):
                where_conditions.append("bmi >= %s")
                params.append(filters['bmi_min'])
                logger.info(f"添加BMI最小值筛选: {filters['bmi_min']}")
            if filters.get('bmi_max'):
                where_conditions.append("bmi <= %s")
                params.append(filters['bmi_max'])
                logger.info(f"添加BMI最大值筛选: {filters['bmi_max']}")
            
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
                logger.info(f"添加糖尿病筛选: {filters['diabetes_mellitus']}")
            
            if filters.get('hypertension') is not None:
                where_conditions.append("hypertension = %s")
                params.append(filters['hypertension'])
                logger.info(f"添加高血压筛选: {filters['hypertension']}")
            
            if filters.get('hyperlipidemia') is not None:
                where_conditions.append("hyperlipidemia = %s")
                params.append(filters['hyperlipidemia'])
                logger.info(f"添加高脂血症筛选: {filters['hyperlipidemia']}")
            
            if filters.get('coronary_artery_disease') is not None:
                where_conditions.append("coronary_artery_disease = %s")
                params.append(filters['coronary_artery_disease'])
                logger.info(f"添加冠心病筛选: {filters['coronary_artery_disease']}")
            
            if filters.get('copd') is not None:
                where_conditions.append("copd = %s")
                params.append(filters['copd'])
                logger.info(f"添加COPD筛选: {filters['copd']}")
            
            if filters.get('dialysis') is not None:
                where_conditions.append("dialysis = %s")
                params.append(filters['dialysis'])
                logger.info(f"添加透析筛选: {filters['dialysis']}")
            
            if filters.get('atrial_fibrillation') is not None:
                where_conditions.append("atrial_fibrillation = %s")
                params.append(filters['atrial_fibrillation'])
                logger.info(f"添加房颤筛选: {filters['atrial_fibrillation']}")
            
            if filters.get('nyha_classification'):
                if isinstance(filters['nyha_classification'], list):
                    placeholders = ','.join(['%s'] * len(filters['nyha_classification']))
                    where_conditions.append(f"nyha_classification IN ({placeholders})")
                    params.extend(filters['nyha_classification'])
                    logger.info(f"添加NYHA分级筛选: {filters['nyha_classification']}")
                else:
                    where_conditions.append("nyha_classification = %s")
                    params.append(filters['nyha_classification'])
                    logger.info(f"添加NYHA分级筛选: {filters['nyha_classification']}")
            
            # 药物治疗
            if filters.get('acei_arb') is not None:
                where_conditions.append("acei_arb = %s")
                params.append(filters['acei_arb'])
                logger.info(f"添加ACEI/ARB筛选: {filters['acei_arb']}")
            
            if filters.get('beta_blocker') is not None:
                where_conditions.append("beta_blocker = %s")
                params.append(filters['beta_blocker'])
                logger.info(f"添加β受体阻滞剂筛选: {filters['beta_blocker']}")
            
            if filters.get('calcium_blocker') is not None:
                where_conditions.append("calcium_blocker = %s")
                params.append(filters['calcium_blocker'])
                logger.info(f"添加钙通道阻滞剂筛选: {filters['calcium_blocker']}")
            
            if filters.get('diuretic') is not None:
                where_conditions.append("diuretic = %s")
                params.append(filters['diuretic'])
                logger.info(f"添加利尿剂筛选: {filters['diuretic']}")
            
            if filters.get('aspirin') is not None:
                where_conditions.append("aspirin = %s")
                params.append(filters['aspirin'])
                logger.info(f"添加阿司匹林筛选: {filters['aspirin']}")
            
            # 术前影像学评估筛选
            if filters.get('lvef_min'):
                where_conditions.append("lvef >= %s")
                params.append(filters['lvef_min'])
                logger.info(f"添加LVEF最小值筛选: {filters['lvef_min']}")
            if filters.get('lvef_max'):
                where_conditions.append("lvef <= %s")
                params.append(filters['lvef_max'])
                logger.info(f"添加LVEF最大值筛选: {filters['lvef_max']}")
            
            if filters.get('aortic_valve_peak_pg_min'):
                where_conditions.append("aortic_valve_peak_pg >= %s")
                params.append(filters['aortic_valve_peak_pg_min'])
                logger.info(f"添加最大跨瓣压差最小值筛选: {filters['aortic_valve_peak_pg_min']}")
            if filters.get('aortic_valve_peak_pg_max'):
                where_conditions.append("aortic_valve_peak_pg <= %s")
                params.append(filters['aortic_valve_peak_pg_max'])
                logger.info(f"添加最大跨瓣压差最大值筛选: {filters['aortic_valve_peak_pg_max']}")
            
            if filters.get('aortic_valve_mean_pg_min'):
                where_conditions.append("aortic_valve_mean_pg >= %s")
                params.append(filters['aortic_valve_mean_pg_min'])
                logger.info(f"添加平均跨瓣压差最小值筛选: {filters['aortic_valve_mean_pg_min']}")
            if filters.get('aortic_valve_mean_pg_max'):
                where_conditions.append("aortic_valve_mean_pg <= %s")
                params.append(filters['aortic_valve_mean_pg_max'])
                logger.info(f"添加平均跨瓣压差最大值筛选: {filters['aortic_valve_mean_pg_max']}")
            
            if filters.get('aortic_valve_eoa_min'):
                where_conditions.append("aortic_valve_eoa >= %s")
                params.append(filters['aortic_valve_eoa_min'])
            if filters.get('aortic_valve_eoa_max'):
                where_conditions.append("aortic_valve_eoa <= %s")
                params.append(filters['aortic_valve_eoa_max'])
            
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
            
            if filters.get('aortic_valve_flow_velocity_min'):
                where_conditions.append("aortic_valve_flow_velocity >= %s")
                params.append(filters['aortic_valve_flow_velocity_min'])
            if filters.get('aortic_valve_flow_velocity_max'):
                where_conditions.append("aortic_valve_flow_velocity <= %s")
                params.append(filters['aortic_valve_flow_velocity_max'])
            
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
                logger.info(f"添加瓣环上钙化最小值筛选: {filters['supraannular_calcification_min']}")
                where_conditions.append("supraannular_calcification >= %s")
                params.append(filters['supraannular_calcification_min'])
            if filters.get('supraannular_calcification_max'):
                logger.info(f"添加瓣环上钙化最大值筛选: {filters['supraannular_calcification_max']}")
                where_conditions.append("supraannular_calcification <= %s")
                params.append(filters['supraannular_calcification_max'])
            
            if filters.get('annular_calcification_min'):
                logger.info(f"添加瓣环钙化最小值筛选: {filters['annular_calcification_min']}")
                where_conditions.append("annular_calcification >= %s")
                params.append(filters['annular_calcification_min'])
            if filters.get('annular_calcification_max'):
                logger.info(f"添加瓣环钙化最大值筛选: {filters['annular_calcification_max']}")
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
                logger.info(f"添加经股动脉入路筛选: {filters['transfemoral_access']}")
            
            if filters.get('transapical_access') is not None:
                where_conditions.append("transapical_access = %s")
                params.append(filters['transapical_access'])
                logger.info(f"添加经心尖入路筛选: {filters['transapical_access']}")
            
            if filters.get('other_access') is not None:
                where_conditions.append("other_access IS NOT NULL")
                logger.info("添加其它入路筛选")
            
            # 瓣膜尺寸筛选 - 支持数值范围和列表筛选
            if filters.get('thv_size_min'):
                logger.info(f"添加瓣膜尺寸最小值筛选: {filters['thv_size_min']}")
                where_conditions.append("thv_size >= %s")
                params.append(filters['thv_size_min'])
            if filters.get('thv_size_max'):
                logger.info(f"添加瓣膜尺寸最大值筛选: {filters['thv_size_max']}")
                where_conditions.append("thv_size <= %s")
                params.append(filters['thv_size_max'])
            
            # 保持原有的列表筛选逻辑作为备用
            if filters.get('thv_size') and not filters.get('thv_size_min') and not filters.get('thv_size_max'):
                if isinstance(filters['thv_size'], list):
                    placeholders = ','.join(['%s'] * len(filters['thv_size']))
                    where_conditions.append(f"thv_size IN ({placeholders})")
                    params.extend(filters['thv_size'])
                    logger.info(f"添加瓣膜尺寸列表筛选: {filters['thv_size']}")
                else:
                    where_conditions.append("thv_size = %s")
                    params.append(filters['thv_size'])
                    logger.info(f"添加瓣膜尺寸单个值筛选: {filters['thv_size']}")
            
            if filters.get('thv_type'):
                where_conditions.append("thv_type = %s")
                params.append(filters['thv_type'])
                logger.info(f"添加瓣膜类型筛选: {filters['thv_type']}")
            
            if filters.get('thv_brand'):
                where_conditions.append("thv_brand LIKE %s")
                params.append(f"%{filters['thv_brand']}%")
                logger.info(f"添加瓣膜品牌筛选: {filters['thv_brand']}")
            
            if filters.get('pre_dilation') is not None:
                where_conditions.append("pre_dilation = %s")
                params.append(filters['pre_dilation'])
                logger.info(f"添加预扩张筛选: {filters['pre_dilation']}")
            
            if filters.get('post_dilation') is not None:
                where_conditions.append("post_dilation = %s")
                params.append(filters['post_dilation'])
                logger.info(f"添加后扩张筛选: {filters['post_dilation']}")
            
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
                logger.info(f"添加跨瓣压差≥20mmHg筛选: {filters['mean_pg_gte_20']}")
            
            # 并发症
            if filters.get('prosthesis_malposition') is not None:
                where_conditions.append("prosthesis_malposition = %s")
                params.append(filters['prosthesis_malposition'])
                logger.info(f"添加严重错位筛选: {filters['prosthesis_malposition']}")
            
            if filters.get('annular_rupture') is not None:
                where_conditions.append("annular_rupture = %s")
                params.append(filters['annular_rupture'])
                logger.info(f"添加瓣环撕裂筛选: {filters['annular_rupture']}")
            
            if filters.get('excessive_oversizing') is not None:
                where_conditions.append("excessive_oversizing = %s")
                params.append(filters['excessive_oversizing'])
                logger.info(f"添加过大尺寸筛选: {filters['excessive_oversizing']}")
            
            if filters.get('oversizing_gte_15') is not None:
                where_conditions.append("oversizing_gte_15 = %s")
                params.append(filters['oversizing_gte_15'])
                logger.info(f"添加尺寸过大≥15%筛选: {filters['oversizing_gte_15']}")
            
            if filters.get('immediate_pvl_occurred') is not None:
                where_conditions.append("immediate_pvl_occurred = %s")
                params.append(filters['immediate_pvl_occurred'])
                logger.info(f"添加术后即刻瓣周漏筛选: {filters['immediate_pvl_occurred']}")
            
            if filters.get('immediate_pvl_severity'):
                where_conditions.append("immediate_pvl_severity = %s")
                params.append(filters['immediate_pvl_severity'])
                logger.info(f"添加术后即刻瓣周漏程度筛选: {filters['immediate_pvl_severity']}")
            
            if filters.get('pvl_severity'):
                where_conditions.append("pvl_severity = %s")
                params.append(filters['pvl_severity'])
                logger.info(f"添加出院前瓣周漏程度筛选: {filters['pvl_severity']}")
            
            if filters.get('pvl_severity_last_followup'):
                where_conditions.append("pvl_severity_last_followup = %s")
                params.append(filters['pvl_severity_last_followup'])
                logger.info(f"添加随访瓣周漏程度筛选: {filters['pvl_severity_last_followup']}")
            
            if filters.get('thv_displacement') is not None:
                where_conditions.append("thv_displacement = %s")
                params.append(filters['thv_displacement'])
                logger.info(f"添加瓣架移位筛选: {filters['thv_displacement']}")
            
            if filters.get('conversion_to_savr') is not None:
                where_conditions.append("conversion_to_savr = %s")
                params.append(filters['conversion_to_savr'])
                logger.info(f"添加转外科开胸筛选: {filters['conversion_to_savr']}")
            
            if filters.get('cpb_required') is not None:
                where_conditions.append("cpb_required = %s")
                params.append(filters['cpb_required'])
                logger.info(f"添加转心肺转流筛选: {filters['cpb_required']}")
            
            if filters.get('valve_in_valve') is not None:
                where_conditions.append("valve_in_valve = %s")
                params.append(filters['valve_in_valve'])
                logger.info(f"添加瓣中瓣筛选: {filters['valve_in_valve']}")
            
            if filters.get('periprocedural_death') is not None:
                where_conditions.append("periprocedural_death = %s")
                params.append(filters['periprocedural_death'])
                logger.info(f"添加围术期死亡筛选: {filters['periprocedural_death']}")
            
            if filters.get('mitral_regurgitation_change_proc'):
                where_conditions.append("mitral_regurgitation_change_proc = %s")
                params.append(filters['mitral_regurgitation_change_proc'])
                logger.info(f"添加二尖瓣返流变化筛选: {filters['mitral_regurgitation_change_proc']}")
            
            # 出院前评价筛选
            if filters.get('death_before_discharge') is not None:
                where_conditions.append("death_before_discharge = %s")
                params.append(filters['death_before_discharge'])
                logger.info(f"添加出院前死亡筛选: {filters['death_before_discharge']}")
            
            if filters.get('stroke_before_discharge') is not None:
                where_conditions.append("stroke_before_discharge = %s")
                params.append(filters['stroke_before_discharge'])
                logger.info(f"添加卒中筛选: {filters['stroke_before_discharge']}")
            
            if filters.get('major_bleeding') is not None:
                where_conditions.append("major_bleeding = %s")
                params.append(filters['major_bleeding'])
                logger.info(f"添加大出血筛选: {filters['major_bleeding']}")
            
            if filters.get('aki') is not None:
                where_conditions.append("aki = %s")
                params.append(filters['aki'])
                logger.info(f"添加急性肾衰筛选: {filters['aki']}")
            
            if filters.get('major_vascular_complication') is not None:
                where_conditions.append("major_vascular_complication = %s")
                params.append(filters['major_vascular_complication'])
                logger.info(f"添加严重血管并发症筛选: {filters['major_vascular_complication']}")
            
            if filters.get('mi_ami') is not None:
                where_conditions.append("mi_ami = %s")
                params.append(filters['mi_ami'])
                logger.info(f"添加心梗筛选: {filters['mi_ami']}")
            
            if filters.get('acs_ihd') is not None:
                where_conditions.append("acs_ihd = %s")
                params.append(filters['acs_ihd'])
                logger.info(f"添加急性冠脉综合征筛选: {filters['acs_ihd']}")
            
            if filters.get('heart_failure') is not None:
                where_conditions.append("heart_failure = %s")
                params.append(filters['heart_failure'])
                logger.info(f"添加心衰筛选: {filters['heart_failure']}")
            
            if filters.get('all_cause_cv_death') is not None:
                where_conditions.append("all_cause_cv_death = %s")
                params.append(filters['all_cause_cv_death'])
                logger.info(f"添加全因心血管死亡筛选: {filters['all_cause_cv_death']}")
            
            if filters.get('pacemaker_implantation') is not None:
                where_conditions.append("pacemaker_implantation = %s")
                params.append(filters['pacemaker_implantation'])
                logger.info(f"添加起搏器植入筛选: {filters['pacemaker_implantation']}")
            
            if filters.get('pvl_detected') is not None:
                where_conditions.append("pvl_detected = %s")
                params.append(filters['pvl_detected'])
                logger.info(f"添加瓣周漏检出筛选: {filters['pvl_detected']}")
            
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
            
            if filters.get('mitral_regurgitation_change'):
                where_conditions.append("mitral_regurgitation_change = %s")
                params.append(filters['mitral_regurgitation_change'])
                logger.info(f"添加二尖瓣返流变化筛选: {filters['mitral_regurgitation_change']}")
            
            # 随访信息筛选
            if filters.get('mortality_30d') is not None:
                where_conditions.append("mortality_30d = %s")
                params.append(filters['mortality_30d'])
                logger.info(f"添加30天死亡筛选: {filters['mortality_30d']}")
            
            if filters.get('mi_30d') is not None:
                where_conditions.append("mi_30d = %s")
                params.append(filters['mi_30d'])
                logger.info(f"添加30天心梗筛选: {filters['mi_30d']}")
            
            if filters.get('stroke_30d') is not None:
                where_conditions.append("stroke_30d = %s")
                params.append(filters['stroke_30d'])
                logger.info(f"添加30天卒中筛选: {filters['stroke_30d']}")
            
            if filters.get('hf_readmission_30d') is not None:
                where_conditions.append("hf_readmission_30d = %s")
                params.append(filters['hf_readmission_30d'])
                logger.info(f"添加30天心衰再住院筛选: {filters['hf_readmission_30d']}")
            
            if filters.get('mortality_1y') is not None:
                where_conditions.append("mortality_1y = %s")
                params.append(filters['mortality_1y'])
                logger.info(f"添加1年死亡筛选: {filters['mortality_1y']}")
            
            if filters.get('mi_1y') is not None:
                where_conditions.append("mi_1y = %s")
                params.append(filters['mi_1y'])
                logger.info(f"添加1年心梗筛选: {filters['mi_1y']}")
            
            if filters.get('stroke_1y') is not None:
                where_conditions.append("stroke_1y = %s")
                params.append(filters['stroke_1y'])
                logger.info(f"添加1年卒中筛选: {filters['stroke_1y']}")
            
            if filters.get('hf_readmission_1y') is not None:
                where_conditions.append("hf_readmission_1y = %s")
                params.append(filters['hf_readmission_1y'])
                logger.info(f"添加1年心衰再住院筛选: {filters['hf_readmission_1y']}")
            
            if filters.get('subsequent_intervention') is not None:
                where_conditions.append("subsequent_intervention = %s")
                params.append(filters['subsequent_intervention'])
                logger.info(f"添加后续干预筛选: {filters['subsequent_intervention']}")
            
            if filters.get('mitral_regurgitation_change_followup'):
                where_conditions.append("mitral_regurgitation_change_followup = %s")
                params.append(filters['mitral_regurgitation_change_followup'])
                logger.info(f"添加随访二尖瓣返流变化筛选: {filters['mitral_regurgitation_change_followup']}")
            
            # 支持DOI（patient_id）唯一筛选
            if filters.get('patient_id'):
                where_conditions.append("patient_id = %s")
                params.append(filters['patient_id'])
                logger.info(f"添加DOI筛选: {filters['patient_id']}")
            
            # 组合WHERE子句
            where_clause = " AND ".join(where_conditions) if where_conditions else "1=1"
            logger.info(f"最终WHERE子句: {where_clause}")
            logger.info(f"查询参数: {params}")
            return where_clause, params

        except Exception as e:
            logger.error(f"构建WHERE子句时出错: {e}")
            return "1=1", []
    
    def get_filtered_data(self, filters, page=1, page_size=50):
        """获取筛选后的数据"""
        if not self.connect_database():
            return None
        
        try:
            cursor = self.connection.cursor(pymysql.cursors.DictCursor)
            
            # 构建WHERE子句
            where_clause, params = self.build_where_clause(filters)
            
            # 构建基础查询 - 选择所有字段以支持完整筛选
            base_query = """
            SELECT *
            FROM tavi_patients
            """
            
            # 添加WHERE条件
            if where_clause != "1=1":
                base_query += " WHERE " + where_clause
            
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
            logger.error(f"查询数据失败: {e}")
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
            where_clause, params = self.build_where_clause(filters or {})
            
            # 基础查询
            base_query = "SELECT * FROM tavi_patients"
            if where_clause != "1=1":
                base_query += " WHERE " + where_clause
            
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
            logger.error(f"获取统计数据失败: {e}")
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
            where_clause, params = self.build_where_clause(filters or {})
            
            base_query = "SELECT * FROM tavi_patients"
            if where_clause != "1=1":
                base_query += " WHERE " + where_clause
            
            # 添加调试日志
            logger.info(f"图表查询SQL: {base_query}")
            logger.info(f"查询参数: {params}")
            
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
            logger.error(f"获取图表数据失败: {e}")
            return None
        finally:
            self.close_connection()

# API实例将在每个请求中独立创建

@app.route('/api/filter', methods=['POST'])
def filter_data():
    """处理筛选请求"""
    try:
        filters = request.get_json()
        logger.info(f"收到筛选请求: {filters}")
        
        # 获取筛选后的数据
        api = TaviDataAPI(DB_CONFIG)
        result = api.get_filtered_data(filters)
        
        if result is None:
            return jsonify({'error': '获取数据失败'}), 500
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"处理筛选请求失败: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/data', methods=['POST'])
def get_data():
    """获取筛选后的数据"""
    try:
        filters = request.json.get('filters', {})
        page = request.json.get('page', 1)
        page_size = request.json.get('page_size', 50)
        
        logger.info(f"收到数据请求 - 筛选条件: {filters}")
        logger.info(f"页码: {page}, 每页大小: {page_size}")
        
        # 检查瓣环钙化相关字段
        if 'annular_calcification_min' in filters or 'annular_calcification_max' in filters:
            logger.info(f"瓣环钙化筛选条件: min={filters.get('annular_calcification_min')}, max={filters.get('annular_calcification_max')}")
        if 'supraannular_calcification_min' in filters or 'supraannular_calcification_max' in filters:
            logger.info(f"瓣环上钙化筛选条件: min={filters.get('supraannular_calcification_min')}, max={filters.get('supraannular_calcification_max')}")
        
        # 为每个请求创建独立的API实例
        data_api = TaviDataAPI(DB_CONFIG)
        result = data_api.get_filtered_data(filters, page, page_size)
        
        if result is None:
            return jsonify({'error': '数据库查询失败'}), 500
        
        logger.info(f"查询成功，返回 {len(result.get('data', []))} 条记录")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"API错误: {e}")
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
        logger.error(f"统计API错误: {e}")
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
        logger.error(f"图表API错误: {e}")
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
    try:
        logger.info("启动TAVI智能分析系统API服务...")
        app.run(host='0.0.0.0', port=5000, debug=True)
    except Exception as e:
        logger.error(f"服务器启动失败: {str(e)}") 
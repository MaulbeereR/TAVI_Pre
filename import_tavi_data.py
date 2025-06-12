#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TAVI数据导入脚本
用于将JSON格式的TAVI数据导入到MySQL数据库中
"""

import json
import pymysql
from pymysql import Error
import logging
from datetime import datetime
import sys
import os

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('tavi_import.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

class TaviDataImporter:
    def __init__(self, host='139.196.16.111', user='root', password='qzoVLyLcMWMA2cL5', database='tavi_data'):
        """
        初始化数据库连接参数
        """
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.connection = None
        
    def connect_database(self):
        """
        连接到MySQL数据库
        """
        try:
            self.connection = pymysql.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database,
                charset='utf8mb4'
            )
            logging.info(f"成功连接到MySQL数据库 {self.database}")
            return True
        except Error as e:
            logging.error(f"连接数据库失败: {e}")
            return False
    
    def create_database_if_not_exists(self):
        """
        如果数据库不存在则创建
        """
        try:
            # 先连接到MySQL服务器
            temp_connection = pymysql.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                charset='utf8mb4'
            )
            cursor = temp_connection.cursor()
            
            # 创建数据库
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {self.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            logging.info(f"数据库 {self.database} 已创建或已存在")
            
            cursor.close()
            temp_connection.close()
            
        except Error as e:
            logging.error(f"创建数据库失败: {e}")
            return False
        return True
    
    def create_table_if_not_exists(self):
        """
        创建tavi_patients表（如果不存在）- 与SQL文件保持一致
        """
        if not self.connection or not self.connection.open:
            logging.error("数据库连接不可用")
            return False
        
        try:
            cursor = self.connection.cursor()
            
            create_table_sql = """
            CREATE TABLE IF NOT EXISTS tavi_patients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id VARCHAR(50) UNIQUE NOT NULL COMMENT '患者唯一标识符',
                
                -- 基线资料 (baseline_characteristics)
                age INT COMMENT '年龄(岁)',
                sex ENUM('Male', 'Female', 'N/A') COMMENT '性别',
                bmi DECIMAL(5,2) COMMENT '体重指数(kg/m²)',
                surface_area DECIMAL(5,2) COMMENT '体表面积(m²)',
                diabetes_mellitus BOOLEAN COMMENT '糖尿病',
                hypertension BOOLEAN COMMENT '高血压',
                hyperlipidemia BOOLEAN COMMENT '高脂血症',
                coronary_artery_disease BOOLEAN COMMENT '冠心病',
                copd BOOLEAN COMMENT '慢阻肺',
                dialysis BOOLEAN COMMENT '透析',
                atrial_fibrillation BOOLEAN COMMENT '房颤',
                nyha_classification ENUM('I', 'II', 'III', 'N/A') COMMENT '纽约心脏病协会分级',
                acei_arb BOOLEAN COMMENT '血管紧张素转换酶抑制剂/血管紧张素Ⅱ受体拮抗剂',
                beta_blocker BOOLEAN COMMENT 'Beta受体阻滞剂',
                calcium_blocker BOOLEAN COMMENT '钙离子阻滞剂',
                diuretic BOOLEAN COMMENT '利尿剂',
                aspirin BOOLEAN COMMENT '阿司匹林',
                anticoagulant BOOLEAN COMMENT '抗凝药',
                statins BOOLEAN COMMENT '他汀类药物',
                mi_history BOOLEAN COMMENT '心梗',
                pci_history BOOLEAN COMMENT '经皮冠状动脉介入术',
                cabg_history BOOLEAN COMMENT '冠状动脉旁路移植术',
                sts_score DECIMAL(8,4) COMMENT '胸外科医师学会评分',
                nt_probnp DECIMAL(12,4) COMMENT '氨基末端B型利钠肽前体',
                sglt2_inhibitors BOOLEAN COMMENT '钠-葡萄糖共转运蛋白2抑制剂',
                
                -- 术前影像学评估 (preprocedural_imaging)
                lvef DECIMAL(5,2) COMMENT '左心室射血分数(%)',
                aortic_valve_peak_pg DECIMAL(8,2) COMMENT '最大主动脉瓣跨瓣压差(mmHg)',
                aortic_valve_mean_pg DECIMAL(8,2) COMMENT '平均主动脉瓣跨瓣压差(mmHg)',
                aortic_valve_eoa DECIMAL(6,2) COMMENT '有效瓣口面积（主动脉瓣）(cm²)',
                aortic_valve_eoai DECIMAL(6,4) COMMENT '有效瓣口面积指数（主动脉瓣）',
                moderate_severe_ar BOOLEAN COMMENT '中度以上主动脉瓣反流',
                moderate_severe_mr BOOLEAN COMMENT '中度以上二尖瓣反流',
                lvedv DECIMAL(8,2) COMMENT '左心室舒张末期容积(ml)',
                lvesv DECIMAL(8,2) COMMENT '左心室收缩末期容积(ml)',
                annular_area DECIMAL(8,2) COMMENT '瓣环面积（主动脉瓣）(cm²)',
                annular_mean_diameter DECIMAL(6,2) COMMENT '瓣环平均直径（主动脉瓣）(mm)',
                annular_min_diameter DECIMAL(6,2) COMMENT '瓣环最小直径（主动脉瓣）(mm)',
                annular_max_diameter DECIMAL(6,2) COMMENT '瓣环最大直径（主动脉瓣）(mm)',
                annular_perimeter DECIMAL(6,2) COMMENT '瓣环周径（主动脉瓣）(mm)',
                annular_eccentricity DECIMAL(6,4) COMMENT '瓣环偏心率（主动脉瓣）',
                area_derived_diameter DECIMAL(6,2) COMMENT '源自面积的瓣环直径（主动脉瓣）(mm)',
                perimeter_derived_diameter DECIMAL(6,2) COMMENT '源自周长的瓣环直径（主动脉瓣）(mm)',
                aortic_valve_flow_velocity DECIMAL(6,2) COMMENT '主动脉瓣口流速',
                stj_height DECIMAL(6,2) COMMENT '窦管交界高度(mm)',
                stj_diameter DECIMAL(6,2) COMMENT '窦管交界直径(mm)',
                sinus_diameter DECIMAL(6,2) COMMENT '窦部直径（主动脉根部）(mm)',
                ascending_aorta_diameter DECIMAL(6,2) COMMENT '升主动脉直径(mm)',
                supraannular_calcification DECIMAL(10,2) COMMENT '瓣环上钙化（主动脉瓣）(mm³)',
                annular_calcification DECIMAL(10,2) COMMENT '瓣环钙化（主动脉瓣）(mm³)',
                lvot_diameter DECIMAL(6,2) COMMENT '左心室流出道直径(mm)',
                lvot_calcification DECIMAL(10,2) COMMENT '左心室流出道钙化体积(mm³)',
                left_coronary_height DECIMAL(6,2) COMMENT '左冠脉高度（主动脉根部）(mm)',
                right_coronary_height DECIMAL(6,2) COMMENT '右冠脉高度（主动脉根部）(mm)',
                annulus_to_mitral_distance DECIMAL(6,2) COMMENT '瓣环至二尖瓣前叶距离(mm)',
                
                -- 手术信息 (procedural_details)
                transfemoral_access BOOLEAN COMMENT '经股动脉入路',
                transapical_access BOOLEAN COMMENT '经心尖入路',
                other_access VARCHAR(100) COMMENT '其它入路',
                thv_size DECIMAL(6,2) COMMENT '瓣膜尺寸',
                thv_type ENUM('Self-expandable', 'Balloon-expandable') COMMENT '瓣膜类型',
                thv_brand VARCHAR(100) COMMENT '瓣膜品牌',
                pre_dilation BOOLEAN COMMENT '预扩张',
                post_dilation BOOLEAN COMMENT '后扩张',
                total_procedure_time DECIMAL(8,2) COMMENT '总术时',
                fluoroscopy_time DECIMAL(8,2) COMMENT '造影时间',
                contrast_volume DECIMAL(8,2) COMMENT '造影量',
                immediate_lvef DECIMAL(5,2) COMMENT '术后即刻左心室射血分数(%)',
                immediate_mean_pg DECIMAL(8,2) COMMENT '术后即刻主动脉瓣跨瓣压差(mmHg)',
                mean_pg_gte_20 BOOLEAN COMMENT '主动脉瓣跨瓣压差≥20 mmHg',
                prosthesis_malposition BOOLEAN COMMENT '严重错位',
                annular_rupture BOOLEAN COMMENT '瓣环撕裂',
                excessive_oversizing BOOLEAN COMMENT '过大尺寸',
                oversizing_gte_15 BOOLEAN COMMENT '尺寸过大≥15%',
                immediate_pvl_occurred BOOLEAN COMMENT '术后是否即刻瓣周漏',
                immediate_pvl_severity ENUM('微量', '轻度', '中度', '重度', 'N/A') COMMENT '术后即刻瓣周漏程度',
                thv_displacement BOOLEAN COMMENT '瓣架移位',
                conversion_to_savr BOOLEAN COMMENT '转外科开胸手术',
                cpb_required BOOLEAN COMMENT '转心肺转流术',
                valve_in_valve BOOLEAN COMMENT '瓣中瓣',
                periprocedural_death BOOLEAN COMMENT '围术期死亡',
                mitral_regurgitation_change_proc ENUM('增加', '减少', '无变化') COMMENT '二尖瓣返流变化',
                
                -- 出院前评价 (predischarge_evaluation)
                death_before_discharge BOOLEAN COMMENT '出院前死亡',
                stroke_before_discharge BOOLEAN COMMENT '卒中',
                major_bleeding BOOLEAN COMMENT '大出血',
                aki BOOLEAN COMMENT '急性肾衰',
                major_vascular_complication BOOLEAN COMMENT '严重血管并发症',
                mi_ami BOOLEAN COMMENT '心肌梗死/急性心肌梗死',
                acs_ihd BOOLEAN COMMENT '急性冠脉综合征/缺血性心脏病',
                heart_failure BOOLEAN COMMENT '心力衰竭',
                all_cause_cv_death BOOLEAN COMMENT '所有原因死亡和心血管死亡',
                pacemaker_implantation BOOLEAN COMMENT '起搏器植入',
                pvl_detected BOOLEAN COMMENT '出院前是否瓣周漏',
                pvl_severity ENUM('微量', '轻度', '中度', '重度', 'N/A') COMMENT '出院前瓣周漏程度',
                max_pg DECIMAL(8,2) COMMENT '出院前最大主动脉瓣跨瓣压差(mmHg)',
                flow_velocity DECIMAL(6,2) COMMENT '出院前主动脉瓣口流速',
                mean_pg DECIMAL(8,2) COMMENT '出院前平均主动脉瓣跨瓣压差(mmHg)',
                eoai DECIMAL(6,4) COMMENT '出院前实测有效瓣口面积指数',
                mitral_regurgitation_change_discharge ENUM('增加', '减少', '无变化') COMMENT '二尖瓣返流变化',
                
                -- 随访信息 (followup_characteristics)
                mortality_30d BOOLEAN COMMENT '30天全因',
                mi_30d BOOLEAN COMMENT '30天心梗',
                stroke_30d BOOLEAN COMMENT '30天卒中',
                hf_readmission_30d BOOLEAN COMMENT '30天心衰再住院',
                mortality_1y BOOLEAN COMMENT '1年全因',
                mi_1y BOOLEAN COMMENT '1年心梗',
                stroke_1y BOOLEAN COMMENT '1年卒中',
                hf_readmission_1y BOOLEAN COMMENT '1年心衰再住院',
                lvef_last_followup DECIMAL(5,2) COMMENT '左心室射血分数(%)',
                nyha_last_followup ENUM('I', 'II', 'III', 'N/A') COMMENT '纽约心脏病协会分级',
                max_pg_last_followup DECIMAL(8,2) COMMENT '最大主动脉瓣跨瓣压差(mmHg)',
                flow_velocity_last_followup DECIMAL(6,2) COMMENT '主动脉瓣口流速',
                mean_pg_last_followup DECIMAL(8,2) COMMENT '平均主动脉瓣跨瓣压差(mmHg)',
                eoa_last_followup DECIMAL(6,2) COMMENT '有效瓣口面积(cm²)',
                eoai_last_followup DECIMAL(6,4) COMMENT '有效瓣口面积指数',
                pvl_detected_last_followup BOOLEAN COMMENT '是否瓣周漏',
                pvl_severity_last_followup ENUM('微量', '轻度', '中度', '重度', 'N/A') COMMENT '瓣周漏程度',
                subsequent_intervention BOOLEAN COMMENT '患者是否因TAVI相关并发症而接受了后续干预',
                intervention_details TEXT COMMENT '后续干预的具体类型和发生时间',
                occlusion_procedure BOOLEAN COMMENT '术后封堵',
                reoperation BOOLEAN COMMENT '二次手术',
                conversion_to_open BOOLEAN COMMENT '术后中转开胸',
                pacemaker_post BOOLEAN COMMENT '术后起搏器植入',
                valve_dislodgement BOOLEAN COMMENT '术后瓣膜脱落',
                aortic_dissection BOOLEAN COMMENT '术后主动脉夹层',
                hematoma BOOLEAN COMMENT '术后血肿',
                heart_failure_post BOOLEAN COMMENT '术后心衰',
                mitral_regurgitation_change_followup ENUM('增加', '减少', '无变化') COMMENT '二尖瓣返流变化',
                
                -- 系统字段
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='TAVI患者数据表'
            """
            
            cursor.execute(create_table_sql)
            logging.info("成功创建或确认tavi_patients表存在（与SQL文件一致）")
            cursor.close()
            return True
            
        except Error as e:
            logging.error(f"创建表失败: {e}")
            return False
    
    def load_json_data(self, json_file_path):
        """
        加载JSON数据文件
        """
        try:
            with open(json_file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
                logging.info(f"成功加载JSON文件: {json_file_path}")
                return data
        except FileNotFoundError:
            logging.error(f"文件未找到: {json_file_path}")
            return None
        except json.JSONDecodeError as e:
            logging.error(f"JSON解析错误: {e}")
            return None
        except Exception as e:
            logging.error(f"加载文件时发生错误: {e}")
            return None
    
    def map_json_to_database_fields(self, patient_data):
        """
        将JSON数据映射到数据库字段
        """
        mapped_data = {}
        
        # 定义映射字典
        severity_mapping = {
            'trace': '微量',
            'mild': '轻度', 
            'moderate': '中度',
            'severe': '重度',
            'n/a': 'N/A',
            'none': 'N/A'
        }
        
        nyha_mapping = {
            'i': 'I',
            'ii': 'II', 
            'iii': 'III',
            'iv': 'III',  # 将IV映射为III，因为数据库不支持IV
            'n/a': 'N/A'
        }
        
        change_mapping = {
            'increase': '增加',
            'decrease': '减少', 
            'no change': '无变化',
            'unchanged': '无变化',
            'n/a': '无变化'
        }
        
        def safe_enum_convert(value, mapping_dict):
            """安全转换枚举值"""
            if value is None:
                return None
            if isinstance(value, str):
                return mapping_dict.get(value.lower(), value)
            return value
        
        # 基线资料映射
        if 'baseline_characteristics' in patient_data:
            baseline = patient_data['baseline_characteristics']
            mapped_data.update({
                'age': baseline.get('age'),
                'sex': baseline.get('sex'),
                'bmi': baseline.get('bmi'),
                'surface_area': baseline.get('surface_area'),
                'diabetes_mellitus': baseline.get('diabetes_mellitus'),
                'hypertension': baseline.get('hypertension'),
                'hyperlipidemia': baseline.get('hyperlipidemia'),
                'coronary_artery_disease': baseline.get('coronary_artery_disease'),
                'copd': baseline.get('copd'),
                'dialysis': baseline.get('dialysis'),
                'atrial_fibrillation': baseline.get('atrial_fibrillation'),
                'nyha_classification': safe_enum_convert(baseline.get('nyha_classification'), nyha_mapping),
                'acei_arb': baseline.get('acei_arb'),
                'beta_blocker': baseline.get('beta_blocker'),
                'calcium_blocker': baseline.get('calcium_blocker'),
                'diuretic': baseline.get('diuretic'),
                'aspirin': baseline.get('aspirin'),
                'anticoagulant': baseline.get('anticoagulant'),
                'statins': baseline.get('statins'),
                'mi_history': baseline.get('mi_history'),
                'pci_history': baseline.get('pci_history'),
                'cabg_history': baseline.get('cabg_history'),
                'sts_score': baseline.get('sts_score'),
                'nt_probnp': baseline.get('nt_probnp'),
                'sglt2_inhibitors': baseline.get('sglt2_inhibitors')
            })
        
        # 术前影像学评估映射
        if 'preprocedural_imaging' in patient_data:
            imaging = patient_data['preprocedural_imaging']
            mapped_data.update({
                'lvef': imaging.get('lvef'),
                'aortic_valve_peak_pg': imaging.get('aortic_valve_peak_pg'),
                'aortic_valve_mean_pg': imaging.get('aortic_valve_mean_pg'),
                'aortic_valve_eoa': imaging.get('aortic_valve_eoa'),
                'aortic_valve_eoai': imaging.get('aortic_valve_eoai'),
                'moderate_severe_ar': imaging.get('moderate_severe_ar'),
                'moderate_severe_mr': imaging.get('moderate_severe_mr'),
                'lvedv': imaging.get('lvedv'),
                'lvesv': imaging.get('lvesv'),
                'annular_area': imaging.get('annular_area'),
                'annular_mean_diameter': imaging.get('annular_mean_diameter'),
                'annular_min_diameter': imaging.get('annular_min_diameter'),
                'annular_max_diameter': imaging.get('annular_max_diameter'),
                'annular_perimeter': imaging.get('annular_perimeter'),
                'annular_eccentricity': imaging.get('annular_eccentricity'),
                'area_derived_diameter': imaging.get('area_derived_diameter'),
                'perimeter_derived_diameter': imaging.get('perimeter_derived_diameter'),
                'aortic_valve_flow_velocity': imaging.get('aortic_valve_flow_velocity'),
                'stj_height': imaging.get('stj_height'),
                'stj_diameter': imaging.get('stj_diameter'),
                'sinus_diameter': imaging.get('sinus_diameter'),
                'ascending_aorta_diameter': imaging.get('ascending_aorta_diameter'),
                'supraannular_calcification': imaging.get('supraannular_calcification'),
                'annular_calcification': imaging.get('annular_calcification'),
                'lvot_diameter': imaging.get('lvot_diameter'),
                'lvot_calcification': imaging.get('lvot_calcification'),
                'left_coronary_height': imaging.get('left_coronary_height'),
                'right_coronary_height': imaging.get('right_coronary_height'),
                'annulus_to_mitral_distance': imaging.get('annulus_to_mitral_distance')
            })
        
        # 手术信息映射
        if 'procedural_details' in patient_data:
            procedure = patient_data['procedural_details']
            mapped_data.update({
                'transfemoral_access': procedure.get('transfemoral_access'),
                'transapical_access': procedure.get('transapical_access'),
                'other_access': procedure.get('other_access'),
                'thv_size': procedure.get('thv_size'),
                'thv_type': procedure.get('thv_type'),
                'thv_brand': procedure.get('thv_brand'),
                'pre_dilation': procedure.get('pre_dilation'),
                'post_dilation': procedure.get('post_dilation'),
                'total_procedure_time': procedure.get('total_procedure_time'),
                'fluoroscopy_time': procedure.get('fluoroscopy_time'),
                'contrast_volume': procedure.get('contrast_volume'),
                'immediate_lvef': procedure.get('immediate_lvef'),
                'immediate_mean_pg': procedure.get('immediate_mean_pg'),
                'mean_pg_gte_20': procedure.get('mean_pg_gte_20'),
                'prosthesis_malposition': procedure.get('prosthesis_malposition'),
                'annular_rupture': procedure.get('annular_rupture'),
                'excessive_oversizing': procedure.get('excessive_oversizing'),
                'oversizing_gte_15': procedure.get('oversizing_gte_15'),
                'immediate_pvl_occurred': procedure.get('immediate_pvl_occurred'),
                'immediate_pvl_severity': safe_enum_convert(procedure.get('immediate_pvl_severity'), severity_mapping),
                'thv_displacement': procedure.get('thv_displacement'),
                'conversion_to_savr': procedure.get('conversion_to_savr'),
                'cpb_required': procedure.get('cpb_required'),
                'valve_in_valve': procedure.get('valve_in_valve'),
                'periprocedural_death': procedure.get('periprocedural_death'),
                'mitral_regurgitation_change_proc': safe_enum_convert(procedure.get('mitral_regurgitation_change'), change_mapping)
            })
        
        # 出院前评价映射
        if 'predischarge_evaluation' in patient_data:
            predischarge = patient_data['predischarge_evaluation']
            mapped_data.update({
                'death_before_discharge': predischarge.get('death_before_discharge'),
                'stroke_before_discharge': predischarge.get('stroke_before_discharge'),
                'major_bleeding': predischarge.get('major_bleeding'),
                'aki': predischarge.get('aki'),
                'major_vascular_complication': predischarge.get('major_vascular_complication'),
                'mi_ami': predischarge.get('mi_ami'),
                'acs_ihd': predischarge.get('acs_ihd'),
                'heart_failure': predischarge.get('heart_failure'),
                'all_cause_cv_death': predischarge.get('all_cause_cv_death'),
                'pacemaker_implantation': predischarge.get('pacemaker_implantation'),
                'pvl_detected': predischarge.get('pvl_detected'),
                'pvl_severity': safe_enum_convert(predischarge.get('pvl_severity'), severity_mapping),
                'max_pg': predischarge.get('max_pg'),
                'flow_velocity': predischarge.get('flow_velocity'),
                'mean_pg': predischarge.get('mean_pg'),
                'eoai': predischarge.get('eoai'),
                'mitral_regurgitation_change_discharge': safe_enum_convert(predischarge.get('mitral_regurgitation_change'), change_mapping)
            })
        
        # 随访信息映射
        if 'followup_characteristics' in patient_data:
            followup = patient_data['followup_characteristics']
            mapped_data.update({
                'mortality_30d': followup.get('mortality_30d'),
                'mi_30d': followup.get('mi_30d'),
                'stroke_30d': followup.get('stroke_30d'),
                'hf_readmission_30d': followup.get('hf_readmission_30d'),
                'mortality_1y': followup.get('mortality_1y'),
                'mi_1y': followup.get('mi_1y'),
                'stroke_1y': followup.get('stroke_1y'),
                'hf_readmission_1y': followup.get('hf_readmission_1y'),
                'lvef_last_followup': followup.get('lvef_last_followup'),
                'nyha_last_followup': safe_enum_convert(followup.get('nyha_last_followup'), nyha_mapping),
                'max_pg_last_followup': followup.get('max_pg_last_followup'),
                'flow_velocity_last_followup': followup.get('flow_velocity_last_followup'),
                'mean_pg_last_followup': followup.get('mean_pg_last_followup'),
                'eoa_last_followup': followup.get('eoa_last_followup'),
                'eoai_last_followup': followup.get('eoai_last_followup'),
                'pvl_detected_last_followup': followup.get('pvl_detected_last_followup'),
                'pvl_severity_last_followup': safe_enum_convert(followup.get('pvl_severity_last_followup'), severity_mapping),
                'subsequent_intervention': followup.get('subsequent_intervention'),
                'intervention_details': followup.get('intervention_details'),
                'occlusion_procedure': followup.get('occlusion_procedure'),
                'reoperation': followup.get('reoperation'),
                'conversion_to_open': followup.get('conversion_to_open'),
                'pacemaker_post': followup.get('pacemaker_post'),
                'valve_dislodgement': followup.get('valve_dislodgement'),
                'aortic_dissection': followup.get('aortic_dissection'),
                'hematoma': followup.get('hematoma'),
                'heart_failure_post': followup.get('heart_failure_post'),
                'mitral_regurgitation_change_followup': safe_enum_convert(followup.get('mitral_regurgitation_change_followup'), change_mapping)
            })
        
        return mapped_data
    
    def insert_patient_data(self, patient_id, patient_data):
        """
        插入单个患者数据到数据库
        """
        if not self.connection or not self.connection.open:
            logging.error("数据库连接不可用")
            return False
        
        try:
            cursor = self.connection.cursor()
            
            # 映射数据
            mapped_data = self.map_json_to_database_fields(patient_data)
            mapped_data['patient_id'] = patient_id
            
            # 过滤掉None值
            filtered_data = {k: v for k, v in mapped_data.items() if v is not None}
            
            # 添加调试信息
            logging.info(f"患者 {patient_id} 的映射数据字段数: {len(mapped_data)}")
            logging.info(f"患者 {patient_id} 的有效数据字段数: {len(filtered_data)}")
            logging.info(f"有效字段: {list(filtered_data.keys())}")
            
            if not filtered_data:
                logging.warning(f"患者 {patient_id} 没有有效数据，跳过插入")
                return False
            
            columns = list(filtered_data.keys())
            placeholders = ', '.join(['%s'] * len(columns))
            column_names = ', '.join(columns)
            
            # 构建UPDATE部分，排除patient_id
            update_parts = [f'{col} = VALUES({col})' for col in columns if col != 'patient_id']
            
            # 如果没有需要更新的字段（只有patient_id），使用简单的INSERT IGNORE
            if not update_parts:
                query = f"""
                INSERT IGNORE INTO tavi_patients ({column_names})
                VALUES ({placeholders})
                """
            else:
                query = f"""
                INSERT INTO tavi_patients ({column_names})
                VALUES ({placeholders})
                ON DUPLICATE KEY UPDATE
                {', '.join(update_parts)}
                """
            
            # 添加SQL调试信息
            logging.info(f"执行SQL: {query}")
            logging.info(f"参数值: {list(filtered_data.values())}")
            
            cursor.execute(query, list(filtered_data.values()))
            self.connection.commit()
            
            logging.info(f"成功插入/更新患者数据: {patient_id}")
            cursor.close()
            return True
            
        except Error as e:
            logging.error(f"插入患者数据失败 {patient_id}: {e}")
            self.connection.rollback()
            return False
    
    def import_data_from_json(self, json_file_path):
        """
        从JSON文件导入数据
        """
        # 加载JSON数据
        json_data = self.load_json_data(json_file_path)
        if not json_data:
            return False
        
        # 连接数据库
        if not self.connect_database():
            return False
        
        # 创建表
        if not self.create_table_if_not_exists():
            return False
        
        success_count = 0
        error_count = 0
        
        # 如果JSON数据是数组格式
        if isinstance(json_data, list):
            for i, patient_data in enumerate(json_data):
                patient_id = patient_data.get('patient_id', f'TAVI_{i+1:04d}')
                if self.insert_patient_data(patient_id, patient_data):
                    success_count += 1
                else:
                    error_count += 1
        
        # 如果JSON数据是对象格式
        elif isinstance(json_data, dict):
            if 'patients' in json_data:
                for patient_id, patient_data in json_data['patients'].items():
                    if self.insert_patient_data(patient_id, patient_data):
                        success_count += 1
                    else:
                        error_count += 1
            else:
                # 假设JSON的每个键都是一个患者记录
                for patient_id, patient_data in json_data.items():
                    if self.insert_patient_data(patient_id, patient_data):
                        success_count += 1
                    else:
                        error_count += 1
        
        logging.info(f"数据导入完成 - 成功: {success_count}, 失败: {error_count}")
        return success_count > 0
    
    def close_connection(self):
        """
        关闭数据库连接
        """
        if self.connection and self.connection.open:
            self.connection.close()
            logging.info("数据库连接已关闭")

def main():
    """
    主函数
    """
    # 数据库连接配置
    # DB_CONFIG = {
    #     'host': '139.196.16.111',
    #     'user': 'root',
    #     'password': 'qzoVLyLcMWMA2cL5',  # 请根据实际情况修改密码
    #     'database': 'tavi_data'
    # }
    DB_CONFIG = {
        'host': '192.168.23.247',
        'user': 'root',
        'password': 'sB4L4XfTNarkuAyD',  # 请根据实际情况修改密码
        'database': 'tavi_data'
    }
    
    # JSON数据文件路径
    json_file_path = './data/0604_cleaned_data.json'  # 请根据实际文件路径修改
    
    # 检查文件是否存在
    if not os.path.exists(json_file_path):
        logging.error(f"JSON数据文件不存在: {json_file_path}")
        print("请确保JSON数据文件存在，并修改脚本中的文件路径")
        return
    
    # 创建导入器实例
    importer = TaviDataImporter(**DB_CONFIG)
    
    try:
        # 创建数据库（如果不存在）
        importer.create_database_if_not_exists()
        
        # 导入数据
        success = importer.import_data_from_json(json_file_path)
        
        if success:
            print("数据导入成功完成！")
        else:
            print("数据导入失败，请检查日志文件")
            
    except Exception as e:
        logging.error(f"导入过程中发生错误: {e}")
        print(f"导入过程中发生错误: {e}")
    
    finally:
        # 关闭连接
        importer.close_connection()

if __name__ == "__main__":
    main() 
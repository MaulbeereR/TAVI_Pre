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
        
        if filters.get('mi_history') is not None:
            where_conditions.append("mi_history = %s")
            params.append(filters['mi_history'])
        
        if filters.get('pci_history') is not None:
            where_conditions.append("pci_history = %s")
            params.append(filters['pci_history'])
        
        if filters.get('cabg_history') is not None:
            where_conditions.append("cabg_history = %s")
            params.append(filters['cabg_history'])
        
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
        
        # 手术信息筛选
        if filters.get('transfemoral_access') is not None:
            where_conditions.append("transfemoral_access = %s")
            params.append(filters['transfemoral_access'])
        
        if filters.get('transapical_access') is not None:
            where_conditions.append("transapical_access = %s")
            params.append(filters['transapical_access'])
        
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
        
        if filters.get('immediate_mean_pg_min'):
            where_conditions.append("immediate_mean_pg >= %s")
            params.append(filters['immediate_mean_pg_min'])
        if filters.get('immediate_mean_pg_max'):
            where_conditions.append("immediate_mean_pg <= %s")
            params.append(filters['immediate_mean_pg_max'])
        
        if filters.get('mean_pg_gte_20') is not None:
            where_conditions.append("mean_pg_gte_20 = %s")
            params.append(filters['mean_pg_gte_20'])
        
        if filters.get('prosthesis_malposition') is not None:
            where_conditions.append("prosthesis_malposition = %s")
            params.append(filters['prosthesis_malposition'])
        
        if filters.get('annular_rupture') is not None:
            where_conditions.append("annular_rupture = %s")
            params.append(filters['annular_rupture'])
        
        if filters.get('immediate_pvl_occurred') is not None:
            where_conditions.append("immediate_pvl_occurred = %s")
            params.append(filters['immediate_pvl_occurred'])
        
        if filters.get('immediate_pvl_severity'):
            where_conditions.append("immediate_pvl_severity = %s")
            params.append(filters['immediate_pvl_severity'])
        
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
        
        if filters.get('pacemaker_implantation') is not None:
            where_conditions.append("pacemaker_implantation = %s")
            params.append(filters['pacemaker_implantation'])
        
        # 随访信息筛选
        if filters.get('mortality_30d') is not None:
            where_conditions.append("mortality_30d = %s")
            params.append(filters['mortality_30d'])
        
        if filters.get('mortality_1y') is not None:
            where_conditions.append("mortality_1y = %s")
            params.append(filters['mortality_1y'])
        
        if filters.get('pvl_detected_last_followup') is not None:
            where_conditions.append("pvl_detected_last_followup = %s")
            params.append(filters['pvl_detected_last_followup'])
        
        if filters.get('pvl_severity_last_followup'):
            where_conditions.append("pvl_severity_last_followup = %s")
            params.append(filters['pvl_severity_last_followup'])
        
        return where_conditions, params
    
    def get_filtered_data(self, filters, page=1, page_size=50):
        """获取筛选后的数据"""
        if not self.connect_database():
            return None
        
        try:
            cursor = self.connection.cursor(pymysql.cursors.DictCursor)
            
            # 构建WHERE子句
            where_conditions, params = self.build_where_clause(filters)
            
            # 构建基础查询
            base_query = """
            SELECT 
                patient_id, age, sex, bmi, atrial_fibrillation, nyha_classification,
                lvef, aortic_valve_peak_pg, aortic_valve_mean_pg, aortic_valve_eoa,
                transfemoral_access, transapical_access, thv_size, thv_type, thv_brand,
                immediate_mean_pg, mean_pg_gte_20, prosthesis_malposition, annular_rupture,
                immediate_pvl_occurred, immediate_pvl_severity,
                death_before_discharge, stroke_before_discharge, major_bleeding,
                pacemaker_implantation, mortality_30d, mortality_1y,
                pvl_detected_last_followup, pvl_severity_last_followup,
                created_at
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
            
            # 并发症统计
            complications_query = f"""
            SELECT 
                'PVL' as complication, COUNT(CASE WHEN immediate_pvl_occurred = 1 THEN 1 END) as count
            FROM ({base_query}) as filtered_data
            UNION ALL
            SELECT 
                'Death', COUNT(CASE WHEN death_before_discharge = 1 THEN 1 END)
            FROM ({base_query}) as filtered_data
            UNION ALL
            SELECT 
                'Stroke', COUNT(CASE WHEN stroke_before_discharge = 1 THEN 1 END)
            FROM ({base_query}) as filtered_data
            UNION ALL
            SELECT 
                'Bleeding', COUNT(CASE WHEN major_bleeding = 1 THEN 1 END)
            FROM ({base_query}) as filtered_data
            UNION ALL
            SELECT 
                'Pacemaker', COUNT(CASE WHEN pacemaker_implantation = 1 THEN 1 END)
            FROM ({base_query}) as filtered_data
            """
            cursor.execute(complications_query, params)
            chart_data['complications'] = cursor.fetchall()
            
            return chart_data
            
        except Exception as e:
            logging.error(f"获取图表数据失败: {e}")
            return None
        finally:
            self.close_connection()

# 创建API实例
api = TaviDataAPI(DB_CONFIG)

@app.route('/api/data', methods=['POST'])
def get_data():
    """获取筛选后的数据"""
    try:
        filters = request.json.get('filters', {})
        page = request.json.get('page', 1)
        page_size = request.json.get('page_size', 50)
        
        result = api.get_filtered_data(filters, page, page_size)
        
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
        
        result = api.get_statistics(filters)
        
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
        
        result = api.get_chart_data(filters)
        
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
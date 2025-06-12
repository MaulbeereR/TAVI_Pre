-- TAVI智能分析系统数据库创建脚本
-- 基于 TAVI_variables_schema_0530.json 创建

-- 创建数据库
CREATE DATABASE IF NOT EXISTS tavi_data CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tavi_data;

-- 删除已存在的表（如果需要重新创建）
DROP TABLE IF EXISTS tavi_patients;

-- 创建主表：TAVI患者数据表
CREATE TABLE tavi_patients (
    -- 主键
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    -- 索引
    INDEX idx_age (age),
    INDEX idx_sex (sex),
    INDEX idx_lvef (lvef),
    INDEX idx_nyha (nyha_classification),
    INDEX idx_procedure_date (created_at),
    INDEX idx_thv_type (thv_type),
    INDEX idx_thv_brand (thv_brand)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='TAVI患者数据表';

-- 创建数据导入示例（假设有示例数据）
-- 注意：实际使用时需要根据具体的JSON数据文件进行导入

-- 示例插入语句模板
/*
INSERT INTO tavi_patients (
    patient_id, age, sex, bmi, lvef, nyha_classification,
    aortic_valve_mean_pg, thv_type, thv_brand
) VALUES (
    'TAVI001', 75, 'Male', 24.5, 55.0, 'III',
    45.2, 'Self-expandable', 'CoreValve'
);
*/

-- 创建视图：重要数据筛选视图
CREATE OR REPLACE VIEW important_data_view AS
SELECT 
    patient_id,
    age,
    sex,
    atrial_fibrillation,
    nyha_classification,
    lvef,
    aortic_valve_peak_pg,
    aortic_valve_mean_pg,
    aortic_valve_eoa,
    thv_type,
    thv_brand,
    thv_size,
    immediate_pvl_occurred,
    immediate_pvl_severity,
    mean_pg,
    mortality_30d,
    mortality_1y,
    pvl_detected_last_followup,
    pvl_severity_last_followup,
    created_at
FROM tavi_patients;

-- 创建统计汇总视图
CREATE OR REPLACE VIEW statistics_summary AS
SELECT 
    COUNT(*) as total_patients,
    AVG(age) as avg_age,
    COUNT(CASE WHEN sex = 'Male' THEN 1 END) as male_count,
    COUNT(CASE WHEN sex = 'Female' THEN 1 END) as female_count,
    AVG(lvef) as avg_lvef,
    AVG(aortic_valve_mean_pg) as avg_mean_pg,
    COUNT(CASE WHEN mortality_30d = TRUE THEN 1 END) as mortality_30d_count,
    COUNT(CASE WHEN mortality_1y = TRUE THEN 1 END) as mortality_1y_count,
    COUNT(CASE WHEN immediate_pvl_occurred = TRUE THEN 1 END) as immediate_pvl_count
FROM tavi_patients;

-- 授权语句（根据需要调整用户名和权限）
/*
CREATE USER IF NOT EXISTS 'tavi_user'@'localhost' IDENTIFIED BY 'tavi_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON tavi_data.* TO 'tavi_user'@'localhost';
FLUSH PRIVILEGES;
*/

-- 显示创建结果
SHOW TABLES;
DESCRIBE tavi_patients;
SELECT * FROM statistics_summary;

COMMIT; 
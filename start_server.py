#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TAVI智能分析系统启动脚本
"""

import subprocess
import sys
import os
import time

def check_dependencies():
    """检查依赖是否已安装"""
    try:
        import flask
        import flask_cors
        import pymysql
        print("✓ 所有依赖已安装")
        return True
    except ImportError as e:
        print(f"✗ 缺少依赖: {e}")
        return False

def install_dependencies():
    """安装依赖"""
    print("正在安装依赖...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✓ 依赖安装完成")
        return True
    except subprocess.CalledProcessError:
        print("✗ 依赖安装失败")
        return False

def test_database_connection():
    """测试数据库连接"""
    try:
        import pymysql
        
        # 数据库配置
        DB_CONFIG = {
            'host': '192.168.23.247',
            'user': 'root',
            'password': 'sB4L4XfTNarkuAyD',
            'database': 'tavi_data',
            'charset': 'utf8mb4'
        }
        
        connection = pymysql.connect(**DB_CONFIG)
        cursor = connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM tavi_patients")
        count = cursor.fetchone()[0]
        cursor.close()
        connection.close()
        
        print(f"✓ 数据库连接成功，共有 {count} 条患者记录")
        return True
        
    except Exception as e:
        print(f"✗ 数据库连接失败: {e}")
        print("请检查数据库配置和网络连接")
        return False

def start_server():
    """启动Flask服务器"""
    print("正在启动TAVI智能分析系统...")
    print("服务器将在 http://localhost:5000 启动")
    print("前端页面请访问 index.html")
    print("按 Ctrl+C 停止服务器")
    print("-" * 50)
    
    try:
        # 启动Flask应用
        os.system("python app.py")
    except KeyboardInterrupt:
        print("\n服务器已停止")

def main():
    print("TAVI智能分析系统启动器")
    print("=" * 50)
    
    # 检查依赖
    if not check_dependencies():
        print("正在安装缺少的依赖...")
        if not install_dependencies():
            print("依赖安装失败，请手动运行: pip install -r requirements.txt")
            return
    
    # 测试数据库连接
    if not test_database_connection():
        print("数据库连接失败，请检查配置")
        return
    
    # 启动服务器
    start_server()

if __name__ == "__main__":
    main() 
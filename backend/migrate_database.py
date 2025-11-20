#!/usr/bin/env python3
"""
数据库迁移脚本 - 更新表结构以支持统计功能
"""

from models import db
from app import app
from sqlalchemy import text

def migrate_database():
    """执行数据库迁移"""
    with app.app_context():
        try:
            # 1. 为 users 表添加新字段
            print("更新 users 表...")
            db.session.execute(text("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS recognition_count INT DEFAULT 0,
                ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE
            """))
            
            # 2. 为 history 表添加新字段
            print("更新 history 表...")
            db.session.execute(text("""
                ALTER TABLE history 
                ADD COLUMN IF NOT EXISTS user_id INT,
                ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            """))
            
            # 3. 为 recognition_details 表添加新字段
            print("更新 recognition_details 表...")
            db.session.execute(text("""
                ALTER TABLE recognition_details 
                ADD COLUMN IF NOT EXISTS user_id INT,
                ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            """))
            
            # 4. 为 feedbacks 表添加新字段
            print("更新 feedbacks 表...")
            db.session.execute(text("""
                ALTER TABLE feedbacks 
                MODIFY COLUMN user_id INT,
                ADD COLUMN IF NOT EXISTS contact VARCHAR(128),
                ADD COLUMN IF NOT EXISTS feedback_type VARCHAR(32) DEFAULT 'general',
                ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            """))
            
            db.session.commit()
            print("✅ 数据库迁移成功完成！")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ 数据库迁移失败: {str(e)}")
            print("\n如果字段已存在，可以忽略此错误。")
            
            # 尝试使用 SQLAlchemy 的方式创建所有表
            print("\n尝试创建缺失的表...")
            db.create_all()
            print("✅ 表创建完成！")

if __name__ == '__main__':
    print("=" * 60)
    print("开始数据库迁移...")
    print("=" * 60)
    migrate_database()

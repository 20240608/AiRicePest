#!/usr/bin/env python3
"""
数据库迁移脚本：为现有用户添加 password_hash 字段
如果 users 表已有数据但没有 password_hash，运行此脚本设置默认密码
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app import app
from models import db, User
from utils import hash_password

with app.app_context():
    # 检查是否需要添加 password_hash 列
    from sqlalchemy import inspect
    inspector = inspect(db.engine)
    columns = [col['name'] for col in inspector.get_columns('users')]
    
    if 'password_hash' not in columns:
        print("添加 password_hash 列...")
        db.engine.execute("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) DEFAULT NULL")
        print("✓ password_hash 列已添加")
    
    # 为没有密码的用户设置默认密码
    users_without_password = User.query.filter(User.password_hash.is_(None)).all()
    
    if users_without_password:
        default_password = 'password123'  # 默认密码，建议首次登录后修改
        print(f"\n为 {len(users_without_password)} 个用户设置默认密码: {default_password}")
        
        for user in users_without_password:
            user.password_hash = hash_password(default_password)
            print(f"  - {user.username} (ID: {user.id})")
        
        db.session.commit()
        print("\n✓ 迁移完成！所有用户现在可以使用默认密码登录。")
        print("⚠️  建议用户首次登录后修改密码。")
    else:
        print("✓ 所有用户已有密码哈希，无需迁移。")


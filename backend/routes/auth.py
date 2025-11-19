from flask import Blueprint, request, jsonify
from models import db, User
from utils import hash_password, verify_password, generate_token

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    """用户登录"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'success': False, 'error': 'Username and password are required'}), 400
    
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'success': False, 'error': 'Invalid username or password'}), 401
    
    # 如果用户没有密码哈希（旧数据），允许任意密码登录（仅用于迁移）
    if not user.password_hash:
        # 为旧用户设置密码哈希
        user.password_hash = hash_password(password)
        db.session.commit()
    elif not verify_password(password, user.password_hash):
        return jsonify({'success': False, 'error': 'Invalid username or password'}), 401
    
    # 更新最后登录时间
    from datetime import datetime
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    token = generate_token(user.id, user.username, user.role)
    
    return jsonify({
        'success': True,
        'token': token,
        'user': {
            'id': str(user.id),
            'username': user.username,
            'email': user.email,
            'role': user.role
        }
    })


@auth_bp.route('/register', methods=['POST'])
def register():
    """用户注册"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    
    if not username or not password:
        return jsonify({'success': False, 'error': 'Username and password are required'}), 400
    
    if len(username) < 3:
        return jsonify({'success': False, 'error': 'Username must be at least 3 characters'}), 400
    
    if len(password) < 8:
        return jsonify({'success': False, 'error': 'Password must be at least 8 characters'}), 400
    
    # 检查用户名是否已存在
    if User.query.filter_by(username=username).first():
        return jsonify({'success': False, 'error': 'Username already exists'}), 409
    
    # 创建新用户
    password_hash = hash_password(password)
    user = User(
        username=username,
        email=email or f'{username}@example.com',
        password_hash=password_hash,
        role='user'
    )
    
    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({'success': True, 'message': 'User registered successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


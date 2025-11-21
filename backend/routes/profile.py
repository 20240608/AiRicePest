from flask import Blueprint, request, jsonify
from models import db, User
from utils import token_required

profile_bp = Blueprint('profile', __name__)


@profile_bp.route('/profile', methods=['GET'])
@token_required
def get_profile():
    """获取当前用户信息"""
    user_id = request.current_user.get('user_id')
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404
    
    return jsonify({
        'success': True,
        'data': {
            'id': str(user.id),
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'createdAt': user.created_at.isoformat() if user.created_at else None,
            'lastLogin': user.last_login.isoformat() if user.last_login else None,
            'recognitionCount': user.recognition_count or 0,
        }
    })


@profile_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile():
    """更新用户信息"""
    user_id = request.current_user.get('user_id')
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404
    
    data = request.get_json()
    if 'username' in data:
        # 检查用户名是否已被其他用户使用
        existing = User.query.filter(User.username == data['username'], User.id != user_id).first()
        if existing:
            return jsonify({'success': False, 'error': 'Username already exists'}), 409
        user.username = data['username']
    
    if 'email' in data:
        user.email = data['email']
    
    try:
        db.session.commit()
        return jsonify({
            'success': True,
            'data': {
                'id': str(user.id),
                'username': user.username,
                'email': user.email,
                'role': user.role
            }
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


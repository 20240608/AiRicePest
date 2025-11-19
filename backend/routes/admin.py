from flask import Blueprint, request, jsonify
from models import db, KnowledgeBase, User, Feedback
from utils import admin_required
import json

admin_bp = Blueprint('admin', __name__)


def split_to_array(value):
    """将文本分割为数组"""
    if not value:
        return []
    return [item.strip() for item in value.replace('；', ';').replace('、', ',').split(';') if item.strip()]


def comma_separated(value):
    """将逗号分隔的字符串转为数组"""
    if not value:
        return []
    return [item.strip() for item in value.split(',') if item.strip()]


@admin_bp.route('/knowledge', methods=['POST'])
@admin_required
def create_knowledge():
    """创建知识库条目"""
    data = request.get_json()
    
    try:
        kb = KnowledgeBase(
            pest_id=data.get('pest_id'),
            category=data.get('category', ''),
            disease_name=data.get('disease_name', ''),
            type_info=data.get('type_info'),
            alias_names=data.get('alias_names'),
            core_features=data.get('core_features'),
            affected_parts=data.get('affected_parts'),
            symptom_images=','.join(data.get('imageUrls', [])),
            pathogen_source=data.get('pathogen'),
            occurrence_conditions=data.get('conditions'),
            generations_periods=data.get('lifeCycle'),
            transmission_routes=data.get('transmission'),
            agricultural_control=';'.join(data.get('controls', {}).get('agricultural', [])),
            physical_control=';'.join(data.get('controls', {}).get('physical', [])),
            biological_control=';'.join(data.get('controls', {}).get('biological', [])),
            chemical_control=';'.join(data.get('controls', {}).get('chemical', []))
        )
        db.session.add(kb)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Knowledge base item created'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/knowledge/<int:pest_id>', methods=['PUT'])
@admin_required
def update_knowledge(pest_id):
    """更新知识库条目"""
    data = request.get_json()
    kb = KnowledgeBase.query.get(pest_id)
    
    if not kb:
        return jsonify({'success': False, 'error': 'Item not found'}), 404
    
    try:
        if 'category' in data:
            kb.category = data['category']
        if 'disease_name' in data:
            kb.disease_name = data['disease_name']
        if 'type_info' in data:
            kb.type_info = data['type_info']
        if 'alias_names' in data:
            kb.alias_names = data['alias_names']
        if 'core_features' in data:
            kb.core_features = data['core_features']
        if 'affected_parts' in data:
            kb.affected_parts = data['affected_parts']
        if 'imageUrls' in data:
            kb.symptom_images = ','.join(data['imageUrls'])
        if 'pathogen' in data:
            kb.pathogen_source = data['pathogen']
        if 'conditions' in data:
            kb.occurrence_conditions = data['conditions']
        if 'lifeCycle' in data:
            kb.generations_periods = data['lifeCycle']
        if 'transmission' in data:
            kb.transmission_routes = data['transmission']
        if 'controls' in data:
            controls = data['controls']
            if 'agricultural' in controls:
                kb.agricultural_control = ';'.join(controls['agricultural'])
            if 'physical' in controls:
                kb.physical_control = ';'.join(controls['physical'])
            if 'biological' in controls:
                kb.biological_control = ';'.join(controls['biological'])
            if 'chemical' in controls:
                kb.chemical_control = ';'.join(controls['chemical'])
        
        db.session.commit()
        return jsonify({'success': True, 'message': 'Knowledge base item updated'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/knowledge/<int:pest_id>', methods=['DELETE'])
@admin_required
def delete_knowledge(pest_id):
    """删除知识库条目"""
    kb = KnowledgeBase.query.get(pest_id)
    
    if not kb:
        return jsonify({'success': False, 'error': 'Item not found'}), 404
    
    try:
        db.session.delete(kb)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Knowledge base item deleted'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    """获取所有用户列表"""
    users = User.query.all()
    result = []
    for user in users:
        result.append({
            'id': str(user.id),
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'createdAt': user.created_at.isoformat() if user.created_at else None,
            'lastLogin': user.last_login.isoformat() if user.last_login else None
        })
    return jsonify({'success': True, 'data': result})


@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_stats():
    """获取管理员统计数据"""
    user_count = User.query.count()
    feedback_count = Feedback.query.count()
    recognition_count = 157  # 可以从 history 表统计
    
    # 模拟每周识别数据
    recognitions_per_day = [
        {'date': 'Mon', 'count': 20},
        {'date': 'Tue', 'count': 35},
        {'date': 'Wed', 'count': 15},
        {'date': 'Thu', 'count': 45},
        {'date': 'Fri', 'count': 25},
        {'date': 'Sat', 'count': 12},
        {'date': 'Sun', 'count': 5},
    ]
    
    return jsonify({
        'success': True,
        'userCount': user_count,
        'recognitionCount': recognition_count,
        'feedbackCount': feedback_count,
        'recognitionsPerDay': recognitions_per_day
    })


@admin_bp.route('/feedbacks', methods=['GET'])
@admin_required
def get_feedbacks():
    """获取所有反馈"""
    feedbacks = Feedback.query.order_by(Feedback.created_at.desc()).all()
    result = []
    for fb in feedbacks:
        try:
            image_urls = json.loads(fb.image_urls) if fb.image_urls else []
        except:
            image_urls = []
        
        result.append({
            'id': str(fb.id),
            'userId': fb.user_id,
            'username': fb.username,
            'text': fb.text,
            'imageUrls': image_urls,
            'status': fb.status,
            'timestamp': fb.created_at.isoformat() if fb.created_at else None
        })
    
    return jsonify({'success': True, 'data': result})


@admin_bp.route('/feedbacks/<int:feedback_id>/status', methods=['PUT'])
@admin_required
def update_feedback_status(feedback_id):
    """更新反馈状态"""
    data = request.get_json()
    status = data.get('status')
    
    if status not in ['new', 'in_review', 'resolved']:
        return jsonify({'success': False, 'error': 'Invalid status'}), 400
    
    fb = Feedback.query.get(feedback_id)
    if not fb:
        return jsonify({'success': False, 'error': 'Feedback not found'}), 404
    
    try:
        fb.status = status
        db.session.commit()
        
        try:
            image_urls = json.loads(fb.image_urls) if fb.image_urls else []
        except:
            image_urls = []
        
        return jsonify({
            'success': True,
            'data': {
                'id': str(fb.id),
                'userId': fb.user_id,
                'username': fb.username,
                'text': fb.text,
                'imageUrls': image_urls,
                'status': fb.status,
                'timestamp': fb.created_at.isoformat() if fb.created_at else None
            }
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


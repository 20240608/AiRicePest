from flask import Blueprint, request, jsonify
from models import db, KnowledgeBase, User, Feedback, History, RecognitionDetail
from utils import admin_required
from sqlalchemy import func, extract
from datetime import datetime, timedelta
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
    """获取所有用户列表 - 包含统计信息"""
    users = User.query.all()
    result = []
    for user in users:
        # 统计用户的识别次数
        recognition_count = History.query.filter_by(user_id=user.id).count()
        
        # 统计用户的反馈次数
        feedback_count = Feedback.query.filter_by(user_id=user.id).count()
        
        # 判断是否活跃（最近30天有登录）
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        is_active = user.last_login and user.last_login >= thirty_days_ago
        
        result.append({
            'id': str(user.id),
            'username': user.username,
            'email': user.email or '',
            'role': user.role,
            'recognitionCount': recognition_count,
            'feedbackCount': feedback_count,
            'isActive': is_active,
            'createdAt': user.created_at.isoformat() if user.created_at else None,
            'lastLogin': user.last_login.isoformat() if user.last_login else None
        })
    return jsonify({'success': True, 'data': result})


@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_stats():
    """获取管理员统计数据 - 真实数据"""
    # 基础统计
    total_users = User.query.count()
    total_recognitions = History.query.count()
    total_feedbacks = Feedback.query.count()
    
    # 活跃用户统计（最近30天有登录或识别记录）
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    active_users = User.query.filter(
        (User.last_login >= thirty_days_ago) | (User.recognition_count > 0)
    ).count()
    
    # 每日识别数据（最近7天）
    recognitions_per_day = []
    for i in range(6, -1, -1):
        date = (datetime.utcnow() - timedelta(days=i)).date()
        count = History.query.filter(
            func.date(History.created_at) == date
        ).count()
        day_name = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][date.weekday()]
        recognitions_per_day.append({
            'date': day_name,
            'count': count
        })
    
    # 反馈类型统计
    feedback_types_data = db.session.query(
        Feedback.feedback_type,
        func.count(Feedback.id)
    ).group_by(Feedback.feedback_type).all()
    
    feedback_types = []
    type_name_map = {
        'bug': '错误报告',
        'feature': '功能建议',
        'recognition_issue': '识别问题',
        'general': '其他'
    }
    for ftype, count in feedback_types_data:
        feedback_types.append({
            'name': type_name_map.get(ftype, ftype),
            'value': count
        })
    
    # 如果没有反馈，返回默认数据
    if not feedback_types:
        feedback_types = [
            {'name': '功能建议', 'value': 0},
            {'name': '错误报告', 'value': 0},
            {'name': '识别问题', 'value': 0},
            {'name': '其他', 'value': 0}
        ]
    
    # 月度识别趋势（最近6个月）
    monthly_data = []
    for i in range(5, -1, -1):
        target_date = datetime.utcnow() - timedelta(days=i*30)
        month_name = target_date.strftime('%m月')
        count = History.query.filter(
            extract('year', History.created_at) == target_date.year,
            extract('month', History.created_at) == target_date.month
        ).count()
        monthly_data.append({
            'month': month_name,
            'recognitions': count
        })
    
    return jsonify({
        'success': True,
        'userCount': total_users,
        'recognitionCount': total_recognitions,
        'feedbackCount': total_feedbacks,
        'activeUsers': active_users,
        'recognitionsPerDay': recognitions_per_day,
        'feedbackTypes': feedback_types,
        'monthlyData': monthly_data
    })


@admin_bp.route('/feedbacks', methods=['GET'])
@admin_required
def get_feedbacks():
    """获取所有反馈 - 包含类型信息"""
    feedbacks = Feedback.query.order_by(Feedback.created_at.desc()).all()
    result = []
    for fb in feedbacks:
        try:
            image_urls = json.loads(fb.image_urls) if fb.image_urls else []
        except:
            image_urls = []
        
        result.append({
            'id': str(fb.id),
            'userId': str(fb.user_id) if fb.user_id else None,
            'username': fb.username,
            'text': fb.text,
            'contact': fb.contact or '',
            'feedbackType': fb.feedback_type,
            'imageUrls': image_urls,
            'status': fb.status,
            'timestamp': fb.created_at.isoformat() if fb.created_at else None,
            'updatedAt': fb.updated_at.isoformat() if fb.updated_at else None
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


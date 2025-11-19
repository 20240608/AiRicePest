from flask import Blueprint, request, jsonify
from models import KnowledgeBase
import json

knowledge_bp = Blueprint('knowledge', __name__)


def split_to_array(value):
    """将文本分割为数组（支持多种分隔符）"""
    if not value:
        return []
    return [item.strip() for item in value.replace('；', ';').replace('、', ',').split(';') if item.strip()]


def comma_separated(value):
    """将逗号分隔的字符串转为数组"""
    if not value:
        return []
    return [item.strip() for item in value.split(',') if item.strip()]


@knowledge_bp.route('/knowledge', methods=['GET'])
def get_knowledge():
    """获取知识库列表（支持分页）"""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 100, type=int)
    category = request.args.get('category', None)
    
    query = KnowledgeBase.query
    
    if category and category != '全部':
        query = query.filter_by(category=category)
    
    total = query.count()
    items = query.order_by(KnowledgeBase.category, KnowledgeBase.pest_id).offset((page - 1) * limit).limit(limit).all()
    
    result = []
    for item in items:
        result.append({
            'id': str(item.pest_id),
            'category': item.category,
            'name': item.disease_name,
            'type': item.type_info or '',
            'aliases': split_to_array(item.alias_names),
            'keyFeatures': item.core_features or '',
            'affectedParts': split_to_array(item.affected_parts),
            'imageUrls': comma_separated(item.symptom_images),
            'pathogen': item.pathogen_source or '',
            'conditions': item.occurrence_conditions or '',
            'lifeCycle': item.generations_periods or '',
            'transmission': item.transmission_routes or '',
            'controls': {
                'agricultural': split_to_array(item.agricultural_control),
                'physical': split_to_array(item.physical_control),
                'biological': split_to_array(item.biological_control),
                'chemical': split_to_array(item.chemical_control),
            }
        })
    
    # 返回 result 数组（不包装在 data 字段中，frontend 直接调用 response.json()）
    return jsonify(result)


@knowledge_bp.route('/knowledge/<int:pest_id>', methods=['GET'])
def get_knowledge_by_id(pest_id):
    """获取单个知识库条目"""
    item = KnowledgeBase.query.filter_by(pest_id=pest_id).first()
    
    if not item:
        return jsonify({'success': False, 'error': 'Knowledge item not found'}), 404
    
    result = {
        'id': str(item.pest_id),
        'category': item.category,
        'name': item.disease_name,
        'type': item.type_info or '',
        'aliases': split_to_array(item.alias_names),
        'keyFeatures': item.core_features or '',
        'affectedParts': split_to_array(item.affected_parts),
        'imageUrls': comma_separated(item.symptom_images),
        'pathogen': item.pathogen_source or '',
        'conditions': item.occurrence_conditions or '',
        'lifeCycle': item.generations_periods or '',
        'transmission': item.transmission_routes or '',
        'controls': {
            'agricultural': split_to_array(item.agricultural_control),
            'physical': split_to_array(item.physical_control),
            'biological': split_to_array(item.biological_control),
            'chemical': split_to_array(item.chemical_control),
        }
    }
    
    return jsonify({
        'success': True,
        'data': result
    })


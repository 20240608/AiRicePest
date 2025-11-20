from flask import Blueprint, request, jsonify, current_app
from models import db, History, RecognitionDetail, User
from utils import token_required, get_current_user
import uuid
import json
from datetime import datetime

recognition_bp = Blueprint('recognition', __name__)


@recognition_bp.route('/history', methods=['GET'])
@token_required
def get_history():
    """返回识别历史列表 — 直接返回 array（不包装在 data 字段）"""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 50, type=int)
    
    # 获取当前用户
    user = get_current_user()

    # 如果是普通用户，只返回自己的记录
    if user and user.role != 'admin':
        query = History.query.filter_by(user_id=user.id).order_by(History.date.desc())
    else:
        query = History.query.order_by(History.date.desc())
    
    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()

    result = []
    for h in items:
        result.append({
            'id': h.id,
            'date': h.date.isoformat() if hasattr(h.date, 'isoformat') else str(h.date),
            'imageUrl': h.image_url,
            'diseaseName': h.disease_name,
            'confidence': float(h.confidence) if h.confidence is not None else 0,
        })

    return jsonify(result)


@recognition_bp.route('/recognitions/<string:recog_id>', methods=['GET'])
@token_required
def get_recognition_detail(recog_id):
    """返回单个识别结果详情 — 返回不包装的数据对象"""
    r = RecognitionDetail.query.get(recog_id)
    if not r:
        return jsonify({'success': False, 'error': 'Recognition not found'}), 404

    # 解析 solution_steps 字段（JSON 或换行分隔）
    steps = []
    if r.solution_steps:
        try:
            steps = json.loads(r.solution_steps)
        except Exception:
            steps = [s.strip() for s in str(r.solution_steps).split('\n') if s.strip()]

    data = {
        'id': r.id,
        'diseaseName': r.disease_name,
        'confidence': float(r.confidence) if r.confidence is not None else 0,
        'description': r.description or '',
        'cause': r.cause or '',
        'solution': {
            'title': r.solution_title or 'Control Measures',
            'steps': steps,
        },
        'imageUrl': r.image_url or '',
    }

    return jsonify(data)


@recognition_bp.route('/recognize', methods=['POST'])
@token_required
def recognize_image():
    """接收上传图片并创建一个模拟的识别结果（演示用）"""
    # 获取当前用户
    user = get_current_user()
    user_id = user.id if user else None
    
    # 支持 multipart/form-data 上传文件，或 JSON body with imageUrl
    image_url = None
    if 'file' in request.files:
        f = request.files['file']
        # 简单保存到 static/uploads
        from werkzeug.utils import secure_filename
        import os
        upload_dir = current_app.static_folder or 'static'
        upload_dir = os.path.join(upload_dir, 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        filename = secure_filename(f.filename or f"img_{uuid.uuid4().hex}.jpg")
        path = os.path.join(upload_dir, filename)
        f.save(path)
        image_url = f"/static/uploads/{filename}"
    else:
        body = request.get_json(silent=True) or {}
        image_url = body.get('imageUrl')

    # 生成模拟识别结果（实际应调用模型）
    recog_id = uuid.uuid4().hex
    disease_name = 'Unknown Disease'
    confidence = 75.0
    description = 'Auto-generated recognition result.'
    cause = ''
    solution_title = 'Suggested measures'
    solution_steps = json.dumps(['Observe field', 'Consult expert'])

    rd = RecognitionDetail(
        id=recog_id,
        user_id=user_id,
        disease_name=disease_name,
        confidence=confidence,
        description=description,
        cause=cause,
        solution_title=solution_title,
        solution_steps=solution_steps,
        image_url=image_url or ''
    )

    # 同时写入 history
    hist = History(
        id=uuid.uuid4().hex[:32],
        user_id=user_id,
        date=datetime.utcnow().date(),
        image_url=image_url or '',
        disease_name=disease_name,
        confidence=confidence
    )

    try:
        db.session.add(rd)
        db.session.add(hist)
        
        # 更新用户识别计数
        if user:
            user.recognition_count = (user.recognition_count or 0) + 1
            user.last_login = datetime.utcnow()
        
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

    return jsonify({'success': True, 'data': {'id': recog_id, 'diseaseName': disease_name, 'confidence': confidence, 'imageUrl': image_url}})

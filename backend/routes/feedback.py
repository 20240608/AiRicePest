from flask import Blueprint, request, jsonify, current_app
from models import db, Feedback, User
from utils import token_required, get_current_user
import json
import os
import uuid
from werkzeug.utils import secure_filename

feedback_bp = Blueprint('feedback', __name__)


@feedback_bp.route('/feedback', methods=['POST'])
@token_required
def submit_feedback():
    """提交反馈 — 支持 JSON body 或 multipart/form-data 上传图片"""
    # 获取当前用户
    user = get_current_user()
    user_id = user.id if user else None
    username = user.username if user else 'anonymous'

    # 尝试从 multipart 表单读取字段
    if request.content_type and 'multipart/form-data' in request.content_type:
        text = request.form.get('text')
        contact = request.form.get('contact', '')
        feedback_type = request.form.get('feedbackType', 'general')
        images = request.files.getlist('images')  # 多个文件

        # 保存图片到 static/uploads
        image_urls = []
        if images:
            upload_dir = current_app.static_folder or 'static'
            upload_dir = os.path.join(upload_dir, 'uploads')
            os.makedirs(upload_dir, exist_ok=True)
            for img in images:
                if img.filename:
                    filename = secure_filename(img.filename or f"fb_{uuid.uuid4().hex}.jpg")
                    path = os.path.join(upload_dir, filename)
                    img.save(path)
                    image_urls.append(f"/static/uploads/{filename}")
    else:
        # JSON body
        data = request.get_json()
        text = data.get('text')
        contact = data.get('contact', '')
        feedback_type = data.get('feedbackType', 'general')
        image_urls = data.get('imageUrls', [])

    if not text:
        return jsonify({'success': False, 'error': 'Feedback text is required'}), 400

    try:
        fb = Feedback(
            user_id=user_id,
            username=username,
            text=text,
            contact=contact,
            feedback_type=feedback_type,
            image_urls=json.dumps(image_urls) if image_urls else '[]',
            status='new'
        )
        db.session.add(fb)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Feedback submitted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


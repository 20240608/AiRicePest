import json
import os
import uuid
from datetime import datetime, timezone

from flask import Blueprint, request, jsonify, current_app

from models import db, History, RecognitionDetail
from pth.service import predict
from utils import token_required, get_current_user

recognition_bp = Blueprint('recognition', __name__)


DISEASE_DETAILS = {
    'Bacterialblight': {
        'display_name': '水稻白叶枯病',
        'reason': '由黄单胞杆菌感染引起，雨季或机械伤口易造成侵染，偏施氮肥会加重病情。',
        'suggestion': '及时喷施噻枯唑或叶枯唑，注意田间排水并减少氮肥、增加钾肥。',
        'description': '白叶枯病主要危害水稻叶片，病斑从叶尖沿叶缘扩展，严重时整叶枯黄。',
        'solution_title': '综合防治建议',
        'steps': [
            '发病初期喷施叶枯唑、噻枯唑等细菌性药剂',
            '雨后及时排水并清除田间残叶',
            '合理施肥，控制氮肥、补充钾肥',
            '选用抗病品种并注意种子消毒',
        ],
    },
    'Blast': {
        'display_name': '水稻稻瘟病',
        'reason': '稻瘟病菌在高温高湿条件下迅速蔓延，密植与偏施氮肥是诱因。',
        'suggestion': '喷施三环唑或稻瘟灵，改善通风并科学灌溉，降低田间湿度。',
        'description': '稻瘟病可侵染叶片、穗颈等部位，形成梭形灰白病斑，严重影响产量。',
        'solution_title': '田间管理建议',
        'steps': [
            '发病初期用三环唑、稻瘟灵等药剂轮换使用',
            '控制氮肥、增施磷钾肥提升抗性',
            '保持田间干湿交替，减少长期深灌',
            '清除病残体并加强通风透光',
        ],
    },
    'Brownspot': {
        'display_name': '水稻褐斑病',
        'reason': '褐斑病多在缺钾、缺硅或老叶上发生，阴雨或低温高湿更易暴发。',
        'suggestion': '喷施多菌灵或咪鲜胺，同时补施钾肥和硅肥以增强叶片强度。',
        'description': '褐斑病在叶片形成圆形或椭圆形褐色病斑，严重时叶片早枯。',
        'solution_title': '营养与药剂防控',
        'steps': [
            '喷洒多菌灵、咪鲜胺等广谱杀菌剂',
            '增施有机肥及钾、硅肥提升抗病力',
            '改善排水并减少田间长期积水',
        ],
    },
    'Healthy': {
        'display_name': '健康水稻叶片',
        'reason': '当前图像未检测到明显病斑特征，植株状态良好。',
        'suggestion': '继续保持合理密植与科学施肥，注意田间巡查做到早发现早防控。',
        'description': '叶片色泽正常、无病斑或虫咬痕迹，属于健康状态。',
        'solution_title': '日常养护建议',
        'steps': [
            '按需施肥，避免一次性大量施氮',
            '保持田间良好排水和通风',
            '定期巡田，监测虫害与病斑变化',
        ],
    },
    'Tungro': {
        'display_name': '水稻黄矮病（Tungro）',
        'reason': '由稻瘟矮缩病毒与叶蝉传播造成，幼苗期被害后植株矮化、叶色黄化。',
        'suggestion': '及时防控叶蝉（呋喃丹/吡虫啉），拔除严重病株并育秧期覆盖防虫网。',
        'description': '黄矮病使叶片呈橙黄或铜色，植株生长受阻，常在虫源密度高的田块爆发。',
        'solution_title': '病毒病综合治理',
        'steps': [
            '加强虫害监测，喷施吡虫啉控制叶蝉',
            '拔除病株集中销毁，降低田间毒源',
            '秧田覆盖防虫网或喷洒防虫剂',
            '合理施肥、增强植株抗逆力',
        ],
    },
}

# 反向映射：显示名称 -> 键
REVERSE_DISEASE_MAP = {v['display_name']: k for k, v in DISEASE_DETAILS.items()}

DEFAULT_DETAIL = {
    'display_name': '未知病害',
    'reason': '图像未匹配到既有病害特征，建议进一步人工复检。',
    'suggestion': '请联系农技人员或重新拍摄清晰图像后再上传。',
    'description': '模型无法确定疾病类别。',
    'solution_title': '通用建议',
    'steps': ['保持田间通风干燥', '密切观察病斑变化', '必要时送检实验室确认'],
}


def _resolve_public_base_url() -> str:
    """Determine the absolute base URL for constructing image links."""
    config = current_app.config
    explicit = config.get('PUBLIC_STATIC_BASE_URL') or config.get('PUBLIC_BASE_URL')
    if explicit:
        return explicit.rstrip('/')

    forwarded_host = request.headers.get('X-Forwarded-Host')
    if forwarded_host:
        scheme = request.headers.get('X-Forwarded-Proto') or request.scheme
        forwarded_port = request.headers.get('X-Forwarded-Port')
        host_value = forwarded_host
        if forwarded_port and ':' not in host_value and forwarded_port not in {'80', '443'}:
            host_value = f"{host_value}:{forwarded_port}"
        return f"{scheme}://{host_value}".rstrip('/')

    return request.host_url.rstrip('/')


def build_public_image_url(path: str | None) -> str:
    """Convert stored relative image path to an absolute URL consumable by the frontend."""
    if not path:
        return ''
    if path.startswith(('http://', 'https://')):
        return path

    base_url = _resolve_public_base_url()
    normalized_path = path if path.startswith('/') else f'/{path}'
    return f"{base_url}{normalized_path}"


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
        # 尝试获取 diseaseKey
        disease_key = REVERSE_DISEASE_MAP.get(h.disease_name, 'Unknown')
        
        result.append({
            'id': h.id,
            'date': h.date.isoformat() if hasattr(h.date, 'isoformat') else str(h.date),
            'imageUrl': build_public_image_url(h.image_url),
            'imagePath': h.image_url,
            'diseaseName': h.disease_name,
            'diseaseKey': disease_key,
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

    # 尝试获取 diseaseKey
    disease_key = REVERSE_DISEASE_MAP.get(r.disease_name, 'Unknown')

    data = {
        'id': r.id,
        'diseaseName': r.disease_name,
        'diseaseKey': disease_key,
        'confidence': float(r.confidence) if r.confidence is not None else 0,
        'description': r.description or '',
        'cause': r.cause or '',
        'solution': {
            'title': r.solution_title or 'Control Measures',
            'steps': steps,
        },
        'imageUrl': build_public_image_url(r.image_url),
        'imagePath': r.image_url or '',
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
    saved_file_path = None
    if 'file' in request.files:
        f = request.files['file']
        # 简单保存到 static/uploads
        from werkzeug.utils import secure_filename
        upload_dir = current_app.static_folder or 'static'
        upload_dir = os.path.join(upload_dir, 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        
        # 生成带时间戳和UID的文件名
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        uid_part = f"_{user_id}" if user_id else "_anon"
        original_ext = os.path.splitext(f.filename)[1] if f.filename else ".jpg"
        if not original_ext:
            original_ext = ".jpg"
            
        filename = secure_filename(f"img_{timestamp}{uid_part}_{uuid.uuid4().hex[:8]}{original_ext}")
        
        path = os.path.join(upload_dir, filename)
        f.save(path)
        saved_file_path = path
        image_url = f"/static/uploads/{filename}"
    else:
        body = request.get_json(silent=True) or {}
        image_url = body.get('imageUrl')

    stored_image_path = image_url or ''
    public_image_url = build_public_image_url(stored_image_path)

    class_names = current_app.config.get('MODEL_LABELS') or []
    weights_path = current_app.config.get('MODEL_WEIGHTS_PATH')

    if not weights_path or not os.path.exists(weights_path):
        current_app.logger.error('Model weights file is missing. Checked path: %s', weights_path)
        return jsonify({'success': False, 'error': 'Model weights file is missing on the server'}), 500

    if saved_file_path:
        try:
            disease_name, confidence = predict(saved_file_path, weights_path, class_names)
        except FileNotFoundError:
            current_app.logger.exception('Model weights file not found at %s', weights_path)
            return jsonify({'success': False, 'error': 'Model weights file not found on server'}), 500
        except Exception as exc:
            current_app.logger.exception('Image recognition failed')
            return jsonify({'success': False, 'error': f'Image recognition failed: {exc}'}), 500
    else:
        disease_name = 'Unknown Disease'
        confidence = 0.0

    confidence_value = round(float(confidence), 2)

    detail = DISEASE_DETAILS.get(disease_name, DEFAULT_DETAIL)
    display_name = detail.get('display_name', disease_name)
    reason_text = detail.get('reason', '')
    suggestion_text = detail.get('suggestion', '')
    description = detail.get('description', '')
    solution_title = detail.get('solution_title', 'Control Measures')
    solution_steps_list = detail.get('steps', [])
    solution_steps = json.dumps(solution_steps_list)

    recog_id = uuid.uuid4().hex

    rd = RecognitionDetail(
        id=recog_id,
        user_id=user_id,
        disease_name=display_name,
        confidence=confidence_value,
        description=description,
        cause=reason_text,
        solution_title=solution_title,
        solution_steps=solution_steps,
        image_url=stored_image_path
    )

    # 同时写入 history
    hist = History(
        id=recog_id,
        user_id=user_id,
        date=datetime.now(timezone.utc).date(),
        image_url=stored_image_path,
        disease_name=display_name,
        confidence=confidence_value
    )

    try:
        db.session.add(rd)
        db.session.add(hist)
        
        # 更新用户识别计数
        if user:
            user.recognition_count = (user.recognition_count or 0) + 1
            user.last_login = datetime.now(timezone.utc)
        
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

    response_data = {
        'id': recog_id,
        'diseaseName': display_name,
        'diseaseKey': disease_name, # 这里 disease_name 是原始 key (e.g. Bacterialblight)
        'confidence': confidence_value,
        'description': description,
        'reason': reason_text,
        'suggestion': suggestion_text,
        'solutionSteps': solution_steps_list,
        'imageUrl': public_image_url,
        'imagePath': stored_image_path,
    }

    return jsonify({'success': True, 'data': response_data})

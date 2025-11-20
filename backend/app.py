from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from models import db
from routes.auth import auth_bp
from routes.knowledge import knowledge_bp
from routes.admin import admin_bp
from routes.feedback import feedback_bp
from routes.profile import profile_bp
from routes.recognition import recognition_bp
import os

# 获取项目根目录
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)

app = Flask(__name__, static_folder=os.path.join(BASE_DIR, 'static'))
app.config.from_object(Config)

# 启用 CORS — 增加 Next.js 本地开发端口（3000/3001）以便前端可以访问后端
CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://localhost:3001'], supports_credentials=True)

# 初始化数据库
db.init_app(app)

# 注册蓝图
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(knowledge_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(feedback_bp, url_prefix='/api')
app.register_blueprint(profile_bp, url_prefix='/api')
app.register_blueprint(recognition_bp, url_prefix='/api')


@app.route('/')
def index():
    """根路径"""
    return jsonify({
        'service': 'airicepest-backend',
        'version': '0.1.0',
        'status': 'running',
        'endpoints': {
            'health': '/api/health',
            'auth': '/api/auth/*',
            'knowledge': '/api/knowledge',
            'admin': '/api/admin/*',
            'feedback': '/api/feedback',
            'history': '/api/history',
            'recognize': '/api/recognize',
            'recognitions': '/api/recognitions/:id',
            'profile': '/api/profile'
        }
    })


@app.route('/api/health', methods=['GET'])
def health():
    """健康检查"""
    return jsonify({'ok': True, 'service': 'airicepest-backend'})


@app.route('/favicon.ico')
def favicon():
    """Favicon 处理"""
    return '', 204


# 静态文件服务 - 用于知识库图片
@app.route('/images/<path:filename>')
def serve_images(filename):
    """提供知识库图片服务"""
    images_dir = os.path.join(PARENT_DIR, 'images')
    return send_from_directory(images_dir, filename)


# 静态文件服务 - 用于上传的图片
@app.route('/static/<path:filename>')
def serve_static(filename):
    """提供上传图片服务"""
    return send_from_directory(app.static_folder, filename)


if __name__ == '__main__':
    with app.app_context():
        # 创建所有表（如果不存在）
        db.create_all()
    
    # 以 4000 端口启动以便与前端默认配置（http://localhost:4000）一致
    app.run(host='0.0.0.0', port=4000, debug=True)


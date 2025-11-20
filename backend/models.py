from sqlalchemy import Column, Integer, String, Text, Enum, DECIMAL, Date, TIMESTAMP, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
Base = declarative_base()


class User(db.Model):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(64), unique=True, nullable=False)
    email = Column(String(128))
    role = Column(Enum('user', 'admin'), nullable=False, default='user')
    password_hash = Column(String(255))  # 存储 bcrypt 哈希
    created_at = Column(TIMESTAMP, server_default=func.now())
    last_login = Column(TIMESTAMP, nullable=True)
    recognition_count = Column(Integer, default=0)  # 识别次数统计
    is_active = Column(Boolean, default=True)  # 用户是否活跃


class History(db.Model):
    __tablename__ = 'history'
    
    id = Column(String(32), primary_key=True)
    user_id = Column(Integer, nullable=True)  # 关联用户ID
    date = Column(Date, nullable=False)
    image_url = Column(String(512))
    disease_name = Column(String(128), nullable=False)
    confidence = Column(DECIMAL(5, 2), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())


class RecognitionDetail(db.Model):
    __tablename__ = 'recognition_details'
    
    id = Column(String(64), primary_key=True)
    user_id = Column(Integer, nullable=True)  # 关联用户ID
    disease_name = Column(String(128), nullable=False)
    confidence = Column(DECIMAL(5, 2), nullable=False)
    description = Column(Text)
    cause = Column(Text)
    solution_title = Column(String(256))
    solution_steps = Column(Text)  # JSON 字符串
    image_url = Column(String(512))
    created_at = Column(TIMESTAMP, server_default=func.now())


class KnowledgeBase(db.Model):
    __tablename__ = 'knowledge_base'
    
    pest_id = Column(Integer, primary_key=True)
    category = Column(String(50), nullable=False)
    disease_name = Column(String(128), nullable=False)
    type_info = Column(String(128))
    alias_names = Column(Text)
    core_features = Column(Text)
    affected_parts = Column(Text)
    symptom_images = Column(Text)  # 逗号分隔的路径
    pathogen_source = Column(Text)
    occurrence_conditions = Column(Text)
    generations_periods = Column(Text)
    transmission_routes = Column(Text)
    agricultural_control = Column(Text)
    physical_control = Column(Text)
    biological_control = Column(Text)
    chemical_control = Column(Text)


class Feedback(db.Model):
    __tablename__ = 'feedbacks'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=True)  # 改为 Integer 类型，关联用户ID
    username = Column(String(64))
    text = Column(Text, nullable=False)
    contact = Column(String(128))  # 联系方式
    image_urls = Column(Text)  # JSON 字符串
    feedback_type = Column(String(32), default='general')  # 反馈类型：bug, feature, recognition_issue, general
    status = Column(Enum('new', 'in_review', 'resolved'), nullable=False, default='new')
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())


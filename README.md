# AiRicePest - AI Rice Disease Recognition System

> **Full-Stack Web Application** for rice disease & pest identification using AI image recognition, knowledge base, and user feedback management.

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Project Overview

**AiRicePest** is a modern full-stack web application designed to help farmers and agricultural experts identify rice diseases and pests through AI-powered image recognition. The system provides:

- **Instant Disease Recognition**: Upload rice plant images and get AI-powered diagnostic results
- **Comprehensive Knowledge Base**: Browse detailed information on 18+ rice diseases and pests
- **Multi-language Support**: Interface available in English and Chinese (简体中文)
- **User Dashboard**: Track recognition history and manage user profiles
- **Admin Panel**: Manage users, feedback, and knowledge base entries
- **Theme Customization**: Choose from 4 themes (Light, Dark, Blue, Green)

---

## ✨ Features

### User Features
- 🔐 **Authentication**: Secure login/register with JWT tokens
- 📸 **Image Recognition**: Upload images for instant disease identification
- 📚 **Knowledge Base**: Explore rice disease encyclopedia with:
  - Disease symptoms & characteristics
  - Prevention methods (Agricultural, Physical, Biological, Chemical)
  - High-quality symptom images
- 📜 **History Tracking**: View past recognition results
- 💬 **Feedback System**: Submit suggestions with image attachments
- 🌐 **i18n Support**: Switch between English/Chinese
- 🎨 **Theming**: 4 color themes with dark mode

### Admin Features
- 👥 **User Management**: View, edit, and manage user accounts
- 📊 **Analytics Dashboard**: View system statistics and usage trends
- 📝 **Feedback Management**: Review and respond to user feedback
- 🗂️ **Knowledge Base CMS**: Add/edit disease entries

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: React Context API (Theme & Language providers)

### Backend (Python/Flask)
- **Framework**: [Flask 2.3](https://flask.palletsprojects.com/)
- **Language**: Python 3.11+
- **ORM**: SQLAlchemy 2.0 + Flask-SQLAlchemy
- **Authentication**: JWT (Flask-JWT-Extended + PyJWT)
- **Database Driver**: PyMySQL
- **CORS**: Flask-CORS
- **Password Hashing**: bcrypt

### Database
- **Type**: MariaDB / MySQL 5.7+
- **Tables**: users, history, recognition_details, knowledge_base, feedbacks
- **Pre-seeded Data**: 18 rice diseases/pests with full metadata

### Development Tools
- **Node.js**: 20.x+
- **Python**: 3.11+
- **Package Manager**: npm (frontend), pip (backend)
- **Environment Variables**: dotenv
- **Version Control**: Git

---

## 📂 Project Structure

```
airicepest/
├── app/                      # Next.js App Router pages
│   ├── sign-in/              # Login page
│   ├── sign-up/              # Registration page
│   ├── home/                 # User dashboard
│   ├── knowledge/            # Disease knowledge base
│   ├── history/              # Recognition history
│   ├── result/[id]/          # Detailed result page
│   ├── feedback/             # User feedback form
│   ├── profile/              # User profile
│   ├── admin/                # Admin dashboard
│   ├── globals.css           # Global styles & theme CSS variables
│   └── layout.tsx            # Root layout
│
├── backend/                  # Python Flask API (Active Backend)
│   ├── routes/               # API route blueprints
│   │   ├── auth.py           # Login, register endpoints
│   │   ├── knowledge.py      # GET /api/knowledge
│   │   ├── recognition.py    # History, recognition detail, recognize
│   │   ├── feedback.py       # POST /api/feedback (multipart upload)
│   │   ├── profile.py        # GET/PUT /api/profile
│   │   └── admin.py          # Admin CRUD endpoints
│   ├── static/uploads/       # User-uploaded images
│   ├── models.py             # SQLAlchemy ORM models
│   ├── config.py             # Flask configuration
│   ├── utils.py              # Auth helpers (token, password hashing)
│   ├── app.py                # Flask app entry point (runs on port 4000)
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Backend environment variables
│
├── components/               # React UI components
│   ├── ui/                   # shadcn/ui components
│   ├── layout/               # Layout components (sidebar, header, nav)
│   ├── theme-switcher.tsx    # Theme selector
│   ├── language-switcher.tsx # Language toggle
│   ├── theme-provider.tsx    # Theme context
│   └── language-provider.tsx # i18n translations (zh/en)
│
├── lib/                      # Utility libraries
│   ├── api-config.ts         # API base URL & endpoints
│   └── utils.ts              # Tailwind class merge helper
│
├── public/                   # Static assets
│   └── images/               # Public images
│
├── server/                   # (Optional) TypeScript Express server
│   ├── sql/                  # Database schema & seed SQL files
│   │   ├── schema.sql        # Database table definitions
│   │   └── seed.sql          # Initial data (18 diseases/pests)
│   └── src/                  # Express routes (not actively used)
│
├── .env.local                # Frontend env (NEXT_PUBLIC_API_URL)
├── package.json              # Frontend dependencies
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript config
└── tailwind.config.js        # Tailwind CSS config
```

**Note**: The `backend/` (Python Flask) folder is the **active backend**. The `server/` (TypeScript Express) folder contains SQL schemas and is optional/legacy.

---

## 🚀 Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **Python** 3.11 or higher ([Download](https://www.python.org/downloads/))
- **MariaDB** or **MySQL** 5.7+ ([Download MariaDB](https://mariadb.org/download/))
- **Git** (for cloning repository)

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd airicepest
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

**Recommended**: Use a Python virtual environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### Step 4: Setup Database

1. **Create Database**:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE airicepest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

2. **Import Schema**:

```bash
mysql -u root -p airicepest < server/sql/schema.sql
```

3. **Import Seed Data** (18 diseases/pests):

```bash
mysql -u root -p airicepest < server/sql/seed.sql
```

---

## ⚙️ Configuration

### Frontend Configuration

Create `.env.local` in the project root:

```env
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend Configuration

Update `backend/.env`:

```env
# Database Configuration
DB_USER=root
DB_PASS=your_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=airicepest

# JWT Secret Key (generate a secure random string)
SECRET_KEY=your-super-secret-jwt-key-change-in-production
```

**Generate a secure SECRET_KEY**:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## 🎮 Usage

### Development Mode

**Terminal 1 - Start Backend** (Python Flask on port 4000):

```bash
cd backend
python app.py
```

Backend will run at: **http://localhost:4000**

**Terminal 2 - Start Frontend** (Next.js on port 3000):

```bash
npm run dev
```

Frontend will run at: **http://localhost:3000**

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Health Check**: http://localhost:4000/api/health

### Default Test Accounts

After importing `server/sql/seed.sql`, you can login with:

**Regular User**:
- Username: `farmer_john`
- Password: `password123` (or any password if migrated)

**Admin User**:
- Username: `admin`
- Password: `admin123`

### Production Build

**Build Frontend**:

```bash
npm run build
npm start
```

**Run Backend in Production**:

Update `backend/app.py` to disable debug mode:

```python
app.run(host='0.0.0.0', port=4000, debug=False)
```

Use a production WSGI server like **Gunicorn**:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:4000 app:app
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### User Endpoints (Require JWT Token)
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update user info
- `GET /api/knowledge` - Get knowledge base list
- `GET /api/knowledge/:id` - Get disease detail
- `POST /api/recognize` - Upload image for recognition
- `GET /api/history` - Get recognition history
- `GET /api/recognitions/:id` - Get specific result detail
- `POST /api/feedback` - Submit feedback (supports file upload)

### Admin Endpoints (Require Admin Role)
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/feedbacks` - Get all feedback
- `PUT /api/admin/feedbacks/:id/status` - Update feedback status
- `POST /api/admin/knowledge` - Create knowledge entry
- `PUT /api/admin/knowledge/:id` - Update knowledge entry
- `DELETE /api/admin/knowledge/:id` - Delete knowledge entry

### Utility
- `GET /api/health` - Health check
- `GET /` - API service info

**API Request Format**:

All authenticated requests must include JWT token in header:

```http
Authorization: Bearer <your-jwt-token>
```

**Example cURL Request**:

```bash
curl -X GET http://localhost:4000/api/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🐛 Troubleshooting

### Frontend Issues

**Issue**: `Module not found` errors

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Port 3000 already in use

**Solution**:
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

**Issue**: API requests fail with CORS error

**Solution**: Ensure backend CORS is configured for `http://localhost:3000` in `backend/app.py`

### Backend Issues

**Issue**: `Import "flask" could not be resolved`

**Solution**: Activate virtual environment and reinstall dependencies:
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Issue**: Database connection error

**Solution**:
1. Verify MariaDB/MySQL is running: `mysql -u root -p`
2. Check credentials in `backend/.env`
3. Ensure database exists: `SHOW DATABASES;`

**Issue**: Port 4000 already in use

**Solution**:
```bash
lsof -ti:4000 | xargs kill -9
```

### Database Issues

**Issue**: Table doesn't exist

**Solution**: Re-import schema:
```bash
mysql -u root -p airicepest < server/sql/schema.sql
mysql -u root -p airicepest < server/sql/seed.sql
```

**Issue**: Character encoding errors

**Solution**: Ensure database uses UTF-8:
```sql
ALTER DATABASE airicepest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Common Environment Issues

**Issue**: `.env` file not loaded

**Solution**: 
- Frontend: File must be named `.env.local` (not `.env`)
- Backend: Ensure `python-dotenv` is installed and `load_dotenv()` is called

**Issue**: JWT token expired

**Solution**: Login again to get a new token. Token expires after 24 hours.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact & Support

For questions or support, please:
- Open an issue on GitHub
- Contact: [your-email@example.com]

---

**Built with ❤️ for the agricultural community**

---

# 水稻病虫害AI识别系统 (AiRicePest)

> **全栈Web应用** - 基于AI图像识别的水稻病虫害诊断系统，集成知识库与用户反馈管理

---

## 📖 目录

- [项目概述](#-项目概述)
- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [项目结构](#-项目结构)
- [安装步骤](#-安装步骤)
- [配置说明](#-配置说明)
- [使用指南](#-使用指南)
- [API接口](#-api接口)
- [常见问题](#-常见问题)
- [参与贡献](#-参与贡献)
- [开源协议](#-开源协议)

---

## 🌟 项目概述

**AiRicePest** 是一款现代化的全栈Web应用，旨在帮助农民和农业专家通过AI图像识别技术快速诊断水稻病虫害。系统提供：

- **即时病害识别**：上传水稻图片获取AI诊断结果
- **全面知识库**：浏览18+种水稻病虫害详细信息
- **多语言支持**：中英文界面自由切换
- **用户仪表板**：追踪识别历史和管理个人资料
- **管理后台**：用户、反馈、知识库的管理功能
- **主题定制**：4种主题（浅色、深色、蓝色、绿色）可选

---

## ✨ 功能特性

### 用户功能
- 🔐 **用户认证**：基于JWT的安全登录/注册
- 📸 **图像识别**：上传图片即时识别病虫害
- 📚 **知识库**：探索水稻病害百科全书，包含：
  - 病害症状与特征描述
  - 防治措施（农业、物理、生物、化学防治）
  - 高清症状图片
- 📜 **历史记录**：查看过往识别结果
- 💬 **反馈系统**：提交建议并支持图片附件
- 🌐 **国际化**：中英文界面切换
- 🎨 **主题切换**：4种配色主题含深色模式

### 管理员功能
- 👥 **用户管理**：查看、编辑和管理用户账户
- 📊 **数据分析**：查看系统统计和使用趋势
- 📝 **反馈管理**：审核和回复用户反馈
- 🗂️ **知识库CMS**：添加/编辑病害条目

---

## 🛠️ 技术栈

### 前端
- **框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **语言**: TypeScript
- **样式**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI组件**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **图标**: [Lucide React](https://lucide.dev/)
- **图表**: [Recharts](https://recharts.org/)
- **状态管理**: React Context API（主题与语言提供器）

### 后端 (Python/Flask)
- **框架**: [Flask 2.3](https://flask.palletsprojects.com/)
- **语言**: Python 3.11+
- **ORM**: SQLAlchemy 2.0 + Flask-SQLAlchemy
- **认证**: JWT (Flask-JWT-Extended + PyJWT)
- **数据库驱动**: PyMySQL
- **跨域**: Flask-CORS
- **密码哈希**: bcrypt

### 数据库
- **类型**: MariaDB / MySQL 5.7+
- **数据表**: users, history, recognition_details, knowledge_base, feedbacks
- **预置数据**: 18种水稻病虫害完整元数据

### 开发工具
- **Node.js**: 20.x+
- **Python**: 3.11+
- **包管理器**: npm（前端）、pip（后端）
- **环境变量**: dotenv
- **版本控制**: Git

---

## 📂 项目结构

```
airicepest/
├── app/                      # Next.js App Router 页面
│   ├── sign-in/              # 登录页面
│   ├── sign-up/              # 注册页面
│   ├── home/                 # 用户首页
│   ├── knowledge/            # 病害知识库
│   ├── history/              # 识别历史
│   ├── result/[id]/          # 详细结果页
│   ├── feedback/             # 用户反馈表单
│   ├── profile/              # 个人资料
│   ├── admin/                # 管理后台
│   ├── globals.css           # 全局样式与主题CSS变量
│   └── layout.tsx            # 根布局
│
├── backend/                  # Python Flask API（活跃后端）
│   ├── routes/               # API路由蓝图
│   │   ├── auth.py           # 登录、注册接口
│   │   ├── knowledge.py      # GET /api/knowledge
│   │   ├── recognition.py    # 历史、识别详情、识别接口
│   │   ├── feedback.py       # POST /api/feedback（支持文件上传）
│   │   ├── profile.py        # GET/PUT /api/profile
│   │   └── admin.py          # 管理员CRUD接口
│   ├── static/uploads/       # 用户上传图片存储
│   ├── models.py             # SQLAlchemy ORM模型
│   ├── config.py             # Flask配置
│   ├── utils.py              # 认证辅助函数（token、密码哈希）
│   ├── app.py                # Flask应用入口（4000端口）
│   ├── requirements.txt      # Python依赖
│   └── .env                  # 后端环境变量
│
├── components/               # React UI组件
│   ├── ui/                   # shadcn/ui组件
│   ├── layout/               # 布局组件（侧边栏、头部、导航）
│   ├── theme-switcher.tsx    # 主题选择器
│   ├── language-switcher.tsx # 语言切换
│   ├── theme-provider.tsx    # 主题上下文
│   └── language-provider.tsx # i18n翻译（中/英）
│
├── lib/                      # 工具库
│   ├── api-config.ts         # API基础URL与端点
│   └── utils.ts              # Tailwind类合并助手
│
├── public/                   # 静态资源
│   └── images/               # 公共图片
│
├── server/                   # （可选）TypeScript Express服务器
│   ├── sql/                  # 数据库架构与种子SQL文件
│   │   ├── schema.sql        # 数据表定义
│   │   └── seed.sql          # 初始数据（18种病虫害）
│   └── src/                  # Express路由（未启用）
│
├── .env.local                # 前端环境变量（NEXT_PUBLIC_API_URL）
├── package.json              # 前端依赖
├── next.config.ts            # Next.js配置
├── tsconfig.json             # TypeScript配置
└── tailwind.config.js        # Tailwind CSS配置
```

**注意**：`backend/`（Python Flask）文件夹是**活跃后端**。`server/`（TypeScript Express）文件夹包含SQL架构，可选/遗留。

---

## 🚀 安装步骤

### 前置要求

确保已安装以下软件：

- **Node.js** 20.x 或更高版本 ([下载](https://nodejs.org/))
- **Python** 3.11 或更高版本 ([下载](https://www.python.org/downloads/))
- **MariaDB** 或 **MySQL** 5.7+ ([下载MariaDB](https://mariadb.org/download/))
- **Git**（用于克隆仓库）

### 步骤 1：克隆仓库

```bash
git clone <仓库地址>
cd airicepest
```

### 步骤 2：安装前端依赖

```bash
npm install
```

### 步骤 3：安装后端依赖

```bash
cd backend
pip install -r requirements.txt
cd ..
```

**推荐**：使用Python虚拟环境：

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 步骤 4：配置数据库

1. **创建数据库**：

```bash
mysql -u root -p
```

```sql
CREATE DATABASE airicepest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

2. **导入数据表结构**：

```bash
mysql -u root -p airicepest < server/sql/schema.sql
```

3. **导入种子数据**（18种病虫害）：

```bash
mysql -u root -p airicepest < server/sql/seed.sql
```

---

## ⚙️ 配置说明

### 前端配置

在项目根目录创建 `.env.local` 文件：

```env
# 前端环境变量
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 后端配置

更新 `backend/.env` 文件：

```env
# 数据库配置
DB_USER=root
DB_PASS=你的密码
DB_HOST=localhost
DB_PORT=3306
DB_NAME=airicepest

# JWT密钥（生成安全随机字符串）
SECRET_KEY=your-super-secret-jwt-key-change-in-production
```

**生成安全的 SECRET_KEY**：

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## 🎮 使用指南

### 开发模式

**终端 1 - 启动后端**（Python Flask 在4000端口）：

```bash
cd backend
python app.py
```

后端运行于：**http://localhost:4000**

**终端 2 - 启动前端**（Next.js 在3000端口）：

```bash
npm run dev
```

前端运行于：**http://localhost:3000**

### 访问应用

- **前端**: http://localhost:3000
- **后端API**: http://localhost:4000
- **API健康检查**: http://localhost:4000/api/health

### 默认测试账户

导入 `server/sql/seed.sql` 后，可使用以下账户登录：

**普通用户**：
- 用户名：`farmer_john`
- 密码：`password123`（或任意密码，如已迁移）

**管理员用户**：
- 用户名：`admin`
- 密码：`admin123`

### 生产环境构建

**构建前端**：

```bash
npm run build
npm start
```

**生产环境运行后端**：

修改 `backend/app.py` 禁用调试模式：

```python
app.run(host='0.0.0.0', port=4000, debug=False)
```

使用生产级WSGI服务器如 **Gunicorn**：

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:4000 app:app
```

---

## 🔌 API接口

### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

### 用户接口（需JWT Token）
- `GET /api/profile` - 获取当前用户资料
- `PUT /api/profile` - 更新用户信息
- `GET /api/knowledge` - 获取知识库列表
- `GET /api/knowledge/:id` - 获取病害详情
- `POST /api/recognize` - 上传图片识别
- `GET /api/history` - 获取识别历史
- `GET /api/recognitions/:id` - 获取具体结果详情
- `POST /api/feedback` - 提交反馈（支持文件上传）

### 管理员接口（需管理员权限）
- `GET /api/admin/stats` - 获取系统统计数据
- `GET /api/admin/users` - 获取所有用户
- `PUT /api/admin/users/:id` - 更新用户
- `DELETE /api/admin/users/:id` - 删除用户
- `GET /api/admin/feedbacks` - 获取所有反馈
- `PUT /api/admin/feedbacks/:id/status` - 更新反馈状态
- `POST /api/admin/knowledge` - 创建知识库条目
- `PUT /api/admin/knowledge/:id` - 更新知识库条目
- `DELETE /api/admin/knowledge/:id` - 删除知识库条目

### 工具接口
- `GET /api/health` - 健康检查
- `GET /` - API服务信息

**API请求格式**：

所有需认证的请求必须在header中包含JWT token：

```http
Authorization: Bearer <你的jwt-token>
```

**示例 cURL 请求**：

```bash
curl -X GET http://localhost:4000/api/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🐛 常见问题

### 前端问题

**问题**：`Module not found` 错误

**解决方案**：
```bash
rm -rf node_modules package-lock.json
npm install
```

**问题**：3000端口被占用

**解决方案**：
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

**问题**：API请求失败，出现CORS错误

**解决方案**：确保后端CORS已在 `backend/app.py` 中配置 `http://localhost:3000`

### 后端问题

**问题**：`Import "flask" could not be resolved`

**解决方案**：激活虚拟环境并重新安装依赖：
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**问题**：数据库连接错误

**解决方案**：
1. 验证MariaDB/MySQL正在运行：`mysql -u root -p`
2. 检查 `backend/.env` 中的凭据
3. 确保数据库存在：`SHOW DATABASES;`

**问题**：4000端口被占用

**解决方案**：
```bash
lsof -ti:4000 | xargs kill -9
```

### 数据库问题

**问题**：表不存在

**解决方案**：重新导入架构：
```bash
mysql -u root -p airicepest < server/sql/schema.sql
mysql -u root -p airicepest < server/sql/seed.sql
```

**问题**：字符编码错误

**解决方案**：确保数据库使用UTF-8：
```sql
ALTER DATABASE airicepest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 常见环境问题

**问题**：`.env` 文件未加载

**解决方案**：
- 前端：文件必须命名为 `.env.local`（不是 `.env`）
- 后端：确保已安装 `python-dotenv` 并调用 `load_dotenv()`

**问题**：JWT token过期

**解决方案**：重新登录获取新token。Token有效期为24小时。

---

## 🤝 参与贡献

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交Pull Request

---

## 📄 开源协议

本项目采用MIT协议 - 详见 [LICENSE](LICENSE) 文件

---

## 📧 联系与支持

如有问题或需要支持，请：
- 在GitHub上提Issue
- 联系：[your-email@example.com]

---

**为农业社区用心打造 ❤️**

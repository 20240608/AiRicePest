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
- 📸 **Image Recognition**: Upload images for instant disease identification with confidence scores
- 📚 **Knowledge Base**: Explore rice disease encyclopedia with:
  - Disease symptoms & characteristics
  - Prevention methods (Agricultural, Physical, Biological, Chemical)
  - High-quality symptom images
  - Alias names and affected plant parts
- 📜 **History Tracking**: 
  - View past recognition results in card-grid layout
  - Quick access to recent 5 records in sidebar
  - Search and filter by disease name (English/中文, case-insensitive) or date
  - Detailed view with full diagnosis and treatment recommendations
  - Uploaded preview images persist on every card/detail view thanks to static storage + absolute URLs
- 💬 **Feedback System**: 
  - Submit suggestions with image attachments
  - Choose feedback type (Bug Report, Feature Request, Recognition Issue, General)
  - Provide contact information for follow-up
- 👤 **User Profile**: 
  - Track recognition count and activity status
  - View account information and registration date
  - Monitor last login timestamp
- 🌐 **i18n Support**: Switch between English/Chinese
- 🎨 **Theming**: 4 color themes with dark mode

### Admin Features
- 👥 **User Management**: 
  - View all users with registration dates and activity status
  - Track user recognition counts and last login
  - Edit user roles and delete accounts
  - Monitor active vs inactive users
- 📊 **Analytics Dashboard**: 
  - Real-time system statistics (total users, recognitions, feedback)
  - 30-day activity rate calculation
  - Daily/monthly recognition trends visualization
  - Feedback type distribution charts
  - Growth metrics and user engagement tracking
- 📝 **Feedback Management**: 
  - Review all user feedback with type filtering
  - Update feedback status (new/in_review/resolved)
  - View contact information for follow-up
  - Track feedback submission timestamps
- 🗂️ **Knowledge Base CMS**: Add/edit disease entries with multi-image support

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
- **Tables**: 
  - `users` - User accounts with recognition tracking (recognition_count, is_active)
  - `history` - Recognition history records linked to users
  - `recognition_details` - Detailed recognition results with complete diagnosis info
  - `knowledge_base` - Rice disease/pest encyclopedia (18 entries)
  - `feedbacks` - User feedback with type classification (bug/feature/recognition_issue/general)
- **Data Relationships**: 
  - Foreign keys between users and their history/recognition/feedback records
  - Automatic user activity tracking (last_login, recognition_count updates)
- **Pre-seeded Data**: 
  - 3 test user accounts (2 regular users, 1 admin)
  - 5 sample recognition records with full diagnosis details
  - 18 rice diseases/pests with comprehensive information
  - 4 sample feedback entries demonstrating different feedback types

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
│   │   ├── knowledge.py      # GET /api/knowledge (disease encyclopedia)
│   │   ├── recognition.py    # Recognition history & detail, image upload & processing
│   │   ├── feedback.py       # POST /api/feedback (with feedback_type & contact fields)
│   │   ├── profile.py        # GET/PUT /api/profile (user info with activity tracking)
│   │   └── admin.py          # Admin CRUD + real-time statistics queries
│   ├── static/uploads/       # User-uploaded images
│   ├── models.py             # SQLAlchemy ORM models with user tracking fields
│   ├── config.py             # Flask configuration
│   ├── utils.py              # Auth helpers (token, password hashing, get_current_user)
│   ├── app.py                # Flask app entry point (runs on port 4000)
│   ├── migrate_database.py   # Database migration script for schema updates
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Backend environment variables
│
├── components/               # React UI components
│   ├── ui/                   # shadcn/ui components (buttons, cards, forms, etc.)
│   ├── shared/               # Shared reusable components
│   │   ├── DiseaseCard.tsx   # Disease knowledge base card
│   │   └── HistoryCard.tsx   # Recognition history card with confidence badges
│   ├── layout/               # Layout components (sidebar, header, nav)
│   ├── admin/                # Admin dashboard components
│   │   ├── DashboardPanel.tsx  # Real-time statistics with charts
│   │   ├── UserManagement.tsx  # User CRUD with activity tracking
│   │   └── FeedbackManagement.tsx  # Feedback review with type filtering
│   ├── home/                 # Home page components
│   │   ├── app-sidebar.tsx   # Sidebar with recent history preview
│   │   ├── ai-chat.tsx       # AI chat interface
│   │   └── knowledge-base.tsx  # Knowledge carousel
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
│   │   ├── schema.sql        # Complete table definitions with foreign keys and indexes
│   │   │                     # Tables: users (with recognition_count, is_active)
│   │   │                     #         history (with user_id, created_at)
│   │   │                     #         recognition_details (with user_id, created_at)
│   │   │                     #         knowledge_base (18 diseases/pests)
│   │   │                     #         feedbacks (with feedback_type, contact, updated_at)
│   │   └── seed.sql          # Initial data with proper user relationships
│   │                         # - 3 users (2 active users + 1 admin)
│   │                         # - 5 recognition records correctly linked to users
│   │                         # - 18 diseases/pests with detailed Chinese descriptions
│   │                         # - 4 feedback samples with different types
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

## 🧹 Repository Hygiene

To keep the repo lightweight and avoid failed pushes on limited network links, the updated `.gitignore` excludes the following heavy or environment-specific assets by default:

- Frontend build/output folders such as `.next/`, `out/`, `build/`, and `dist/`
- Package manager caches (`node_modules/`, `server/node_modules/`, Yarn PnP artifacts)
- Python virtual environments (`venv/`, `backend/myenv_311/`, `.venv/`, etc.) and bytecode caches
- Generated data directories (`backend/static/uploads/`, `backend/pth/`) plus SQLite databases/logs (`backend/app.db`, `dev*.log`, `build_output*.txt`)

If you do need to share an uploaded image or model checkpoint, please move it to a versioned asset folder (e.g., `public/` or `knowledge_base/`) before committing.

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

# 模型推理配置（可选）
# 如不配置将默认使用 backend/pth/dense_net_model_50.pth
MODEL_WEIGHTS_PATH=/home/ubuntu/AiRicePest/backend/pth/dense_net_model_50.pth
# 逗号分隔的标签顺序需与训练时一致
MODEL_LABELS=Bacterialblight,Blast,Brownspot,Healthy,Tungro
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

### Serving Uploaded Images

User uploads live in `backend/static/uploads`. In production ensure:

1. The directory is readable by your web server: `sudo chmod -R o+rx /home/ubuntu /home/ubuntu/AiRicePest/backend/static/uploads`
2. Your reverse proxy exposes the folder, e.g. Nginx:

   ```nginx
   location /static/uploads/ {
     alias /home/ubuntu/AiRicePest/backend/static/uploads/;
     add_header Cache-Control "public, max-age=31536000";
   }
   ```

Front-end pages rely on `lib/utils.ts` → `buildImageUrl()` to render the correct absolute URL, so no extra rewriting is required once the folder is accessible.

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### User Endpoints (Require JWT Token)
- `GET /api/profile` - Get current user profile (includes recognition_count, is_active, last_login)
- `PUT /api/profile` - Update user info (automatically updates last_login)
- `GET /api/knowledge` - Get knowledge base list (18 diseases/pests)
- `GET /api/knowledge/:id` - Get disease detail with prevention methods
- `POST /api/recognize` - Upload image for recognition (auto-updates user recognition_count)
- `GET /api/history` - Get recognition history (filtered by user, returns only user's own records)
- `GET /api/recognitions/:id` - Get specific result detail with full diagnosis
- `POST /api/feedback` - Submit feedback (supports file upload, feedback_type, contact fields)

### Admin Endpoints (Require Admin Role)
- `GET /api/admin/stats` - Get real-time system statistics:
  - Total counts (users, recognitions, feedback)
  - 30-day activity rate calculation
  - Daily/monthly recognition trends (last 7 days, 12 months)
  - Feedback type distribution (bug/feature/recognition_issue/general)
- `GET /api/admin/users` - Get all users with activity metrics
- `PUT /api/admin/users/:id` - Update user (role, email, active status)
- `DELETE /api/admin/users/:id` - Delete user (cascades to related records)
- `GET /api/admin/feedbacks` - Get all feedback with type filtering
- `PUT /api/admin/feedbacks/:id/status` - Update feedback status (new/in_review/resolved)
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

**Issue**: Language/Theme switchers don't open

**Solution**: The Radix dropdown trigger requires the shared button component to forward refs. Confirm `components/ui/button.tsx` uses `React.forwardRef` (as in the latest code) and rebuild the frontend after editing.

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

**Issue**: `GET /static/uploads/...` returns 403 even though the file exists

**Solution**:
- Allow traversal on every parent folder: `sudo chmod o+rx /home/ubuntu /home/ubuntu/AiRicePest`
- Ensure the uploads directory is world-readable: `sudo chmod -R o+rx backend/static/uploads`
- Reload Nginx/systemd so the new permissions are picked up, then verify with `curl -I http://<host>/static/uploads/example.jpg`.

### Database Issues

**Issue**: Table doesn't exist or missing columns

**Solution**: Re-import the latest schema which includes all new fields:
```bash
# Drop existing tables if needed (WARNING: This deletes all data)
mysql -u root -p -e "DROP DATABASE IF EXISTS airicepest;"

# Create fresh database with updated schema
mysql -u root -p < server/sql/schema.sql
mysql -u root -p airicepest < server/sql/seed.sql
```

**Alternative**: Use the migration script for existing databases:
```bash
cd backend
python migrate_database.py
```

**Issue**: Foreign key constraint fails

**Solution**: Ensure user_id in history/recognition_details/feedbacks tables references valid users:
```sql
-- Check for orphaned records
SELECT * FROM history WHERE user_id NOT IN (SELECT id FROM users);
SELECT * FROM recognition_details WHERE user_id NOT IN (SELECT id FROM users);
SELECT * FROM feedbacks WHERE user_id NOT IN (SELECT id FROM users);

-- Fix by setting orphaned records to NULL or reassigning to valid user
UPDATE history SET user_id = NULL WHERE user_id NOT IN (SELECT id FROM users);
```

**Issue**: Character encoding errors

**Solution**: Ensure database uses UTF-8:
```sql
ALTER DATABASE airicepest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Shell / SQL Safety

**Issue**: Running `mysql -e "...$2b$..."` from Bash strips the `$` characters in bcrypt hashes (Bash treats `$2b` as a variable), causing "Invalid salt" errors for every affected user record.

**Solution**: Always execute SQL through `scripts/mysql-safe.sh`, which disables unsafe shell expansion and feeds your SQL to MySQL via a temporary file.

```bash
# Preferred: pipe SQL via heredoc so nothing is expanded
cat <<'SQL' | scripts/mysql-safe.sh -u airicepest -p123456789 airicepest
UPDATE users SET password_hash='$2b$12$example...' WHERE username='admin';
SQL

# One-liner variant (wrapper auto-escapes $ characters for you)
scripts/mysql-safe.sh -u airicepest -p123456789 airicepest \
  --sql "UPDATE users SET password_hash='$2b$12$example...' WHERE id=3;"
```

> The wrapper enables `set -o noglob`/`pipefail`, writes SQL to a tempfile, and keeps `$` characters intact so every bcrypt hash (and any other literal containing `$`) is stored exactly as written.

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
- 📸 **图像识别**：上传图片即时识别病虫害，附置信度评分
- 📚 **知识库**：探索水稻病害百科全书，包含：
  - 病害症状与特征描述
  - 防治措施（农业、物理、生物、化学防治）
  - 高清症状图片
  - 别名和受害部位信息
- 📜 **历史记录**：
  - 卡片网格布局查看历史识别结果
  - 侧边栏快速访问最近 5 条记录
  - 支持中英文、不区分大小写的病害名称搜索，或按日期筛选
  - 详细视图包含完整诊断和防治建议
  - 上传的预览图通过静态目录+绝对URL持久化，刷新或重新登录后仍可查看
- 💬 **反馈系统**：
  - 提交建议并支持图片附件
  - 选择反馈类型（Bug报告、功能建议、识别问题、一般反馈）
  - 提供联系方式便于跟进
- 👤 **用户资料**：
  - 追踪识别次数和活跃状态
  - 查看账户信息和注册日期
  - 监控最后登录时间
- 🌐 **国际化**：中英文界面切换
- 🎨 **主题切换**：4种配色主题含深色模式

### 管理员功能
- 👥 **用户管理**：
  - 查看所有用户的注册日期和活跃状态
  - 追踪用户识别次数和最后登录时间
  - 编辑用户角色和删除账户
  - 监控活跃用户与非活跃用户
- 📊 **数据分析**：
  - 实时系统统计数据（用户总数、识别总数、反馈总数）
  - 30天活跃率计算
  - 每日/每月识别趋势可视化
  - 反馈类型分布图表
  - 增长指标和用户参与度追踪
- 📝 **反馈管理**：
  - 查看所有用户反馈并按类型筛选
  - 更新反馈状态（新建/审核中/已解决）
  - 查看联系方式便于跟进
  - 追踪反馈提交时间戳
- 🗂️ **知识库CMS**：添加/编辑病害条目，支持多图片上传

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
- **数据表**：
  - `users` - 用户账户，包含识别追踪（recognition_count、is_active）
  - `history` - 识别历史记录，关联到用户
  - `recognition_details` - 详细识别结果，包含完整诊断信息
  - `knowledge_base` - 水稻病虫害百科（18个条目）
  - `feedbacks` - 用户反馈，包含类型分类（bug/feature/recognition_issue/general）
- **数据关系**：
  - 用户与其历史记录/识别结果/反馈之间的外键关系
  - 自动用户活动追踪（last_login、recognition_count 更新）
- **预置数据**：
  - 3个测试用户账户（2个普通用户、1个管理员）
  - 5条示例识别记录，包含完整诊断详情
  - 18种水稻病虫害的全面信息
  - 4条示例反馈，展示不同反馈类型

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

## 🧹 仓库清理

为了避免仓库体积过大导致 push 失败，`.gitignore` 已过滤以下常见的大文件或临时目录：

- 前端构建产物：`.next/`、`out/`、`build/`、`dist/`
- 包管理器缓存：`node_modules/`、`server/node_modules/`、Yarn PnP 缓存
- Python 虚拟环境与缓存：`venv/`、`backend/myenv_311/`、`.venv/`、`__pycache__/`
- 运行期生成的数据：`backend/static/uploads/`、`backend/pth/`、`backend/app.db`、`dev*.log`、`build_output*.txt`

如需共享某个上传图片或模型文件，请将其放到版本化目录（如 `public/` 或 `knowledge_base/`）后再提交。

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
- 密码：`password123`（默认，未加密的测试密码）
- 说明：有 3 条识别历史记录

**农业专家**：
- 用户名：`agri_expert`
- 密码：`password123`
- 说明：有 2 条识别历史记录

**管理员用户**：
- 用户名：`admin`
- 密码：`admin123`
- 说明：管理员权限，可访问后台管理功能

> **注意**：生产环境中，请使用 `backend/migrate_database.py` 脚本来迁移现有数据，或直接使用加密后的密码哈希值。

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

### 生产环境的图片访问

用户上传文件位于 `backend/static/uploads`。部署时请确保：

1. Web服务用户对目录有读取权限：`sudo chmod -R o+rx /home/ubuntu /home/ubuntu/AiRicePest/backend/static/uploads`
2. 反向代理放行该目录，例如 Nginx：

   ```nginx
   location /static/uploads/ {
     alias /home/ubuntu/AiRicePest/backend/static/uploads/;
     add_header Cache-Control "public, max-age=31536000";
   }
   ```

前端页面依赖 `lib/utils.ts` 中的 `buildImageUrl()` 生成绝对URL，只要目录可访问即可直接展示历史卡片中的原始图片。

---

## 🔌 API接口

### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

### 用户接口（需JWT Token）
- `GET /api/profile` - 获取当前用户资料（包括 recognition_count、is_active、last_login）
- `PUT /api/profile` - 更新用户信息（自动更新 last_login）
- `GET /api/knowledge` - 获取知识库列表（18种病虫害）
- `GET /api/knowledge/:id` - 获取病害详情及防治方法
- `POST /api/recognize` - 上传图片识别（自动更新用户 recognition_count）
- `GET /api/history` - 获取识别历史（按用户过滤，仅返回用户自己的记录）
- `GET /api/recognitions/:id` - 获取具体结果详情及完整诊断
- `POST /api/feedback` - 提交反馈（支持文件上传、feedback_type、contact字段）

### 管理员接口（需管理员权限）
- `GET /api/admin/stats` - 获取实时系统统计数据：
  - 总计数（用户、识别、反馈）
  - 30天活跃率计算
  - 每日/每月识别趋势（最近7天、12个月）
  - 反馈类型分布（bug/feature/recognition_issue/general）
- `GET /api/admin/users` - 获取所有用户及活动指标
- `PUT /api/admin/users/:id` - 更新用户（角色、邮箱、活跃状态）
- `DELETE /api/admin/users/:id` - 删除用户（级联删除相关记录）
- `GET /api/admin/feedbacks` - 获取所有反馈并按类型筛选
- `PUT /api/admin/feedbacks/:id/status` - 更新反馈状态（new/in_review/resolved）
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

**问题**：语言/主题切换器下拉无法展开

**解决方案**：Radix 下拉触发器要求通用按钮组件转发 ref。确认 `components/ui/button.tsx` 已使用 `React.forwardRef`（当前仓库代码已处理），并在修改后重新构建前端。

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

**问题**：`GET /static/uploads/...` 返回 403，但文件存在

**解决方案**：
- 给所有父目录添加执行权限：`sudo chmod o+rx /home/ubuntu /home/ubuntu/AiRicePest`
- 确保上传目录可读：`sudo chmod -R o+rx backend/static/uploads`
- 重新加载 Nginx/systemd 服务，然后使用 `curl -I http://<host>/static/uploads/example.jpg` 验证。

### 数据库问题

**问题**：表不存在或缺少列

**解决方案**：重新导入包含所有新字段的最新架构：
```bash
# 如需要可先删除现有表（警告：这将删除所有数据）
mysql -u root -p -e "DROP DATABASE IF EXISTS airicepest;"

# 使用更新的架构创建新数据库
mysql -u root -p < server/sql/schema.sql
mysql -u root -p airicepest < server/sql/seed.sql
```

**替代方案**：对现有数据库使用迁移脚本：
```bash
cd backend
python migrate_database.py
```

**问题**：外键约束失败

**解决方案**：确保 history/recognition_details/feedbacks 表中的 user_id 引用有效用户：
```sql
-- 检查孤立记录
SELECT * FROM history WHERE user_id NOT IN (SELECT id FROM users);
SELECT * FROM recognition_details WHERE user_id NOT IN (SELECT id FROM users);
SELECT * FROM feedbacks WHERE user_id NOT IN (SELECT id FROM users);

-- 通过将孤立记录设为 NULL 或重新分配给有效用户来修复
UPDATE history SET user_id = NULL WHERE user_id NOT IN (SELECT id FROM users);
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

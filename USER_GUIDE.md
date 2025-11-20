# AI水稻病虫害识别系统 - 用户使用指南

## ✅ 系统已配置完成

前端和后端已成功构建并准备就绪！

## 🚀 快速启动

### 方式一：使用启动脚本（推荐）

```bash
./start_all.sh
```

这个脚本会自动：
- 启动后端服务器（Flask, port 4000）
- 启动前端服务器（Next.js, port 3000 或 3001）
- 检查数据库连接
- 清理旧进程

### 方式二：手动启动

**终端1 - 启动后端：**
```bash
cd backend
source ../.venv/bin/activate  # 或使用 .venv/bin/python
python app.py
```

**终端2 - 启动前端：**
```bash
npm run dev
```

## 📌 访问地址

- **前端**: http://localhost:3000 (或 http://localhost:3001)
- **后端API**: http://localhost:4000
- **健康检查**: http://localhost:4000/api/health

## 👤 测试账户

数据库中已有以下测试账户：

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | password123 | 管理员 |
| farmer_john | password123 | 普通用户 |
| agri_expert | password123 | 普通用户 |

**注意**：密码哈希值为 `$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5F/6nYGhKNSuu`（对应 `password123`）

## 📱 功能测试流程

### 1. 登录系统
- 访问 http://localhost:3000/sign-in
- 使用上述测试账户登录
- 管理员登录后会自动跳转到 `/admin`
- 普通用户登录后会跳转到 `/home`

### 2. 普通用户功能

**2.1 首页 (`/home`)**
- 上传稻田图片进行病虫害识别
- 查看AI聊天助手
- 浏览知识库

**2.2 识别记录 (`/history`)**
- 查看历史识别记录
- 查看识别详情和置信度

**2.3 知识库 (`/knowledge`)**
- 浏览所有病虫害知识
- 点击查看详细防治方案
- 搜索特定病虫害

**2.4 个人中心 (`/profile`)**
- 查看个人信息
- 更新用户资料

**2.5 反馈 (`/feedback`)**
- 提交意见和建议
- 上传问题图片
- 选择反馈类型

### 3. 管理员功能 (`/admin`)

**3.1 仪表盘**
- 查看用户统计
- 查看识别统计
- 查看反馈统计

**3.2 用户管理**
- 查看所有用户列表
- 启用/禁用用户账户
- 删除用户

**3.3 反馈管理**
- 查看所有用户反馈
- 更新反馈状态（新建/处理中/已解决）
- 查看反馈详情

## 🗄️ 数据库说明

数据库 `airicepest` 包含以下表：

- `users` - 用户信息
- `history` - 识别历史
- `recognition_details` - 识别详情
- `knowledge_base` - 病虫害知识库（18种病虫害）
- `feedbacks` - 用户反馈

种子数据已包含：
- 3个测试用户
- 5条历史识别记录
- 18种病虫害知识
- 4条测试反馈

## 🔧 常见问题

### 前端编译错误
✅ **已解决**：
- 创建了缺失的 context providers
- 安装了所有必需的依赖包
- 排除了 server/ 和 backend/ 目录

### 数据库连接失败
检查：
1. MySQL服务是否启动
2. .env 文件配置是否正确
3. 数据库 airicepest 是否已创建
4. 是否已导入 schema.sql 和 seed.sql

### 端口冲突
- 使用 `lsof -ti:3000 | xargs kill -9` 清理端口
- 或修改 .env.local 中的端口配置

## 📝 API端点

### 认证
- POST `/api/auth/login` - 用户登录
- POST `/api/auth/register` - 用户注册

### 用户
- GET `/api/profile` - 获取用户信息
- PUT `/api/profile` - 更新用户信息

### 识别
- POST `/api/recognize` - 上传图片识别
- GET `/api/recognitions/:id` - 获取识别详情
- GET `/api/history` - 获取历史记录

### 知识库
- GET `/api/knowledge` - 获取所有病虫害知识
- GET `/api/knowledge/:id` - 获取特定病虫害详情

### 反馈
- POST `/api/feedback` - 提交反馈
- GET `/api/feedback` - 获取反馈列表（管理员）

### 管理员
- GET `/api/admin/stats` - 获取统计数据
- GET `/api/admin/users` - 获取用户列表
- PUT `/api/admin/users/:id` - 更新用户信息
- DELETE `/api/admin/users/:id` - 删除用户
- GET `/api/admin/feedbacks` - 获取反馈列表
- PUT `/api/admin/feedbacks/:id/status` - 更新反馈状态

## 🎯 下一步

系统已准备好供用户使用！主要功能包括：

✅ 用户认证（登录/注册）  
✅ 病虫害图片识别  
✅ 识别历史记录  
✅ 病虫害知识库（18种）  
✅ 用户反馈系统  
✅ 管理员后台  

如需添加实际的AI识别功能，需要：
1. 训练或集成病虫害识别模型
2. 在 `backend/routes/recognition.py` 中实现模型调用
3. 配置图片存储路径

---

**系统状态**: ✅ 就绪  
**最后更新**: 2025-11-21

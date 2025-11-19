# Admin Dashboard 管理员控制台

## 概述

管理员控制台是 AiRicePest 系统的后台管理界面，提供数据统计、管理员管理、用户管理和反馈管理等功能。

## 访问方式

- **路径**: `/admin`
- **权限**: 需要管理员权限（userRole = 'admin'）
- **认证**: 通过 localStorage 存储的 token 和 userRole 进行验证

## 功能模块

### 1. 数据面板 (Dashboard)

展示系统的核心统计数据：

- **统计卡片**:
  - 总用户数 & 活跃用户数
  - 累计识别次数
  - 反馈数量
  - 活跃率百分比

- **可视化图表**:
  - 月度识别趋势（柱状图）
  - 反馈类型分布（饼图）

**组件**: `components/admin/DashboardPanel.tsx`

### 2. 管理员管理 (Admin Management)

管理系统管理员账户：

**功能**:
- ✅ 查看管理员列表
- ✅ 添加新管理员
- ✅ 编辑管理员信息
- ✅ 删除管理员
- ✅ 设置管理员角色（admin / super_admin）

**字段**:
- 用户名
- 邮箱
- 密码（编辑时可选）
- 角色
- 创建时间

**组件**: `components/admin/AdminManagement.tsx`

### 3. 用户管理 (User Management)

管理系统用户账户：

**功能**:
- ✅ 查看用户列表
- ✅ 添加新用户
- ✅ 编辑用户信息
- ✅ 删除用户
- ✅ 封禁/解封用户

**字段**:
- 用户名
- 邮箱
- 手机号
- 状态（active / banned）
- 注册时间
- 最后登录时间

**组件**: `components/admin/UserManagement.tsx`

### 4. 反馈管理 (Feedback Management)

管理用户提交的反馈：

**功能**:
- ✅ 查看反馈列表
- ✅ 查看反馈详情（包括附件图片）
- ✅ 标记为已处理
- ✅ 标记为已拒绝

**字段**:
- 用户ID & 用户名
- 反馈内容
- 附件图片（可选）
- 状态（pending / processed / rejected）
- 提交时间
- 处理时间

**组件**: `components/admin/FeedbackManagement.tsx`

## API 端点

所有 API 端点都需要在请求头中包含 `Authorization: Bearer <token>`

### 统计数据
- `GET /api/admin/stats` - 获取统计数据

### 管理员管理
- `GET /api/admin/admins` - 获取管理员列表
- `POST /api/admin/admins` - 创建管理员
- `PUT /api/admin/admins/[id]` - 更新管理员
- `DELETE /api/admin/admins/[id]` - 删除管理员

### 用户管理
- `GET /api/admin/users` - 获取用户列表
- `POST /api/admin/users` - 创建用户
- `PUT /api/admin/users/[id]` - 更新用户
- `DELETE /api/admin/users/[id]` - 删除用户
- `PATCH /api/admin/users/[id]/status` - 更新用户状态

### 反馈管理
- `GET /api/admin/feedbacks` - 获取反馈列表
- `PATCH /api/admin/feedbacks/[id]/status` - 更新反馈状态

## 安全机制

### 1. 中间件保护 (Middleware)

`middleware.ts` 会拦截所有 `/admin/*` 路由：

```typescript
- 检查 cookie 中的 token 和 userRole
- 如果未授权，重定向到 /sign-in
- 记录原始路径用于登录后跳转
```

### 2. 客户端验证

`app/admin/page.tsx` 在加载时：

```typescript
- 检查 localStorage 中的 token 和 userRole
- 如果未授权，重定向到登录页
- 显示加载状态直到验证完成
```

### 3. API 验证

所有 API 端点都验证：

```typescript
- Authorization header 中的 Bearer token
- 如果缺失，返回 401 Unauthorized
```

## 技术栈

- **框架**: Next.js 16 (App Router)
- **UI 组件**: Radix UI + shadcn/ui
- **图表库**: Recharts
- **样式**: Tailwind CSS v4
- **图标**: Lucide React

## 使用说明

### 1. 本地开发

```bash
npm run dev
```

访问 `http://localhost:3000/admin`

### 2. 登录测试

为了测试，需要在登录页设置：

```javascript
localStorage.setItem('token', 'your-test-token');
localStorage.setItem('userRole', 'admin');
```

### 3. 连接真实后端

当前使用模拟数据。要连接真实后端：

1. 更新所有 API 路由文件（`app/api/admin/**/*.ts`）
2. 替换模拟数据为真实的数据库查询
3. 实现真实的 JWT token 验证
4. 添加错误处理和日志记录

## 文件结构

```
app/
├── admin/
│   ├── page.tsx          # 主页面（包含 tab 导航）
│   └── layout.tsx        # 布局配置
├── api/
│   └── admin/
│       ├── stats/route.ts
│       ├── admins/
│       ├── users/
│       └── feedbacks/
components/
├── admin/
│   ├── DashboardPanel.tsx
│   ├── AdminManagement.tsx
│   ├── UserManagement.tsx
│   └── FeedbackManagement.tsx
hooks/
└── use-toast.ts
middleware.ts             # 路由保护
```

## 后续优化建议

1. **数据库集成**: 
   - 使用 Prisma 或其他 ORM
   - 实现真实的 CRUD 操作

2. **身份验证**:
   - 实现 JWT token 验证
   - 添加 token 刷新机制
   - 实现登出功能

3. **权限管理**:
   - 实现基于角色的访问控制 (RBAC)
   - super_admin 和 admin 不同权限

4. **数据导出**:
   - 添加 CSV/Excel 导出功能
   - 报表生成

5. **搜索和过滤**:
   - 添加表格搜索功能
   - 日期范围筛选
   - 状态筛选

6. **实时更新**:
   - 使用 WebSocket 或 Server-Sent Events
   - 实时统计数据更新

7. **审计日志**:
   - 记录所有管理操作
   - 显示操作历史

## 注意事项

⚠️ **重要**:
- 当前 API 使用模拟数据，仅用于前端开发
- 生产环境需要实现真实的数据库和认证
- 密码应该使用 bcrypt 或类似库进行哈希
- 所有输入应该进行验证和清理
- 实施 HTTPS 和 CSRF 保护

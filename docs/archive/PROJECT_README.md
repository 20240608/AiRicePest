# 🌾 AI水稻病虫害识别系统

一个基于 Next.js 的智能水稻病虫害识别应用，提供 ChatGPT 风格的 AI 对话界面、图像识别、多语言支持和主题切换功能。

## ✨ 功能特点

### 🤖 AI 智能识别
- **图像上传识别**：支持 JPG/PNG 格式，上传图片即可智能诊断病虫害
- **ChatGPT 风格界面**：类似 ChatGPT 的对话式交互体验
- **实时结果展示**：显示病害名称、置信度、病因分析和防治建议
- **详细诊断报告**：包含症状描述、参考图片和防治方案

### 📚 知识库系统
- **病虫害百科**：网格布局展示常见水稻病虫害信息
- **分类筛选**：支持按真菌病害、细菌病害、虫害分类查看
- **智能搜索**：快速搜索病害名称和描述
- **轮播展示**：首页知识库卡片轮播，支持"换一批"功能

### 📊 历史管理
- **识别记录**：表格展示所有历史识别记录
- **搜索过滤**：支持按日期、病害名称搜索
- **分页显示**：每页 10 条记录，支持翻页
- **快速查看**：点击记录查看详细诊断结果

### 👤 用户中心
- **个人资料编辑**：修改用户名、邮箱
- **头像上传**：支持自定义头像
- **密码修改**：安全的密码更新功能
- **统计信息**：显示注册时间、识别次数

### 💬 反馈系统
- **文字反馈**：最多 200 字的文本输入
- **图片上传**：最多上传 3 张截图或照片
- **结果反馈**：在识别结果页面快速提交反馈
- **独立反馈页**：全页面表单提交通用反馈

### 🎨 界面定制
- **主题切换**：支持 4 种主题（浅色、深色、蓝色、绿色）
- **持久化存储**：主题选择自动保存到 localStorage
- **平滑过渡**：主题切换带有过渡动画效果

### 👨‍💼 管理后台
- **数据面板**：统计用户数、识别次数、反馈数量
- **用户管理**：查看、编辑、删除用户信息
- **管理员管理**：管理系统管理员账户
- **反馈管理**：查看和处理用户反馈

## 🛠 技术栈

### 前端框架
- **Next.js 16.0.3**：React 全栈框架，使用 App Router
- **React 19**：最新版本 React
- **TypeScript**：类型安全的 JavaScript

### UI 组件库
- **shadcn/ui**：基于 Radix UI 的组件库
  - Dialog, Dropdown Menu, Avatar, Card, Button
  - Input, Textarea, Select, Switch, Tabs
  - Table, Alert, Badge, Separator, Tooltip
  - Sidebar, ScrollArea, Collapsible
- **Lucide React**：现代化图标库

### 样式工具
- **Tailwind CSS v4**：实用优先的 CSS 框架
- **CSS 变量**：支持动态主题切换

### 数据可视化
- **Recharts 3.4.1**：管理后台数据图表展示

## 📁 项目结构

```
airicepest/
├── app/                          # Next.js App Router 页面
│   ├── layout.tsx               # 根布局（包含 ThemeProvider）
│   ├── page.tsx                 # 首页（重定向到登录）
│   ├── sign-in/                 # 登录页面
│   ├── sign-up/                 # 注册页面
│   ├── forgot-password/         # 忘记密码
│   ├── home/                    # 主页（AI 对话界面）
│   │   └── page.tsx
│   ├── history/                 # 识别历史
│   │   └── page.tsx
│   ├── result/[id]/            # 识别结果详情
│   │   └── page.tsx
│   ├── feedback/                # 反馈页面
│   │   └── page.tsx
│   ├── profile/                 # 个人中心
│   │   └── page.tsx
│   ├── knowledge/               # 知识库
│   │   └── page.tsx
│   ├── admin/                   # 管理后台
│   │   ├── page.tsx
│   │   └── layout.tsx
│   └── api/                     # API 路由
│       ├── auth/                # 认证接口
│       │   ├── login/
│       │   └── register/
│       ├── recognize/           # 图像识别
│       ├── history/             # 历史记录
│       ├── result/[id]/        # 结果详情
│       ├── diseases/            # 病害列表
│       ├── feedback/            # 反馈提交
│       ├── user/                # 用户相关
│       │   ├── profile/
│       │   └── avatar/
│       └── admin/               # 管理接口
│           ├── stats/
│           ├── admins/
│           ├── users/
│           └── feedbacks/
├── components/
│   ├── home/                    # 主页组件
│   │   ├── index.tsx           # 主布局
│   │   ├── ai-chat.tsx         # AI 对话界面
│   │   ├── app-sidebar.tsx     # 侧边栏
│   │   └── knowledge-base.tsx  # 知识库轮播
│   ├── admin/                   # 管理后台组件
│   │   ├── DashboardPanel.tsx
│   │   ├── AdminManagement.tsx
│   │   ├── UserManagement.tsx
│   │   └── FeedbackManagement.tsx
│   ├── ui/                      # shadcn/ui 组件
│   ├── LoginCard.tsx
│   ├── theme-provider.tsx       # 主题上下文
│   └── theme-switcher.tsx       # 主题切换器
├── lib/
│   ├── utils.ts                 # 工具函数
│   └── api-routes.ts            # API 路由配置
└── public/                      # 静态资源
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 3. 构建生产版本

```bash
npm run build
npm start
```

## 📝 使用说明

### 用户端功能

#### 1. 注册/登录
- 访问 `/sign-in` 登录
- 访问 `/sign-up` 注册新账户
- 管理员快速登录：用户名 `admin`，密码 `admin123`

#### 2. AI 识别
1. 登录后自动跳转到主页 `/home`
2. 点击"点击上传图片进行识别"按钮
3. 选择水稻病害图片（支持 JPG/PNG）
4. 等待 AI 分析（约 2 秒）
5. 查看识别结果：病害名称、置信度、病因、防治建议
6. 点击"查看详情"跳转到结果页面

#### 3. 查看历史
- 侧边栏点击"查看全部历史"或访问 `/history`
- 使用搜索框过滤记录
- 点击"查看详情"按钮查看完整诊断报告

#### 4. 知识库
- 访问 `/knowledge` 查看病虫害百科
- 使用搜索框或分类按钮筛选
- 点击卡片查看详细信息

#### 5. 个人中心
- 点击侧边栏"个人中心"或访问 `/profile`
- 修改用户名、邮箱
- 上传头像（点击头像图标）
- 修改密码（需要输入当前密码）

#### 6. 提交反馈
- 在识别结果页点击"提供反馈"按钮
- 或访问 `/feedback` 页面
- 输入反馈内容（最多 200 字）
- 可选上传截图（最多 3 张）

#### 7. 主题切换
- 点击右上角调色板图标
- 选择喜欢的主题：浅色、深色、蓝色、绿色

### 管理员功能

#### 1. 登录管理后台
- 使用管理员账户登录（`admin` / `admin123`）
- 自动跳转到 `/admin`

#### 2. 数据面板
- 查看系统统计数据
- 用户数量、识别次数、反馈数量
- 数据可视化图表（柱状图、饼图）

#### 3. 用户管理
- 查看所有用户列表
- 编辑用户信息
- 删除用户（确认对话框）

#### 4. 管理员管理
- 添加新管理员
- 编辑管理员权限
- 删除管理员账户

#### 5. 反馈管理
- 查看所有用户反馈
- 标记处理状态
- 回复用户反馈

## 🔧 核心功能实现

### 1. AI 识别流程

```typescript
// components/home/ai-chat.tsx
const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('/api/recognize', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });

  const data = await response.json();
  // 显示识别结果...
};
```

### 2. 主题切换实现

```typescript
// components/theme-provider.tsx
const applyTheme = (newTheme: Theme) => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark', 'blue', 'green');
  root.classList.add(newTheme);
  
  // 设置 CSS 变量
  root.style.setProperty('--primary', colors[newTheme].primary);
  // ...
};
```

### 3. 路由保护

```typescript
// 客户端认证检查
useEffect(() => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  
  if (!token) {
    router.push('/sign-in');
    return;
  }
  
  if (role !== 'admin') {
    router.push('/home');
    return;
  }
}, []);
```

## 📡 API 接口

### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

### 识别接口
- `POST /api/recognize` - 上传图片识别
- `GET /api/history` - 获取识别历史
- `GET /api/result/:id` - 获取识别结果详情

### 知识库接口
- `GET /api/diseases` - 获取病害列表
- `GET /api/diseases/:id` - 获取病害详情

### 用户接口
- `GET /api/user/profile` - 获取用户信息
- `PUT /api/user/profile` - 更新用户信息
- `POST /api/user/avatar` - 上传头像

### 反馈接口
- `POST /api/feedback` - 提交反馈

### 管理接口
- `GET /api/admin/stats` - 获取统计数据
- `GET /api/admin/users` - 获取用户列表
- `GET /api/admin/feedbacks` - 获取反馈列表

## 🎯 待实现功能

### 1. AI 模型集成
目前使用模拟数据，需要集成真实的图像识别模型：
- 训练水稻病虫害识别模型
- 部署模型服务
- 更新 `/api/recognize` 端点调用实际模型

### 2. 数据库集成
目前使用内存存储，建议集成：
- **PostgreSQL** 或 **MongoDB**：存储用户数据、识别记录、反馈
- **Prisma ORM**：数据库操作
- **数据迁移**：用户认证、历史记录、反馈数据

### 3. 文件存储
- **云存储服务**：AWS S3、阿里云 OSS、七牛云
- 存储上传的图片和用户头像
- 生成 CDN 链接

### 4. 国际化（i18n）
- 安装 `next-intl` 或 `react-i18next`
- 创建中英文翻译文件
- 添加语言切换组件

### 5. 实时通知
- 使用 WebSocket 或 Server-Sent Events
- 识别完成通知
- 反馈回复通知

### 6. 数据导出
- 导出识别历史（Excel/PDF）
- 管理后台数据报表

## 🔐 安全建议

1. **环境变量**：敏感信息存储在 `.env.local`
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   JWT_SECRET=your-secret-key
   DATABASE_URL=postgresql://...
   ```

2. **JWT 认证**：使用 `jsonwebtoken` 库
   ```bash
   npm install jsonwebtoken bcrypt
   ```

3. **输入验证**：使用 `zod` 验证用户输入
   ```bash
   npm install zod
   ```

4. **HTTPS**：生产环境启用 HTTPS

5. **Rate Limiting**：防止 API 滥用

## 📄 License

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- Email: support@airicepest.com
- GitHub Issues: [项目地址]

---

**Made with ❤️ using Next.js and shadcn/ui**

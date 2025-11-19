# 🚀 部署指南

## 快速启动

### 本地开发

1. **安装依赖**
```bash
npm install
```

2. **启动开发服务器**
```bash
npm run dev
# 或使用启动脚本
./start.sh
```

3. **访问应用**
- 主页: http://localhost:3000
- 登录: http://localhost:3000/sign-in
- 管理后台: http://localhost:3000/admin

### 测试账户
- **管理员**: `admin` / `admin123`
- **普通用户**: 需要注册

## 生产部署

### 1. Vercel 部署（推荐）

#### 自动部署
1. 将项目推送到 GitHub
2. 访问 [Vercel](https://vercel.com)
3. 点击 "Import Project"
4. 选择你的 GitHub 仓库
5. 点击 "Deploy"

#### 手动部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel
```

#### 环境变量配置
在 Vercel 项目设置中添加：
```env
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
JWT_SECRET=your-jwt-secret-key
DATABASE_URL=your-database-url
```

### 2. Docker 部署

#### Dockerfile
创建 `Dockerfile`:
```dockerfile
FROM node:20-alpine AS base

# 安装依赖
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 运行应用
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose
创建 `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3000/api
      - JWT_SECRET=your-jwt-secret
      - DATABASE_URL=postgresql://user:password@db:5432/airicepest
    depends_on:
      - db
  
  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=airicepest
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### 构建和运行
```bash
# 构建镜像
docker build -t airicepest .

# 运行容器
docker run -p 3000:3000 airicepest

# 或使用 Docker Compose
docker-compose up -d
```

### 3. 传统服务器部署

#### 前置要求
- Node.js 20+
- PM2（进程管理）
- Nginx（反向代理）

#### 步骤

1. **克隆代码**
```bash
git clone <your-repo>
cd airicepest
```

2. **安装依赖**
```bash
npm install
```

3. **构建项目**
```bash
npm run build
```

4. **安装 PM2**
```bash
npm install -g pm2
```

5. **启动应用**
```bash
pm2 start npm --name "airicepest" -- start
pm2 save
pm2 startup
```

6. **配置 Nginx**
创建 `/etc/nginx/sites-available/airicepest`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **启用站点**
```bash
sudo ln -s /etc/nginx/sites-available/airicepest /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

8. **配置 SSL（可选）**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 数据库配置

### PostgreSQL

1. **安装 Prisma**
```bash
npm install prisma @prisma/client
npx prisma init
```

2. **定义数据模型**
编辑 `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  username  String   @unique
  email     String   @unique
  password  String
  role      String   @default("user")
  avatar    String?
  createdAt DateTime @default(now())
  
  recognitions Recognition[]
  feedbacks    Feedback[]
}

model Recognition {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  imagePath     String
  diseaseName   String
  confidence    Float
  description   String
  createdAt     DateTime @default(now())
}

model Feedback {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  content   String
  images    String[]
  status    String   @default("pending")
  createdAt DateTime @default(now())
}

model Disease {
  id          String   @id @default(cuid())
  name        String   @unique
  description String
  category    String
  severity    String
  symptoms    String[]
  solutions   String[]
  images      String[]
}
```

3. **生成迁移**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. **使用 Prisma Client**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## 环境变量

创建 `.env.local`:
```env
# 应用配置
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/airicepest

# 文件存储（可选）
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=airicepest-images

# 或使用阿里云 OSS
ALIYUN_OSS_REGION=oss-cn-hangzhou
ALIYUN_OSS_ACCESS_KEY_ID=your-key
ALIYUN_OSS_ACCESS_KEY_SECRET=your-secret
ALIYUN_OSS_BUCKET=airicepest
```

## 性能优化

### 1. 图像优化
使用 Next.js 内置的 `<Image>` 组件：
```tsx
import Image from 'next/image';

<Image 
  src="/image.jpg" 
  width={300} 
  height={200} 
  alt="description"
  loading="lazy"
/>
```

### 2. 代码分割
使用动态导入：
```tsx
import dynamic from 'next/dynamic';

const AdminPanel = dynamic(() => import('@/components/admin/AdminPanel'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
```

### 3. 缓存策略
```typescript
// API 路由中添加缓存头
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
```

### 4. CDN 配置
在 Vercel 中自动启用，其他平台可使用 Cloudflare 等 CDN 服务。

## 监控和日志

### 1. Vercel Analytics
```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Sentry 错误追踪
```bash
npm install @sentry/nextjs
```

```typescript
// sentry.config.js
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## 备份策略

### 数据库备份
```bash
# PostgreSQL 备份
pg_dump -U user -h localhost airicepest > backup.sql

# 恢复
psql -U user -h localhost airicepest < backup.sql
```

### 文件备份
使用云存储的自动备份功能，或定期运行：
```bash
#!/bin/bash
aws s3 sync /path/to/uploads s3://backup-bucket/uploads/$(date +%Y%m%d)/
```

## 安全检查清单

- [ ] 使用 HTTPS
- [ ] 配置 CORS 策略
- [ ] 实施 Rate Limiting
- [ ] 启用 CSP（Content Security Policy）
- [ ] 密码加密存储（bcrypt）
- [ ] JWT Token 过期时间
- [ ] 输入验证和清理
- [ ] 定期更新依赖
- [ ] 环境变量保护
- [ ] 数据库访问权限控制

## 故障排查

### 常见问题

1. **端口被占用**
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

2. **依赖安装失败**
```bash
rm -rf node_modules package-lock.json
npm install
```

3. **构建错误**
```bash
npm run build -- --debug
```

4. **数据库连接失败**
检查 DATABASE_URL 格式和数据库服务是否运行

## 更新部署

```bash
# 拉取最新代码
git pull origin main

# 安装新依赖
npm install

# 重新构建
npm run build

# 重启应用（PM2）
pm2 restart airicepest

# 或重启 Docker 容器
docker-compose down
docker-compose up -d --build
```

## 回滚版本

### Git 回滚
```bash
git log --oneline
git checkout <commit-hash>
npm run build
pm2 restart airicepest
```

### Vercel 回滚
在 Vercel Dashboard 中点击 "Rollback" 按钮

## 负载测试

使用 Artillery 进行负载测试：
```bash
npm install -g artillery

# 创建测试配置
artillery quick --count 100 --num 10 http://localhost:3000/api/recognize
```

## 支持

如遇到问题，请：
1. 检查日志：`pm2 logs airicepest`
2. 查看 GitHub Issues
3. 联系技术支持

---

**祝部署顺利！** 🎉

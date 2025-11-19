# Routes 文件夹说明

⚠️ **注意**: 此文件夹包含 TanStack Router 的路由配置，但本项目使用的是 **Next.js App Router**。

## 当前状态

- 此文件夹已在 `tsconfig.json` 中被排除编译
- 所有路由功能已迁移到 Next.js 的 `app/` 目录
- 此文件夹保留仅供参考或未来迁移使用

## Next.js 路由结构

本项目使用 Next.js 16 的文件系统路由，主要路由如下：

```
app/
├── page.tsx              → /          (重定向到 /sign-in)
├── sign-in/
│   └── page.tsx         → /sign-in   (登录页)
├── sign-up/
│   └── page.tsx         → /sign-up   (注册页)
├── forgot-password/
│   └── page.tsx         → /forgot-password (忘记密码)
├── dashboard/
│   └── page.tsx         → /dashboard (用户仪表板)
└── admin/
    └── page.tsx         → /admin     (管理员控制台)
```

## 如果需要使用 TanStack Router

如果未来需要使用 TanStack Router：

1. 从 `tsconfig.json` 中移除 routes 的排除
2. 安装依赖：
   ```bash
   npm install @tanstack/react-router @tanstack/react-query
   ```
3. 迁移路由配置

## 建议

建议删除或归档此文件夹，以避免混淆。所有路由功能已在 Next.js App Router 中实现。

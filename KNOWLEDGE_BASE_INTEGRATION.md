# 知识库前后端对接检查清单

## 已完成的修复

### 1. 后端修复 (backend/app.py)
- ✅ 添加静态文件服务支持
- ✅ 配置 `static_folder` 路径
- ✅ 添加 `/images/<path:filename>` 路由，服务知识库图片
- ✅ 添加 `/static/<path:filename>` 路由，服务上传的图片

### 2. 前端知识库列表页面 (app/knowledge/page.tsx)
- ✅ 导入 `API_BASE_URL` 用于构建完整图片URL
- ✅ 添加 `getImageUrl()` 函数处理各种图片路径格式
- ✅ 为图片添加错误处理 (onError fallback)
- ✅ 修复图片显示逻辑

### 3. 前端知识库详情页面 (app/knowledge/[id]/page.tsx)
- ✅ 创建新的详情页面
- ✅ 实现图片轮播功能（主图 + 缩略图）
- ✅ 使用 Tabs 组件展示病原信息、发生规律、防治措施
- ✅ 完整的数据展示（别名、特征、受害部位等）
- ✅ 添加图片错误处理

### 4. 多语言支持 (components/language-provider.tsx)
- ✅ 添加知识库详情页面所需的翻译键
- ✅ 中英文双语支持

## 图片路径处理逻辑

### 数据库存储格式
```
symptom_images: "image1.png,image2.png,image3.png"
```

### 后端返回格式
```json
{
  "imageUrls": ["image1.png", "image2.png", "image3.png"]
}
```

### 前端处理逻辑
```typescript
const getImageUrl = (url: string) => {
  if (!url) return '/placeholder.png';
  
  // 完整URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // 以 /images/ 开头
  if (url.startsWith('/images/')) {
    return `${API_BASE_URL}${url}`;
  }
  
  // 只是文件名
  if (!url.startsWith('/')) {
    return `${API_BASE_URL}/images/${url}`;
  }
  
  return `${API_BASE_URL}${url}`;
};
```

### 最终生成的URL
```
http://localhost:4000/images/image1.png
```

## 后端路由结构

```python
# 知识库图片 (存储在项目根目录的 images/ 文件夹)
@app.route('/images/<path:filename>')
def serve_images(filename):
    images_dir = os.path.join(PARENT_DIR, 'images')
    return send_from_directory(images_dir, filename)

# 上传图片 (存储在 backend/static/uploads/)
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)
```

## 测试步骤

### 1. 启动后端
```bash
cd backend
python app.py
```

### 2. 测试知识库API
```bash
cd backend
python test_knowledge_api.py
```

### 3. 启动前端
```bash
npm run dev
```

### 4. 测试功能
1. 访问 http://localhost:3000/knowledge
2. 检查病害卡片是否正确显示图片
3. 点击任意病害卡片进入详情页
4. 验证详情页面的：
   - 图片轮播功能
   - 病原信息标签
   - 发生规律标签
   - 防治措施标签
   - 所有数据字段显示

## 可能需要的额外修复

### 1. 创建 placeholder 图片
如果没有 placeholder.png，可以：
- 选项 A: 在 public/ 目录创建一个占位图
- 选项 B: 使用 data URI 或 SVG 占位图
- 选项 C: 使用外部占位图服务

### 2. 数据库检查
确保数据库中的 `symptom_images` 字段：
- 包含有效的图片文件名
- 文件名对应的图片存在于 `images/` 目录
- 格式为逗号分隔的字符串

### 3. CORS 配置检查
确保后端的 CORS 配置允许前端访问：
```python
CORS(app, origins=[
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://localhost:3001'
], supports_credentials=True)
```

## API 端点清单

### 知识库 API
- `GET /api/knowledge` - 获取知识库列表
- `GET /api/knowledge/:id` - 获取知识库详情

### 静态文件服务
- `GET /images/:filename` - 获取知识库图片
- `GET /static/:filename` - 获取上传的图片

## 前端页面路由
- `/knowledge` - 知识库列表页
- `/knowledge/[id]` - 知识库详情页

## 注意事项

1. **图片路径一致性**: 确保数据库中的图片文件名与实际文件系统中的文件名完全匹配
2. **大小写敏感**: Linux 系统文件名大小写敏感，确保一致性
3. **文件扩展名**: 注意 `.png` vs `.jpeg` 的区别
4. **错误处理**: 前端已添加图片加载失败的降级处理
5. **性能优化**: 考虑为图片添加缓存策略

## 下一步优化建议

1. **图片优化**
   - 添加图片压缩
   - 实现懒加载
   - 添加缩略图支持

2. **缓存策略**
   - 添加 HTTP 缓存头
   - 实现前端缓存

3. **加载状态**
   - 添加图片骨架屏
   - 优化加载动画

4. **错误处理**
   - 更友好的错误提示
   - 图片加载重试机制

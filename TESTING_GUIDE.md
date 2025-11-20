# 前后端联调测试指南

## 快速启动

### 1. 启动后端

#### 方式 A: 使用测试脚本（推荐）
```bash
cd /media/qiu/entertainment/airicepest/AiRicePest/airicepest
./test_knowledge_backend.sh
```

#### 方式 B: 手动启动
```bash
cd /media/qiu/entertainment/airicepest/AiRicePest/airicepest/backend

# 激活虚拟环境（如果有）
source myenv_311/bin/activate

# 启动服务器
python3 app.py
```

后端将在 **http://localhost:4000** 运行

### 2. 测试后端 API

在另一个终端运行：
```bash
cd /media/qiu/entertainment/airicepest/AiRicePest/airicepest/backend
python3 test_knowledge_api.py
```

这将测试：
- ✅ 知识库列表 API
- ✅ 知识库详情 API  
- ✅ 图片文件访问

### 3. 启动前端

```bash
cd /media/qiu/entertainment/airicepest/AiRicePest/airicepest
npm run dev
```

前端将在 **http://localhost:3000** 运行

## 功能测试清单

### ✅ 知识库列表页面 (/knowledge)

1. **访问页面**
   - 打开 http://localhost:3000/knowledge
   - 应该看到病虫害列表网格

2. **检查图片显示**
   - 每个卡片应该显示病害的第一张图片
   - 如果图片加载失败，应显示占位图

3. **测试搜索功能**
   - 在搜索框输入病害名称
   - 列表应该实时过滤

4. **测试分类筛选**
   - 点击"全部"、"真菌病害"、"细菌病害"、"虫害"按钮
   - 列表应该按分类过滤

5. **测试卡片悬停效果**
   - 鼠标悬停在卡片上
   - 图片应该有缩放动画
   - 标题应该变成主题色

### ✅ 知识库详情页面 (/knowledge/[id])

1. **访问详情页**
   - 点击任意病害卡片
   - 应该跳转到详情页

2. **检查头部信息**
   - 病害名称、类型、分类标签
   - 别名列表
   - 主要特征
   - 受害部位标签

3. **测试图片轮播**
   - 主图应该显示病害的第一张图片
   - 下方应该显示所有缩略图
   - 点击缩略图应该切换主图
   - 选中的缩略图应该有边框高亮

4. **测试信息标签页**
   
   **病原信息标签:**
   - 病原体信息
   - 传播途径信息
   
   **发生规律标签:**
   - 发生条件
   - 生命周期/发生规律
   
   **防治措施标签:**
   - 农业防治（绿色标记）
   - 物理防治（蓝色标记）
   - 生物防治（紫色标记）
   - 化学防治（橙色标记）

5. **测试返回功能**
   - 点击"返回"按钮
   - 应该返回知识库列表页

### ✅ 多语言切换

1. **中英文切换**
   - 点击右上角语言切换按钮
   - 所有文本应该正确切换
   - 包括按钮、标签、描述等

### ✅ 主题切换

1. **深浅色主题**
   - 点击主题切换按钮
   - 页面应该平滑切换主题
   - 图片应该正常显示

## 常见问题排查

### 问题 1: 图片不显示

**检查项:**
1. 后端是否正常运行在 4000 端口
2. 图片文件是否存在于 `/media/qiu/entertainment/airicepest/AiRicePest/airicepest/images/` 目录
3. 浏览器控制台是否有 CORS 错误
4. 打开 http://localhost:4000/images/image1.png 测试图片是否可访问

**解决方案:**
```bash
# 检查图片目录
ls -la /media/qiu/entertainment/airicepest/AiRicePest/airicepest/images/ | head

# 检查后端日志
# 在后端终端查看请求日志

# 测试图片访问
curl http://localhost:4000/images/image1.png -I
```

### 问题 2: API 请求失败

**检查项:**
1. 前端 API 配置是否正确 (`lib/api-config.ts`)
2. 后端 CORS 是否正确配置
3. 后端路由是否正确注册

**解决方案:**
```bash
# 测试 API
curl http://localhost:4000/api/knowledge
curl http://localhost:4000/api/knowledge/1

# 检查后端路由
grep -n "knowledge_bp" backend/app.py
```

### 问题 3: 详情页面 404

**检查项:**
1. Next.js 动态路由是否正确创建
2. 路由文件路径: `app/knowledge/[id]/page.tsx`

**解决方案:**
```bash
# 检查路由文件
ls -la app/knowledge/

# 重启前端服务
npm run dev
```

### 问题 4: 数据为空

**检查项:**
1. 数据库是否有数据
2. 后端查询是否成功
3. 数据格式是否正确

**解决方案:**
```bash
# 运行测试脚本
cd backend
python3 test_knowledge_api.py
```

## API 端点参考

### 知识库 API

**GET /api/knowledge**
- 描述: 获取知识库列表
- 参数: 
  - `page`: 页码（可选）
  - `limit`: 每页数量（可选）
  - `category`: 分类过滤（可选）
- 响应: 知识库条目数组

**GET /api/knowledge/:id**
- 描述: 获取知识库详情
- 参数: 
  - `id`: 病害ID
- 响应: 
  ```json
  {
    "success": true,
    "data": {
      "id": "1",
      "name": "稻瘟病",
      "category": "病害类",
      "type": "真菌病害",
      "aliases": ["稻热病"],
      "keyFeatures": "主要特征描述...",
      "affectedParts": ["叶片", "穗部"],
      "imageUrls": ["image1.png", "image2.png"],
      "pathogen": "病原体信息...",
      "conditions": "发生条件...",
      "lifeCycle": "发生规律...",
      "transmission": "传播途径...",
      "controls": {
        "agricultural": ["措施1", "措施2"],
        "physical": ["措施1"],
        "biological": ["措施1"],
        "chemical": ["措施1"]
      }
    }
  }
  ```

### 静态文件服务

**GET /images/:filename**
- 描述: 获取知识库图片
- 示例: `/images/image1.png`

**GET /static/:filename**
- 描述: 获取上传的图片
- 示例: `/static/uploads/xxxxx.jpg`

## 性能测试

### 1. 页面加载速度
```bash
# 使用 curl 测试响应时间
time curl http://localhost:4000/api/knowledge
```

### 2. 图片加载测试
```bash
# 测试多个图片并发加载
for i in {1..10}; do
  curl http://localhost:4000/images/image$i.png -o /dev/null -s -w "image$i: %{time_total}s\n" &
done
wait
```

### 3. 前端性能
- 打开浏览器开发者工具
- Network 标签查看资源加载时间
- Performance 标签查看页面性能

## 下一步优化

1. **添加缓存**
   - 后端添加 HTTP 缓存头
   - 前端使用 SWR 或 React Query

2. **图片优化**
   - 压缩图片文件
   - 添加多尺寸支持
   - 实现懒加载

3. **用户体验**
   - 添加骨架屏
   - 优化加载动画
   - 添加错误边界

4. **SEO 优化**
   - 添加页面元数据
   - 实现服务端渲染（如需要）

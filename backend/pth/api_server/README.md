# 水稻病害识别 API 服务

基于 FastAPI 的水稻病害智能识别 REST API 服务。

## 项目结构

```
api_server/
├── app.py              # FastAPI 主应用
├── model.py            # VGG16WithCNN 模型定义
├── requirements.txt    # Python 依赖
├── README.md           # 本文档
└── test_api.py         # API 测试脚本
```

## 快速开始

### 1. 安装依赖

```bash
cd api_server
pip install -r requirements.txt
```

### 2. 启动服务

```bash
python app.py
```

或使用 uvicorn 启动：

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

服务将在 `http://localhost:8000` 启动。

### 3. 访问 API 文档

启动后访问以下地址查看自动生成的 API 文档：

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API 接口说明

### 1. 服务信息

**GET** `/`

返回 API 服务的基本信息。

**响应示例：**
```json
{
  "service": "水稻病害识别 API",
  "version": "1.0.0",
  "status": "running",
  "device": "cuda",
  "model_loaded": true,
  "supported_classes": [
    "Bacterialblight",
    "Blast",
    "Brownspot",
    "Healthy",
    "Tungro"
  ]
}
```

### 2. 健康检查

**GET** `/health`

检查服务健康状态。

**响应示例：**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cuda"
}
```

### 3. 单张图像预测

**POST** `/predict`

上传单张图像进行病害识别。

**请求参数：**
- `file`: 图像文件（multipart/form-data）

**响应示例：**
```json
{
  "success": true,
  "filename": "rice_leaf.jpg",
  "result": {
    "predicted_class": "Blast",
    "confidence": 0.9567,
    "confidence_percent": "95.67%",
    "top5_predictions": [
      {
        "rank": 1,
        "class": "Blast",
        "confidence": 0.9567,
        "confidence_percent": "95.67%"
      },
      {
        "rank": 2,
        "class": "Brownspot",
        "confidence": 0.0312,
        "confidence_percent": "3.12%"
      }
    ]
  }
}
```

### 4. 批量图像预测

**POST** `/predict-batch`

上传多张图像进行批量预测（最多 10 张）。

**请求参数：**
- `files`: 多个图像文件（multipart/form-data）

**响应示例：**
```json
{
  "success": true,
  "total": 3,
  "results": [
    {
      "filename": "image1.jpg",
      "success": true,
      "result": {
        "predicted_class": "Healthy",
        "confidence": 0.9823,
        "confidence_percent": "98.23%",
        "top5_predictions": [...]
      }
    },
    {
      "filename": "image2.jpg",
      "success": true,
      "result": {...}
    }
  ]
}
```

## 前端调用示例

### JavaScript (Fetch API)

```javascript
// 单张图像预测
async function predictImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://localhost:8000/predict', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  console.log(result);
  return result;
}

// 使用示例
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const result = await predictImage(file);
  console.log('预测结果:', result.result.predicted_class);
  console.log('置信度:', result.result.confidence_percent);
});
```

### JavaScript (Axios)

```javascript
import axios from 'axios';

async function predictImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post('http://localhost:8000/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('预测失败:', error);
    throw error;
  }
}
```

### Python (requests)

```python
import requests

def predict_image(image_path):
    url = 'http://localhost:8000/predict'
    
    with open(image_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(url, files=files)
    
    return response.json()

# 使用示例
result = predict_image('test_image.jpg')
print(f"预测类别: {result['result']['predicted_class']}")
print(f"置信度: {result['result']['confidence_percent']}")
```

### cURL

```bash
# 单张图像预测
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/image.jpg"

# 批量预测
curl -X POST "http://localhost:8000/predict-batch" \
  -H "Content-Type: multipart/form-data" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg" \
  -F "files=@image3.jpg"
```

## 测试 API

使用提供的测试脚本：

```bash
python test_api.py
```

## 配置说明

在 `app.py` 中可以修改以下配置：

```python
# 模型路径
MODEL_PATH = '../dense_net_model_50.pth'

# 类别名称
CLASS_NAMES = ["Bacterialblight", "Blast", "Brownspot", "Healthy", "Tungro"]

# 服务端口
PORT = 8000

# CORS 配置（生产环境请限制具体域名）
allow_origins=["*"]
```

## 部署建议

### 开发环境

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### 生产环境

使用 Gunicorn + Uvicorn workers：

```bash
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

或使用 Docker 部署（需要创建 Dockerfile）。

## 性能优化

1. **批量预测**: 使用 `/predict-batch` 接口可以提高吞吐量
2. **GPU 加速**: 确保 PyTorch 检测到 CUDA 设备
3. **模型量化**: 可以使用 PyTorch 的量化功能减少内存占用
4. **缓存机制**: 对于重复请求可以添加缓存层

## 常见问题

### Q: 如何修改监听端口？

A: 在 `app.py` 的最后修改 `uvicorn.run()` 的 `port` 参数。

### Q: 如何启用 HTTPS？

A: 在 `uvicorn.run()` 中添加 SSL 证书参数：
```python
uvicorn.run(
    app,
    host="0.0.0.0",
    port=8000,
    ssl_keyfile="path/to/key.pem",
    ssl_certfile="path/to/cert.pem"
)
```

### Q: 如何限制上传文件大小？

A: 在 FastAPI 中添加中间件或在路由中验证文件大小。

## 许可证

MIT License

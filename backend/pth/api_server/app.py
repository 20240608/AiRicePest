"""
水稻病害识别 API 服务
使用 FastAPI 提供 REST API 接口
"""
import os
import io
import torch
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from torchvision import transforms
from model import VGG16WithCNN
import uvicorn

# ======================
# 全局配置
# ======================

# 模型配置
MODEL_PATH = '../dense_net_model_50.pth'  # 相对于 api_server 目录
CLASS_NAMES = [
    "Bacterialblight",  # 细菌性疫病
    "Blast",            # 稻瘟病
    "Brownspot",        # 褐斑病
    "Healthy",          # 健康
    "Tungro",           # 钨谷病
]

# 设备配置
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 初始化 FastAPI 应用
app = FastAPI(
    title="水稻病害识别 API",
    description="基于 VGG16WithCNN 的水稻病害智能识别系统",
    version="1.0.0"
)

# 配置 CORS（允许跨域请求）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境请修改为具体的前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================
# 模型加载
# ======================

def load_model():
    """
    加载预训练模型
    """
    print(f"[INFO] 🔧 使用设备: {DEVICE}")
    print("[INFO] 正在加载模型...")
    
    try:
        # 初始化模型结构
        model = VGG16WithCNN(num_classes=len(CLASS_NAMES))
        
        # 加载权重文件
        try:
            checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
        except Exception:
            checkpoint = torch.load(MODEL_PATH, map_location=DEVICE, weights_only=False)

        # 处理不同格式的 checkpoint
        state_dict = None
        if isinstance(checkpoint, dict):
            state_dict = checkpoint.get('state_dict', checkpoint)
        elif isinstance(checkpoint, torch.nn.Module):
            print("[INFO] 检测到完整模型对象，提取 state_dict")
            state_dict = checkpoint.state_dict()
        else:
            raise ValueError(f"无法识别的模型文件格式: {type(checkpoint)}")

        # 处理 state_dict 的 key（去除可能的前缀）
        new_state_dict = {}
        for k, v in state_dict.items():
            name = k
            # 去除 'module.' 前缀（多卡训练产生）
            if name.startswith('module.'):
                name = name[7:]
            new_state_dict[name] = v
            
        # 加载权重
        try:
            model.load_state_dict(new_state_dict, strict=True)
            print("[INFO] ✅ 模型权重加载成功（严格模式）")
        except RuntimeError as e:
            print(f"[WARNING] 严格加载失败: {str(e)[:200]}...")
            
            # 尝试去除 'model.' 前缀
            retry_state_dict = {}
            for k, v in new_state_dict.items():
                if k.startswith('model.'):
                    retry_state_dict[k[6:]] = v
                else:
                    retry_state_dict[k] = v
            
            try:
                model.load_state_dict(retry_state_dict, strict=True)
                print("[INFO] ✅ 去除 'model.' 前缀后加载成功")
            except RuntimeError:
                print("[WARNING] 尝试非严格加载 (strict=False)")
                model.load_state_dict(new_state_dict, strict=False)
                print("[INFO] ⚠️  模型权重部分加载成功（非严格模式）")

        model.to(DEVICE)
        model.eval()
        print("[INFO] ✅ 模型加载完成并设置为评估模式")
        return model
        
    except Exception as e:
        print(f"[ERROR] ❌ 模型加载失败: {e}")
        raise

# 全局加载模型（服务启动时加载一次）
model = load_model()

# ======================
# 图像预处理
# ======================

def get_image_transform():
    """
    获取图像预处理 transform
    必须与训练时的预处理保持一致
    """
    return transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

# ======================
# 预测函数
# ======================

def predict_image(image: Image.Image):
    """
    对单张图片进行预测
    
    Args:
        image: PIL Image 对象
        
    Returns:
        dict: 包含预测结果的字典
    """
    if model is None:
        raise RuntimeError("模型未成功加载")
    
    # 图像预处理
    transform = get_image_transform()
    image = image.convert("RGB")
    image_tensor = transform(image).unsqueeze(0).to(DEVICE)
    
    # 推理
    with torch.no_grad():
        outputs = model(image_tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)
        
        # 获取 top-5 预测结果
        top5_prob, top5_idx = torch.topk(probabilities, k=min(5, len(CLASS_NAMES)), dim=1)
        
        # 最高预测
        predicted_idx = top5_idx[0][0].item()
        predicted_label = CLASS_NAMES[predicted_idx]
        confidence = top5_prob[0][0].item()
        
        # 所有类别的概率
        all_predictions = []
        for i, (prob, idx) in enumerate(zip(top5_prob[0], top5_idx[0])):
            all_predictions.append({
                "rank": i + 1,
                "class": CLASS_NAMES[idx.item()],
                "confidence": float(prob.item()),
                "confidence_percent": f"{prob.item():.2%}"
            })
    
    return {
        "predicted_class": predicted_label,
        "confidence": float(confidence),
        "confidence_percent": f"{confidence:.2%}",
        "top5_predictions": all_predictions
    }

# ======================
# API 路由
# ======================

@app.get("/")
async def root():
    """
    API 根路径，返回服务信息
    """
    return {
        "service": "水稻病害识别 API",
        "version": "1.0.0",
        "status": "running",
        "device": str(DEVICE),
        "model_loaded": model is not None,
        "supported_classes": CLASS_NAMES
    }

@app.get("/health")
async def health_check():
    """
    健康检查接口
    """
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "device": str(DEVICE)
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    图像预测接口
    
    Args:
        file: 上传的图像文件（支持 jpg, jpeg, png）
        
    Returns:
        JSON: 预测结果
    """
    # 验证文件类型
    if not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail="上传的文件必须是图像格式（jpg, jpeg, png）"
        )
    
    try:
        # 读取图像
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # 进行预测
        result = predict_image(image)
        
        return JSONResponse(content={
            "success": True,
            "filename": file.filename,
            "result": result
        })
        
    except Exception as e:
        print(f"[ERROR] 预测失败: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"预测过程中出错: {str(e)}"
        )

@app.post("/predict-batch")
async def predict_batch(files: list[UploadFile] = File(...)):
    """
    批量图像预测接口
    
    Args:
        files: 上传的多个图像文件
        
    Returns:
        JSON: 批量预测结果
    """
    if len(files) > 10:
        raise HTTPException(
            status_code=400,
            detail="单次批量预测最多支持 10 张图片"
        )
    
    results = []
    
    for file in files:
        # 验证文件类型
        if not file.content_type.startswith('image/'):
            results.append({
                "filename": file.filename,
                "success": False,
                "error": "文件格式不支持"
            })
            continue
        
        try:
            # 读取图像
            image_data = await file.read()
            image = Image.open(io.BytesIO(image_data))
            
            # 进行预测
            result = predict_image(image)
            
            results.append({
                "filename": file.filename,
                "success": True,
                "result": result
            })
            
        except Exception as e:
            print(f"[ERROR] 预测 {file.filename} 失败: {e}")
            results.append({
                "filename": file.filename,
                "success": False,
                "error": str(e)
            })
    
    return JSONResponse(content={
        "success": True,
        "total": len(files),
        "results": results
    })

# ======================
# 启动服务
# ======================

if __name__ == '__main__':
    # 启动 Uvicorn 服务器
    uvicorn.run(
        app,
        host="0.0.0.0",  # 监听所有 IP
        port=8000,       # 端口号
        log_level="info"
    )

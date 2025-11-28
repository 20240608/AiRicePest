"""
API 测试脚本
用于测试水稻病害识别 API 的各个接口
"""
import requests
import json
from pathlib import Path

# API 基础 URL
BASE_URL = "http://localhost:8000"

def test_root():
    """测试根路径"""
    print("\n=== 测试根路径 ===")
    response = requests.get(f"{BASE_URL}/")
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    return response.status_code == 200

def test_health():
    """测试健康检查"""
    print("\n=== 测试健康检查 ===")
    response = requests.get(f"{BASE_URL}/health")
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    return response.status_code == 200

def test_predict(image_path):
    """测试单张图像预测"""
    print(f"\n=== 测试单张图像预测: {image_path} ===")
    
    if not Path(image_path).exists():
        print(f"⚠️  图像文件不存在: {image_path}")
        return False
    
    try:
        with open(image_path, 'rb') as f:
            files = {'file': (Path(image_path).name, f, 'image/jpeg')}
            response = requests.post(f"{BASE_URL}/predict", files=files)
        
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"响应: {json.dumps(result, indent=2, ensure_ascii=False)}")
            
            # 提取关键信息
            if result.get('success'):
                pred_result = result.get('result', {})
                print(f"\n✅ 预测结果:")
                print(f"   类别: {pred_result.get('predicted_class')}")
                print(f"   置信度: {pred_result.get('confidence_percent')}")
                
                # 显示 Top-5
                print(f"\n   Top-5 预测:")
                for pred in pred_result.get('top5_predictions', []):
                    print(f"   {pred['rank']}. {pred['class']}: {pred['confidence_percent']}")
            
            return True
        else:
            print(f"❌ 请求失败: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        return False

def test_predict_batch(image_paths):
    """测试批量图像预测"""
    print(f"\n=== 测试批量图像预测 ===")
    
    # 检查文件是否存在
    valid_paths = [p for p in image_paths if Path(p).exists()]
    if not valid_paths:
        print("⚠️  没有有效的图像文件")
        return False
    
    print(f"批量预测 {len(valid_paths)} 张图像")
    
    try:
        files = []
        for path in valid_paths:
            with open(path, 'rb') as f:
                files.append(('files', (Path(path).name, f.read(), 'image/jpeg')))
        
        response = requests.post(f"{BASE_URL}/predict-batch", files=files)
        
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"响应: {json.dumps(result, indent=2, ensure_ascii=False)}")
            
            # 统计结果
            if result.get('success'):
                total = result.get('total', 0)
                results = result.get('results', [])
                success_count = sum(1 for r in results if r.get('success'))
                
                print(f"\n✅ 批量预测完成:")
                print(f"   总数: {total}")
                print(f"   成功: {success_count}")
                print(f"   失败: {total - success_count}")
                
                # 显示每个结果
                for r in results:
                    if r.get('success'):
                        pred = r.get('result', {})
                        print(f"\n   📄 {r['filename']}")
                        print(f"      类别: {pred.get('predicted_class')}")
                        print(f"      置信度: {pred.get('confidence_percent')}")
                    else:
                        print(f"\n   ❌ {r['filename']}: {r.get('error')}")
            
            return True
        else:
            print(f"❌ 请求失败: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        return False

def main():
    """主测试函数"""
    print("=" * 60)
    print("水稻病害识别 API 测试")
    print("=" * 60)
    
    # 测试基础接口
    test_root()
    test_health()
    
    # 测试预测接口（需要提供测试图像）
    # 请修改为实际的图像路径
    test_image_path = "../images/test.jpg"  # 修改为实际路径
    
    print(f"\n{'=' * 60}")
    print("📝 注意: 请将测试图像放在正确的路径")
    print(f"   当前测试路径: {test_image_path}")
    print(f"{'=' * 60}")
    
    # 如果有测试图像，执行预测测试
    if Path(test_image_path).exists():
        test_predict(test_image_path)
        
        # 批量测试
        test_images = [test_image_path]  # 可以添加多个路径
        if len(test_images) > 1:
            test_predict_batch(test_images)
    else:
        print("\n⚠️  跳过预测测试（未找到测试图像）")
        print("   请创建测试图像后重新运行测试")
    
    print("\n" + "=" * 60)
    print("测试完成")
    print("=" * 60)

if __name__ == "__main__":
    main()

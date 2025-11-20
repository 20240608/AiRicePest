#!/usr/bin/env python3
"""
测试知识库API和图片路径
"""

import requests
import json

# 测试配置
BASE_URL = "http://localhost:4000"
API_KNOWLEDGE = f"{BASE_URL}/api/knowledge"

def test_knowledge_list():
    """测试知识库列表接口"""
    print("=" * 60)
    print("测试知识库列表接口...")
    print("=" * 60)
    
    try:
        response = requests.get(API_KNOWLEDGE)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"返回数据类型: {type(data)}")
            print(f"知识库条目数量: {len(data)}")
            
            if len(data) > 0:
                print("\n第一条数据示例:")
                first_item = data[0]
                print(json.dumps(first_item, ensure_ascii=False, indent=2))
                
                # 检查图片URL
                if 'imageUrls' in first_item and first_item['imageUrls']:
                    print(f"\n图片URL列表:")
                    for url in first_item['imageUrls']:
                        print(f"  - {url}")
                        # 测试图片是否可访问
                        if url.startswith('/images/'):
                            full_url = f"{BASE_URL}{url}"
                            img_response = requests.head(full_url)
                            print(f"    访问测试: {img_response.status_code} {full_url}")
        else:
            print(f"错误: {response.text}")
    except Exception as e:
        print(f"异常: {str(e)}")

def test_knowledge_detail(pest_id=1):
    """测试知识库详情接口"""
    print("\n" + "=" * 60)
    print(f"测试知识库详情接口 (ID: {pest_id})...")
    print("=" * 60)
    
    try:
        response = requests.get(f"{API_KNOWLEDGE}/{pest_id}")
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"返回数据结构:")
            print(json.dumps(data, ensure_ascii=False, indent=2))
        else:
            print(f"错误: {response.text}")
    except Exception as e:
        print(f"异常: {str(e)}")

def test_image_access():
    """测试图片访问"""
    print("\n" + "=" * 60)
    print("测试图片访问...")
    print("=" * 60)
    
    test_images = [
        "/images/image1.png",
        "/images/image10.jpeg",
    ]
    
    for img_path in test_images:
        full_url = f"{BASE_URL}{img_path}"
        try:
            response = requests.head(full_url)
            print(f"{img_path}: {response.status_code}")
        except Exception as e:
            print(f"{img_path}: 错误 - {str(e)}")

if __name__ == "__main__":
    print("开始测试知识库API...")
    print(f"后端地址: {BASE_URL}\n")
    
    # 测试列表接口
    test_knowledge_list()
    
    # 测试详情接口
    test_knowledge_detail(1)
    
    # 测试图片访问
    test_image_access()
    
    print("\n测试完成！")

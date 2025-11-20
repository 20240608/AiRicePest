#!/bin/bash

# 知识库整合功能快速测试脚本

echo "=================================="
echo "知识库整合功能测试指南"
echo "=================================="
echo ""

# 检查后端是否运行
echo "1. 检查后端服务..."
if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
    echo "   ✅ 后端服务正在运行"
else
    echo "   ❌ 后端服务未运行"
    echo "   请在新终端运行: cd backend && python3 app.py"
    exit 1
fi

# 检查知识库API
echo ""
echo "2. 检查知识库API..."
KNOWLEDGE_COUNT=$(curl -s http://localhost:4000/api/knowledge | jq 'length' 2>/dev/null)
if [ ! -z "$KNOWLEDGE_COUNT" ]; then
    echo "   ✅ 知识库API正常，包含 $KNOWLEDGE_COUNT 条数据"
else
    echo "   ⚠️  无法获取知识库数据"
fi

# 检查图片服务
echo ""
echo "3. 检查图片服务..."
if curl -s -I http://localhost:4000/images/image1.png | grep "200 OK" > /dev/null; then
    echo "   ✅ 图片服务正常"
else
    echo "   ⚠️  图片服务可能有问题"
fi

# 前端提示
echo ""
echo "=================================="
echo "前端测试步骤"
echo "=================================="
echo ""
echo "如果前端未启动，请运行: npm run dev"
echo ""
echo "测试步骤："
echo ""
echo "✅ 测试1: 主页知识库展示"
echo "   1. 访问 http://localhost:3000/home"
echo "   2. 检查是否显示知识库轮播区域"
echo "   3. 检查是否显示病害卡片和图片"
echo "   4. 点击'换一批'按钮测试刷新"
echo "   5. 点击'查看全部'按钮"
echo ""
echo "✅ 测试2: 知识库列表页"
echo "   1. 应该跳转到 http://localhost:3000/knowledge"
echo "   2. 检查是否显示所有病害网格"
echo "   3. 测试搜索功能"
echo "   4. 测试分类筛选"
echo "   5. 点击'主页'按钮返回"
echo ""
echo "✅ 测试3: 侧边栏导航"
echo "   1. 在主页点击侧边栏'打开知识库'"
echo "      → 应该展开/收起知识库区域"
echo "   2. 在其他页面点击侧边栏'打开知识库'"
echo "      → 应该导航到知识库列表页"
echo ""
echo "✅ 测试4: 病害详情页"
echo "   1. 点击任意病害卡片"
echo "   2. 应该跳转到详情页"
echo "   3. 检查图片轮播功能"
echo "   4. 检查病原信息、发生规律、防治措施标签"
echo "   5. 点击'返回'按钮"
echo ""
echo "✅ 测试5: 多语言切换"
echo "   1. 点击语言切换按钮"
echo "   2. 检查所有文本是否正确翻译"
echo ""
echo "=================================="
echo "预期结果"
echo "=================================="
echo ""
echo "✅ 所有页面应该使用统一的病害卡片样式"
echo "✅ 图片应该正确显示"
echo "✅ 悬停效果流畅"
echo "✅ 页面导航流畅无卡顿"
echo "✅ 多语言切换正常"
echo ""
echo "如有问题，请查看:"
echo "  - 浏览器控制台 (F12)"
echo "  - 后端日志"
echo "  - KNOWLEDGE_INTEGRATION_SUMMARY.md"
echo ""

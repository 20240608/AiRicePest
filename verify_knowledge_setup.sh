#!/bin/bash

# 知识库功能验证脚本

echo "=========================================="
echo "知识库功能配置验证"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success=0
total=0

check_item() {
    total=$((total + 1))
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        success=$((success + 1))
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

# 1. 检查后端文件
echo "1. 检查后端配置..."
test -f backend/app.py
check_item $? "backend/app.py 存在"

test -f backend/routes/knowledge.py
check_item $? "backend/routes/knowledge.py 存在"

grep -q "serve_images" backend/app.py
check_item $? "app.py 包含 serve_images 路由"

grep -q "send_from_directory" backend/app.py
check_item $? "app.py 导入 send_from_directory"

echo ""

# 2. 检查前端文件
echo "2. 检查前端配置..."
test -f app/knowledge/page.tsx
check_item $? "知识库列表页面存在"

test -f app/knowledge/[id]/page.tsx
check_item $? "知识库详情页面存在"

grep -q "getImageUrl" app/knowledge/page.tsx
check_item $? "列表页包含图片 URL 处理函数"

grep -q "getImageUrl" app/knowledge/[id]/page.tsx
check_item $? "详情页包含图片 URL 处理函数"

grep -q "API_BASE_URL" app/knowledge/page.tsx
check_item $? "列表页导入 API_BASE_URL"

grep -q "Tabs" app/knowledge/[id]/page.tsx
check_item $? "详情页使用 Tabs 组件"

echo ""

# 3. 检查多语言支持
echo "3. 检查多语言配置..."
grep -q "knowledge.pathogenInfo" components/language-provider.tsx
check_item $? "包含病原信息翻译"

grep -q "knowledge.controlMeasures" components/language-provider.tsx
check_item $? "包含防治措施翻译"

echo ""

# 4. 检查图片目录
echo "4. 检查图片资源..."
test -d images
check_item $? "images 目录存在"

if [ -d images ]; then
    count=$(ls images/*.png images/*.jpeg 2>/dev/null | wc -l)
    if [ $count -gt 0 ]; then
        echo -e "${GREEN}✓${NC} 找到 $count 个图片文件"
        success=$((success + 1))
        total=$((total + 1))
    else
        echo -e "${RED}✗${NC} images 目录为空"
        total=$((total + 1))
    fi
fi

echo ""

# 5. 检查测试文件
echo "5. 检查测试工具..."
test -f backend/test_knowledge_api.py
check_item $? "API 测试脚本存在"

test -f test_knowledge_backend.sh
check_item $? "后端启动脚本存在"

test -x test_knowledge_backend.sh
check_item $? "启动脚本有执行权限"

echo ""

# 6. 检查文档
echo "6. 检查文档..."
test -f KNOWLEDGE_BASE_INTEGRATION.md
check_item $? "集成文档存在"

test -f TESTING_GUIDE.md
check_item $? "测试指南存在"

test -f KNOWLEDGE_SUMMARY.md
check_item $? "总结文档存在"

echo ""

# 总结
echo "=========================================="
echo "验证结果"
echo "=========================================="
echo -e "通过: ${GREEN}$success${NC} / $total"

if [ $success -eq $total ]; then
    echo -e "${GREEN}✓ 所有检查项通过！${NC}"
    echo ""
    echo "下一步操作："
    echo "1. 启动后端: ./test_knowledge_backend.sh"
    echo "2. 测试 API: cd backend && python3 test_knowledge_api.py"
    echo "3. 启动前端: npm run dev"
    echo "4. 访问页面: http://localhost:3000/knowledge"
elif [ $success -gt $((total * 3 / 4)) ]; then
    echo -e "${YELLOW}⚠ 大部分检查通过，但有些问题需要修复${NC}"
else
    echo -e "${RED}✗ 多个检查失败，请检查配置${NC}"
fi

echo ""

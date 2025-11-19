import { NextRequest, NextResponse } from 'next/server';

// 模拟历史记录数据库
const mockHistory = Array.from({ length: 30 }, (_, i) => ({
  id: `${i + 1}`,
  date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
  imageThumbnail: `https://via.placeholder.com/80x80?text=Image${i + 1}`,
  diseaseName: ['水稻稻瘟病', '水稻纹枯病', '水稻白叶枯病', '水稻细菌性条斑病'][i % 4],
  confidence: 75 + Math.floor(Math.random() * 20),
}));

export async function GET(request: NextRequest) {
  try {
    // 这里应该从数据库查询用户的识别历史
    // const token = request.headers.get('authorization')?.split(' ')[1];
    // 验证 token 并获取用户信息...
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return NextResponse.json({
      records: mockHistory.slice(startIndex, endIndex),
      total: mockHistory.length,
      page,
      limit,
    }, { status: 200 });
    
  } catch (error) {
    console.error('获取历史记录错误:', error);
    return NextResponse.json(
      { error: '获取历史记录失败' },
      { status: 500 }
    );
  }
}

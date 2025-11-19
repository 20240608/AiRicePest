import { NextRequest, NextResponse } from 'next/server';

// Mock data - 在实际项目中应该连接数据库
export async function GET(request: NextRequest) {
  // 验证 token
  const token = request.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 返回统计数据
  const stats = {
    totalUsers: 1250,
    totalRecognitions: 5420,
    totalFeedback: 328,
    activeUsers: 892,
  };

  return NextResponse.json(stats);
}

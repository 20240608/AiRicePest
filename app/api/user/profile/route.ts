import { NextRequest, NextResponse } from 'next/server';

const mockProfiles: Record<string, any> = {
  default: {
    username: '测试用户',
    email: 'user@example.com',
    avatar: '',
    createdAt: '2024-01-01',
    recognitionCount: 15,
  }
};

export async function GET(request: NextRequest) {
  try {
    // 这里应该从 token 中获取用户信息
    // const token = request.headers.get('authorization')?.split(' ')[1];
    
    const username = 'default'; // 从 token 解析
    const profile = mockProfiles[username] || mockProfiles.default;
    
    return NextResponse.json(profile, { status: 200 });
    
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, currentPassword, newPassword } = body;
    
    // 这里应该验证 token 并更新数据库
    // 模拟更新成功
    
    if (newPassword && !currentPassword) {
      return NextResponse.json(
        { error: '请输入当前密码' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: '更新成功',
    }, { status: 200 });
    
  } catch (error) {
    console.error('更新用户信息错误:', error);
    return NextResponse.json(
      { error: '更新失败' },
      { status: 500 }
    );
  }
}

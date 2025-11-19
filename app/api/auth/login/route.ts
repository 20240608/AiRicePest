import { NextRequest, NextResponse } from 'next/server';

// 模拟用户数据库
const users = [
  {
    id: '1',
    username: 'user001',
    email: 'user001@example.com',
    password: 'password123', // 生产环境应该使用哈希
    role: 'user',
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123', // 生产环境应该使用哈希
    role: 'admin',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 查找用户
    const user = users.find(
      (u) => (u.username === username || u.email === username) && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 生成简单的 token（生产环境应使用 JWT）
    const token = Buffer.from(`${user.id}:${user.username}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      token,
      role: user.role,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    return NextResponse.json(
      { message: '服务器错误' },
      { status: 500 }
    );
  }
}

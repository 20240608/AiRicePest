import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, phone, password } = body;

    // 验证必填字段
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    // 这里应该保存到数据库
    // 目前只是模拟成功
    console.log('New user registration:', { username, email, phone });

    return NextResponse.json({
      success: true,
      message: '注册成功',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: '服务器错误' },
      { status: 500 }
    );
  }
}

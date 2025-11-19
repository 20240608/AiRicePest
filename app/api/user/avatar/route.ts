import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const avatar = formData.get('avatar') as File;
    
    if (!avatar) {
      return NextResponse.json(
        { error: '未上传头像' },
        { status: 400 }
      );
    }

    // 这里应该将文件保存到服务器或云存储
    // 返回头像 URL
    
    return NextResponse.json({
      success: true,
      avatarUrl: 'https://via.placeholder.com/150?text=Avatar',
    }, { status: 200 });
    
  } catch (error) {
    console.error('上传头像错误:', error);
    return NextResponse.json(
      { error: '上传失败' },
      { status: 500 }
    );
  }
}

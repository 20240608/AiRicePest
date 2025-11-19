import { NextRequest, NextResponse } from 'next/server';

const feedbacks: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    
    let feedbackData: any = {};
    
    if (contentType?.includes('multipart/form-data')) {
      // 处理表单数据（包含图片）
      const formData = await request.formData();
      feedbackData = {
        content: formData.get('content'),
        contact: formData.get('contact'),
        images: [], // 这里应该处理上传的图片
        resultId: formData.get('resultId'),
      };
    } else {
      // 处理 JSON 数据
      feedbackData = await request.json();
    }
    
    const feedback = {
      id: Date.now().toString(),
      ...feedbackData,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    
    feedbacks.push(feedback);
    
    return NextResponse.json({
      success: true,
      message: '反馈提交成功',
      id: feedback.id,
    }, { status: 200 });
    
  } catch (error) {
    console.error('提交反馈错误:', error);
    return NextResponse.json(
      { error: '提交失败，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 返回所有反馈（管理员接口）
    return NextResponse.json({
      feedbacks,
      total: feedbacks.length,
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(
      { error: '获取反馈列表失败' },
      { status: 500 }
    );
  }
}

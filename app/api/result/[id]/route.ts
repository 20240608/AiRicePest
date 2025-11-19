import { NextRequest, NextResponse } from 'next/server';

const mockResults: Record<string, any> = {};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 如果没有缓存的结果，生成模拟数据
    if (!mockResults[id]) {
      mockResults[id] = {
        id,
        diseaseName: "水稻稻瘟病",
        confidence: 92,
        description: "稻瘟病是由稻梨孢菌引起的水稻重要病害之一，可危害水稻的叶片、茎秆、穗部等部位。在高温高湿条件下易爆发，是水稻生产中的主要威胁之一。",
        symptoms: [
          "叶片上出现梭形或纺锤形病斑",
          "病斑中央灰白色，边缘褐色",
          "严重时叶片枯死",
          "穗颈部受害导致白穗",
        ],
        images: [
          "https://via.placeholder.com/300x200?text=Symptom+1",
          "https://via.placeholder.com/300x200?text=Symptom+2",
          "https://via.placeholder.com/300x200?text=Symptom+3",
        ],
        solutions: [
          "选用抗病品种，合理密植，改善田间通风透光条件",
          "科学施肥，避免偏施氮肥，增施磷钾肥提高植株抗病力",
          "药剂防治：使用三环唑、稻瘟灵、春雷霉素等药剂进行喷雾",
          "发病初期及时摘除病叶，减少病源传播",
          "做好田间排水，降低湿度，控制病害蔓延",
        ],
        uploadedImage: "https://via.placeholder.com/400x300?text=Uploaded+Image",
        recognizedAt: new Date().toLocaleString('zh-CN'),
      };
    }
    
    return NextResponse.json(mockResults[id], { status: 200 });
    
  } catch (error) {
    console.error('获取结果详情错误:', error);
    return NextResponse.json(
      { error: '获取结果失败' },
      { status: 500 }
    );
  }
}

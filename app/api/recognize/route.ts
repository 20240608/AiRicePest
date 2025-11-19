import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json(
        { error: '未上传图片' },
        { status: 400 }
      );
    }

    // TODO: 集成真实的 AI 模型进行识别
    // 这里使用模拟数据
    
    // 模拟 AI 识别延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockDiseases = [
      {
        id: `rec_${Date.now()}`,
        disease_name: '水稻稻瘟病',
        confidence: 92,
        reason: '叶片上有典型的梭形病斑，中央灰白色，边缘褐色，符合稻瘟病特征。高温高湿环境，氮肥施用过多，田间积水导致病害发生。',
        suggestion: '1. 立即使用三环唑或稻瘟灵进行喷雾防治，每亩用药50-75克，兑水50公斤均匀喷施\n2. 控制氮肥用量，增施磷钾肥，提高水稻抗病能力\n3. 及时排水，降低田间湿度\n4. 摘除病叶，减少病源传播\n5. 加强田间管理，改善通风透光条件',
        description: '稻瘟病是由稻梨孢菌引起的水稻重要病害，可危害叶片、茎秆、穗部等部位。',
        symptoms: [
          '叶片上出现梭形或纺锤形病斑',
          '病斑中央灰白色，边缘褐色',
          '严重时叶片枯死',
          '穗颈部受害导致白穗'
        ],
      },
      {
        id: `rec_${Date.now() + 1}`,
        disease_name: '水稻纹枯病',
        confidence: 88,
        reason: '叶鞘上有云纹状病斑，病斑边缘不整齐，呈水渍状，符合纹枯病症状。',
        suggestion: '1. 使用井冈霉素、苯醚甲环唑等药剂防治\n2. 合理密植，改善田间通风条件\n3. 科学灌溉，避免长期深灌\n4. 增施有机肥和磷钾肥，提高抗病性',
        description: '纹枯病由立枯丝核菌引起，主要危害叶鞘和叶片，在高温高湿环境下易发生。',
        symptoms: [
          '叶鞘上出现云纹状病斑',
          '病斑边缘不整齐，呈水渍状',
          '严重时病斑扩展至叶片',
          '后期病斑中部呈灰褐色'
        ],
      },
      {
        id: `rec_${Date.now() + 2}`,
        disease_name: '水稻白叶枯病',
        confidence: 85,
        reason: '叶片边缘出现黄白色条斑，病健交界明显，符合白叶枯病特征。',
        suggestion: '1. 发病初期喷施叶枯唑、噻枯唑等药剂\n2. 选用抗病品种\n3. 合理施肥，避免偏施氮肥\n4. 做好田间排水，降低湿度',
        description: '白叶枯病是由细菌引起的病害，主要危害叶片，严重影响产量。',
        symptoms: [
          '叶片边缘出现黄白色条斑',
          '病健交界明显',
          '严重时整叶枯死',
          '病部有菌脓溢出'
        ],
      },
    ];

    // 随机选择一个病害结果
    const result = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
    
    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('识别错误:', error);
    return NextResponse.json(
      { error: '识别失败，请稍后重试' },
      { status: 500 }
    );
  }
}

// 处理 OPTIONS 请求（CORS）
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

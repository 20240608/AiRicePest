import { NextRequest, NextResponse } from 'next/server';

const mockDiseases = [
  {
    id: '1',
    name: '水稻稻瘟病',
    description: '由稻梨孢菌引起，危害叶片、穗颈等部位，是水稻主要病害之一。',
    image: 'https://via.placeholder.com/300x200?text=Rice+Blast',
    category: '真菌病害',
    severity: 'high',
  },
  {
    id: '2',
    name: '水稻纹枯病',
    description: '由立枯丝核菌引起，主要危害叶鞘和叶片，高温高湿环境易发生。',
    image: 'https://via.placeholder.com/300x200?text=Sheath+Blight',
    category: '真菌病害',
    severity: 'high',
  },
  {
    id: '3',
    name: '水稻白叶枯病',
    description: '由细菌引起，叶片出现白色条斑，严重影响产量。',
    image: 'https://via.placeholder.com/300x200?text=Bacterial+Blight',
    category: '细菌病害',
    severity: 'medium',
  },
  {
    id: '4',
    name: '水稻细菌性条斑病',
    description: '细菌性病害，叶片出现黄褐色条斑，高温多雨季节易发生。',
    image: 'https://via.placeholder.com/300x200?text=Bacterial+Streak',
    category: '细菌病害',
    severity: 'medium',
  },
  {
    id: '5',
    name: '水稻褐飞虱',
    description: '刺吸式口器害虫，吸食植株汁液，传播病毒病。',
    image: 'https://via.placeholder.com/300x200?text=Brown+Planthopper',
    category: '虫害',
    severity: 'high',
  },
  {
    id: '6',
    name: '水稻螟虫',
    description: '钻蛀性害虫，幼虫蛀食茎秆，造成枯心或白穗。',
    image: 'https://via.placeholder.com/300x200?text=Stem+Borer',
    category: '虫害',
    severity: 'high',
  },
  {
    id: '7',
    name: '水稻稻瘟病叶瘟',
    description: '稻瘟病在叶片上的表现形式，病斑呈梭形。',
    image: 'https://via.placeholder.com/300x200?text=Leaf+Blast',
    category: '真菌病害',
    severity: 'medium',
  },
  {
    id: '8',
    name: '水稻稻曲病',
    description: '真菌病害，使稻粒变成墨绿色菌核，影响米质。',
    image: 'https://via.placeholder.com/300x200?text=False+Smut',
    category: '真菌病害',
    severity: 'low',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let diseases = mockDiseases;
    if (category && category !== '全部') {
      diseases = diseases.filter(d => d.category === category);
    }
    
    return NextResponse.json({
      diseases,
      total: diseases.length,
    }, { status: 200 });
    
  } catch (error) {
    console.error('获取病害列表错误:', error);
    return NextResponse.json(
      { error: '获取病害列表失败' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

// Mock data
const mockFeedbacks = [
  {
    id: '1',
    userId: 'user001',
    username: 'user001',
    content: '识别结果不准确，建议改进算法',
    status: 'pending',
    createdAt: '2024-03-15 10:30:00',
  },
  {
    id: '2',
    userId: 'user002',
    username: 'user002',
    content: '界面很好用，但是加载速度有点慢',
    imageUrl: 'https://example.com/screenshot.jpg',
    status: 'processed',
    createdAt: '2024-03-14 15:20:00',
    processedAt: '2024-03-15 09:00:00',
  },
];

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(mockFeedbacks);
}

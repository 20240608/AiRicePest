import { NextRequest, NextResponse } from 'next/server';

// Mock data
const mockAdmins = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'super_admin',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    username: 'manager',
    email: 'manager@example.com',
    role: 'admin',
    createdAt: '2024-02-20',
  },
];

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(mockAdmins);
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  
  // 实际应该保存到数据库
  const newAdmin = {
    id: String(Date.now()),
    ...body,
    createdAt: new Date().toISOString().split('T')[0],
  };

  return NextResponse.json(newAdmin, { status: 201 });
}

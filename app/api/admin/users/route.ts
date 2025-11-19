import { NextRequest, NextResponse } from 'next/server';

// Mock data
const mockUsers = [
  {
    id: '1',
    username: 'user001',
    email: 'user001@example.com',
    phone: '13800138000',
    status: 'active',
    registeredAt: '2024-01-10',
    lastLogin: '2024-03-15',
  },
  {
    id: '2',
    username: 'user002',
    email: 'user002@example.com',
    status: 'active',
    registeredAt: '2024-02-05',
    lastLogin: '2024-03-14',
  },
];

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(mockUsers);
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  
  const newUser = {
    id: String(Date.now()),
    ...body,
    status: 'active',
    registeredAt: new Date().toISOString().split('T')[0],
  };

  return NextResponse.json(newUser, { status: 201 });
}

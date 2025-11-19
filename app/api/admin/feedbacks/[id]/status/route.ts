import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = await context.params;
  const body = await request.json();
  const { status } = body;
  
  return NextResponse.json({ 
    success: true, 
    id: params.id, 
    status,
    processedAt: new Date().toISOString(),
  });
}

import { NextRequest, NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${API}/contact`, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || 'فشل إرسال الرسالة' },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to submit contact form'
  });
}

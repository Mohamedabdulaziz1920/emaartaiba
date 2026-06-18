import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 🔍 جلب البيانات من Query Params أو Body
    let secret = request.nextUrl.searchParams.get('secret');
    let path = request.nextUrl.searchParams.get('path');
    let tag = request.nextUrl.searchParams.get('tag');

    // إذا لم تكن في Query، جرب من Body (JSON)
    if (!secret || !path && !tag) {
      try {
        const body = await request.json();
        secret = secret || body.secret;
        path = path || body.path;
        tag = tag || body.tag;
      } catch {
        // تجاهل إذا لم يكن JSON
      }
    }

    // 🔐 التحقق من السر
    if (secret !== process.env.REVALIDATE_SECRET && secret !== 'dev-secret') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    // ✅ إعادة التحقق
    const revalidated: string[] = [];

    if (path) {
      revalidatePath(path);
      revalidated.push(`path: ${path}`);
    }

    if (tag) {
      // @ts-ignore - Next.js type mismatch
      revalidateTag(tag);
      revalidated.push(`tag: ${tag}`);
    }

    // 🔄 إعادة تحقق شاملة من الـ Layout (يطبق التغييرات على كل الصفحات)
    revalidatePath('/', 'layout');
    revalidated.push('layout: /');

    return NextResponse.json({
      revalidated: true,
      items: revalidated,
      now: Date.now(),
    });
  } catch (e: unknown) {
    const error = e as Error;
    return NextResponse.json(
      {
        error: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST with ?secret=YOUR_SECRET&path=/path or &tag=TAG (or in JSON body)',
  });
}
import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { secret, tag } = body;

    if (secret !== process.env.REVALIDATION_SECRET) {
      console.error('[Revalidation] Invalid secret');
      return NextResponse.json(
        { message: 'Token de autenticação inválido' },
        { status: 401 }
      );
    }

    if (!tag) {
      console.error('[Revalidation] Missing tag');
      return NextResponse.json(
        { message: 'Tag de revalidação não fornecida' },
        { status: 400 }
      );
    }

    console.log(`[Revalidation] Starting revalidation for tag: ${tag}`);

    revalidateTag(tag);
    
    revalidatePath('/', 'layout');

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`[Revalidation] Success - Tag: ${tag}, Duration: ${duration}ms`);

    return NextResponse.json(
      {
        revalidated: true,
        tag,
        now: Date.now(),
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (err) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.error('[Revalidation] Error:', err);
    
    return NextResponse.json(
      { 
        message: 'Erro ao processar revalidação', 
        error: err instanceof Error ? err.message : 'Unknown error',
        duration: `${duration}ms`
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'API de revalidação funcionando',
      endpoint: '/api/revalidate',
      method: 'POST',
      requiredParams: ['secret', 'tag'],
      timestamp: Date.now(),
      environment: process.env.NODE_ENV
    },
    { status: 200 }
  );
}
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        '@context': '/api/contexts/TelegramAccount',
        '@id': '/api/telegram-accounts',
        '@type': 'hydra:Collection',
        'hydra:totalItems': 0,
        'hydra:member': []
    }, {
        headers: {
            'Content-Type': 'application/ld+json',
            'Access-Control-Allow-Origin': '*',
        }
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const id = Date.now();

        return NextResponse.json({
            '@id': `/api/telegram_accounts/${id}`,
            id,
            name: body?.name || 'Telegram',
            apiId: body?.apiId,
            apiHash: body?.apiHash
        }, {
            status: 201,
            headers: {
                'Content-Type': 'application/ld+json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

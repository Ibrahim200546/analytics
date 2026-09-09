import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json({
            '@id': `/api/users/${session.user.id}`,
            '@type': 'User',
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            roles: session.user.roles || ['ROLE_ADMIN', 'ROLE_USER']
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

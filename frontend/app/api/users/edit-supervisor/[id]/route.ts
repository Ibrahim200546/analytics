import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { auth } from '@/auth';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : (await auth())?.user?.token;
        const supabase = createSupabaseServerClient(token);
        const { id: rawId } = await params;
        const id = rawId.replace('.jsonld', '').replace('.json', '').replace('/api/users/', '').replace('/users/', '').trim();

        const body = await request.json();

        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
        };

        if (body.firstName !== undefined || body.first_name !== undefined) {
            updateData.first_name = (body.firstName ?? body.first_name ?? '').trim();
        }
        if (body.lastName !== undefined || body.last_name !== undefined) {
            updateData.last_name = (body.lastName ?? body.last_name ?? '').trim();
        }
        if (body.patronymic !== undefined) {
            updateData.patronymic = (body.patronymic ?? '').trim();
        }
        if (body.iin !== undefined) {
            updateData.iin = (body.iin ?? '').trim();
        }
        if (body.email !== undefined) {
            updateData.email = (body.email ?? '').trim();
        }

        const { data, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({
            '@context': '/api/contexts/User',
            '@id': `/api/users/${data.id}`,
            '@type': 'User',
            id: data.id,
            name: `${data.last_name || ''} ${data.first_name || ''} ${data.patronymic || ''}`.trim() || data.email,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
            patronymic: data.patronymic,
            iin: data.iin,
            roles: data.roles || ['ROLE_USER', 'ROLE_SUPERVISOR'],
            ...data
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

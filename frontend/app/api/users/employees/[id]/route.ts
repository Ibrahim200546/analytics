import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : (await auth())?.user?.token;
        const supabase = createSupabaseServerClient(token);
        const { id } = await params;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
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
            roles: data.roles || ['ROLE_USER', 'ROLE_EMPLOYEE']
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

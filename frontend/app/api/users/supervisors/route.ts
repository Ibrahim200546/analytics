import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : (await auth())?.user?.token;
        const supabase = createSupabaseServerClient(token);

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('last_name', { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const items = (data || []).map((p: {
            id: string;
            email: string;
            first_name?: string | null;
            last_name?: string | null;
            patronymic?: string | null;
            iin?: string | null;
        }) => ({
            '@id': `/api/users/${p.id}`,
            '@type': 'User',
            id: p.id,
            email: p.email,
            firstName: p.first_name || '',
            lastName: p.last_name || '',
            patronymic: p.patronymic || '',
            iin: p.iin || ''
        }));

        return NextResponse.json(items);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

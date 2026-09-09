import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { auth } from '@/auth';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : (await auth())?.user?.token;
        const supabase = createSupabaseServerClient(token);

        const { data, error } = await supabase
            .from('organizations')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'No organization found' }, { status: 404 });
        }

        const org = {
            '@context': '/api/contexts/Organization',
            '@id': `/api/organizations/${data.id}`,
            '@type': 'Organization',
            id: data.id,
            name: data.name,
            bin: data.bin,
            city: data.city ? { name: data.city } : null,
            employeeLimit: data.employee_limit ?? 10,
            projectLimit: data.project_limit ?? 5,
            limitEmployees: data.employee_limit ?? 10,
            limitProjects: data.project_limit ?? 5,
            createdAt: data.created_at,
            subscription: null,
            supervisor: null
        };

        return NextResponse.json(org);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

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
        const { searchParams } = new URL(request.url);
        const orgParam = searchParams.get('organization');
        let orgId: number | undefined;

        if (orgParam) {
            const match = orgParam.match(/\d+/);
            if (match) orgId = parseInt(match[0]);
        }

        let query = supabase.from('projects').select('*', { count: 'exact' });
        if (orgId) {
            query = query.eq('organization_id', orgId);
        }

        const { data, count } = await query.order('created_at', { ascending: false });

        const members = (data || []).map(row => ({
            '@id': `/api/projects/${row.id}`,
            '@type': 'Project',
            id: row.id,
            name: row.name,
            tags: Array.isArray(row.tags) ? row.tags.join(', ') : (row.tags ?? ''),
            disabled: row.disabled ?? false,
            createdAt: row.created_at,
            created_at: row.created_at,
            organization: `/api/organizations/${row.organization_id}`
        }));

        return NextResponse.json({
            '@context': '/api/contexts/Project',
            '@id': '/api/projects',
            '@type': 'hydra:Collection',
            'hydra:totalItems': count ?? members.length,
            'hydra:member': members,
            'hydra:view': {
                '@id': '/api/projects?page=1',
                '@type': 'hydra:PartialCollectionView',
                'hydra:first': '/api/projects?page=1',
                'hydra:last': '/api/projects?page=1'
            }
        });
    } catch {
        return NextResponse.json({
            '@context': '/api/contexts/Project',
            '@id': '/api/projects',
            '@type': 'hydra:Collection',
            'hydra:totalItems': 0,
            'hydra:member': []
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        const token = session?.user?.token;
        const supabase = createSupabaseServerClient(token);
        const body = await request.json();

        let organizationId = body.organizationId;
        if (!organizationId && body.organization) {
            const match = String(body.organization).match(/\d+/);
            if (match) organizationId = parseInt(match[0]);
        }

        if (!organizationId) {
            const { data: firstOrg } = await supabase.from('organizations').select('id').limit(1).single();
            organizationId = firstOrg?.id;
        }

        const { data, error } = await supabase.from('projects').insert({
            name: body.name || 'Новый проект',
            organization_id: organizationId,
            tags: Array.isArray(body.tags) ? body.tags : []
        }).select().single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({
            '@id': `/api/projects/${data.id}`,
            '@type': 'Project',
            id: data.id,
            name: data.name,
            tags: data.tags,
            createdAt: data.created_at
        }, { status: 201 });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

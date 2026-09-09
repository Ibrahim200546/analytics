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
        const orgIdParam = searchParams.get('organizationId') || searchParams.get('organization');
        let orgId: number | undefined;

        if (orgIdParam) {
            const match = orgIdParam.match(/\d+/);
            if (match) orgId = parseInt(match[0]);
        }

        let query = supabase.from('projects').select('*', { count: 'exact' });
        if (orgId) {
            query = query.eq('organization_id', orgId);
        }

        const { data, count, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching projects for organization:', error);
        }

        const members = (data || []).map(row => ({
            '@id': `/api/projects/${row.id}`,
            '@type': 'Project',
            id: row.id,
            name: row.name,
            tags: Array.isArray(row.tags) ? row.tags : [],
            disabled: row.disabled ?? false,
            createdAt: row.created_at,
            created_at: row.created_at,
            organization: `/api/organizations/${row.organization_id}`
        }));

        return NextResponse.json({
            '@context': '/api/contexts/Project',
            '@id': '/api/projects/for-my-organization',
            '@type': 'hydra:Collection',
            'hydra:totalItems': count ?? members.length,
            'hydra:member': members,
            'hydra:view': {
                '@id': '/api/projects/for-my-organization?page=1',
                '@type': 'hydra:PartialCollectionView',
                'hydra:first': '/api/projects/for-my-organization?page=1',
                'hydra:last': '/api/projects/for-my-organization?page=1'
            }
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error('Error in /api/projects/for-my-organization:', message);
        return NextResponse.json({
            '@context': '/api/contexts/Project',
            '@id': '/api/projects/for-my-organization',
            '@type': 'hydra:Collection',
            'hydra:totalItems': 0,
            'hydra:member': []
        });
    }
}

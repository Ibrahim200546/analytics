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

        const page = parseInt(searchParams.get('page') || '1') || 1;
        const limit = parseInt(searchParams.get('itemsPerPage') || '10') || 10;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const orgParam = searchParams.get('organizationId') || searchParams.get('organization');
        let orgId: number | null = null;
        if (orgParam) {
            const parsed = parseInt(orgParam.replace('/api/organizations/', ''));
            if (!isNaN(parsed)) orgId = parsed;
        }

        let userIds: string[] = [];
        let totalCount = 0;

        if (orgId !== null) {
            const { data: members, count, error: mError } = await supabase
                .from('organization_members')
                .select('user_id', { count: 'exact' })
                .eq('organization_id', orgId)
                .eq('role', 'ROLE_EMPLOYEE')
                .range(from, to);

            if (!mError && members) {
                userIds = members.map(m => m.user_id);
                totalCount = count ?? userIds.length;
            }
        } else {
            const { data: members, count, error: mError } = await supabase
                .from('organization_members')
                .select('user_id', { count: 'exact' })
                .eq('role', 'ROLE_EMPLOYEE')
                .range(from, to);

            if (!mError && members) {
                userIds = members.map(m => m.user_id);
                totalCount = count ?? userIds.length;
            }
        }

        interface ProfileRecord {
            id: string;
            email: string;
            first_name?: string;
            last_name?: string;
            patronymic?: string;
            iin?: string;
            roles?: string[];
        }

        let profiles: ProfileRecord[] = [];
        if (userIds.length > 0) {
            const { data: pData } = await supabase
                .from('profiles')
                .select('*')
                .in('id', userIds);
            profiles = (pData || []) as ProfileRecord[];
        }

        const members = profiles.map(p => ({
            '@id': `/api/users/${p.id}`,
            '@type': 'User',
            id: p.id,
            name: `${p.last_name || ''} ${p.first_name || ''} ${p.patronymic || ''}`.trim() || p.email,
            email: p.email,
            firstName: p.first_name,
            lastName: p.last_name,
            patronymic: p.patronymic,
            iin: p.iin,
            roles: p.roles || ['ROLE_USER', 'ROLE_EMPLOYEE']
        }));

        const lastPage = Math.max(1, Math.ceil(totalCount / limit));

        return NextResponse.json({
            '@context': '/api/contexts/User',
            '@id': '/api/users/employees',
            '@type': 'hydra:Collection',
            'hydra:totalItems': totalCount,
            'hydra:member': members,
            'hydra:view': {
                '@id': `/api/users/employees?page=${page}`,
                '@type': 'hydra:PartialCollectionView',
                'hydra:first': '/api/users/employees?page=1',
                'hydra:last': `/api/users/employees?page=${lastPage}`,
                ...(page > 1 ? { 'hydra:previous': `/api/users/employees?page=${page - 1}` } : {}),
                ...(page < lastPage ? { 'hydra:next': `/api/users/employees?page=${page + 1}` } : {})
            }
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error('Error in GET /api/users/employees:', message);
        return NextResponse.json({
            '@context': '/api/contexts/User',
            '@id': '/api/users/employees',
            '@type': 'hydra:Collection',
            'hydra:totalItems': 0,
            'hydra:member': []
        });
    }
}

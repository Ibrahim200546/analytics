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

        const orgParam = searchParams.get('organization') || searchParams.get('organizationId') || searchParams.get('organization_id');
        let orgId: number | null = null;
        if (orgParam) {
            const parsed = parseInt(orgParam.replace('/api/organizations/', ''));
            if (!isNaN(parsed)) orgId = parsed;
        }

        let query = supabase
            .from('organization_accounts')
            .select('*', { count: 'exact' });

        if (orgId !== null) {
            query = query.eq('organization_id', orgId);
        }

        const { data, count, error } = await query
            .order('id', { ascending: false })
            .range(from, to);

        if (error) {
            console.error('Supabase error fetching organization accounts:', error);
            return NextResponse.json({
                '@context': '/api/contexts/OrganizationAccount',
                '@id': '/api/organization-accounts',
                '@type': 'hydra:Collection',
                'hydra:totalItems': 0,
                'hydra:member': [],
                'hydra:view': {
                    '@id': `/api/organization-accounts?page=${page}`,
                    '@type': 'hydra:PartialCollectionView',
                    'hydra:first': '/api/organization-accounts?page=1',
                    'hydra:last': '/api/organization-accounts?page=1',
                }
            });
        }

        const members = (data || []).map(row => ({
            '@id': `/api/organization-accounts/${row.id}`,
            '@type': 'OrganizationAccount',
            id: row.id,
            accountName: row.account_name,
            parserName: row.parser_name,
            options: row.options || {},
            organization: {
                id: row.organization_id,
                '@id': `/api/organizations/${row.organization_id}`
            },
            createdAt: row.created_at
        }));

        const total = count ?? members.length;
        const lastPage = Math.max(1, Math.ceil(total / limit));

        return NextResponse.json({
            '@context': '/api/contexts/OrganizationAccount',
            '@id': '/api/organization-accounts',
            '@type': 'hydra:Collection',
            'hydra:totalItems': total,
            'hydra:member': members,
            'hydra:view': {
                '@id': `/api/organization-accounts?page=${page}`,
                '@type': 'hydra:PartialCollectionView',
                'hydra:first': '/api/organization-accounts?page=1',
                'hydra:last': `/api/organization-accounts?page=${lastPage}`,
                ...(page > 1 ? { 'hydra:previous': `/api/organization-accounts?page=${page - 1}` } : {}),
                ...(page < lastPage ? { 'hydra:next': `/api/organization-accounts?page=${page + 1}` } : {})
            }
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error('Error in GET /api/organization-accounts:', message);
        return NextResponse.json({
            '@context': '/api/contexts/OrganizationAccount',
            '@id': '/api/organization-accounts',
            '@type': 'hydra:Collection',
            'hydra:totalItems': 0,
            'hydra:member': []
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : (await auth())?.user?.token;
        const supabase = createSupabaseServerClient(token);
        const body = await request.json();

        let orgId = body.organization_id || body.organizationId;
        if (!orgId && body.organization) {
            orgId = typeof body.organization === 'string'
                ? parseInt(body.organization.replace('/api/organizations/', ''))
                : (body.organization.id ?? body.organization);
        }

        const insertPayload = {
            organization_id: orgId,
            parser_name: body.parserName || body.parser_name || 'Telegram',
            account_name: body.accountName || body.account_name || 'Account',
            options: body.options || {}
        };

        const { data, error } = await supabase
            .from('organization_accounts')
            .insert(insertPayload)
            .select()
            .single();

        if (error) {
            console.error('Supabase error creating organization account:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({
            '@id': `/api/organization-accounts/${data.id}`,
            '@type': 'OrganizationAccount',
            id: data.id,
            accountName: data.account_name,
            parserName: data.parser_name,
            options: data.options,
            organization: {
                id: data.organization_id,
                '@id': `/api/organizations/${data.organization_id}`
            }
        }, { status: 201 });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

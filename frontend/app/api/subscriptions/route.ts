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

        const orgParam = searchParams.get('organization') || searchParams.get('organizationId') || searchParams.get('organization_id');
        let query = supabase.from('subscriptions').select('*');
        if (orgParam) {
            const orgId = parseInt(orgParam.replace('/api/organizations/', ''));
            if (!isNaN(orgId)) {
                query = query.eq('organization_id', orgId);
            }
        }

        const { data, error } = await query.order('ends_at', { ascending: false });
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const members = (data || []).map(row => ({
            '@context': '/api/contexts/Subscription',
            '@id': `/api/subscriptions/${row.id}`,
            '@type': 'Subscription',
            id: row.id,
            type: row.type === 'trial' ? 'demo' : 'general',
            start: row.starts_at,
            end: row.ends_at,
            active: row.active,
            price: row.price,
            priceForProjectImprovements: row.price_for_project_improvements
        }));

        return NextResponse.json({
            '@context': '/api/contexts/Subscription',
            '@id': '/api/subscriptions',
            '@type': 'hydra:Collection',
            'hydra:totalItems': members.length,
            'hydra:member': members
        }, {
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

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : (await auth())?.user?.token;
        const supabase = createSupabaseServerClient(token);
        const body = await request.json();

        let orgId: number | null = null;
        if (typeof body.organization === 'string') {
            const match = body.organization.match(/\/(\d+)$/);
            orgId = match ? parseInt(match[1], 10) : parseInt(body.organization, 10);
        } else if (typeof body.organization === 'number') {
            orgId = body.organization;
        } else if (body.organization && typeof body.organization === 'object' && body.organization.id) {
            orgId = parseInt(body.organization.id, 10);
        } else if (body.organization_id) {
            orgId = parseInt(body.organization_id, 10);
        }

        if (!orgId || isNaN(orgId)) {
            return NextResponse.json({ error: 'Invalid or missing organization id' }, { status: 400 });
        }

        let mappedType: 'trial' | 'monthly' = 'monthly';
        if (body.type === 'demo' || body.type === 'trial') {
            mappedType = 'trial';
        } else {
            mappedType = 'monthly';
        }

        const starts_at = body.start
            ? new Date(body.start).toISOString()
            : (body.starts_at ? new Date(body.starts_at).toISOString() : new Date().toISOString());

        const ends_at = body.end
            ? new Date(body.end).toISOString()
            : (body.ends_at ? new Date(body.ends_at).toISOString() : starts_at);

        const price = body.price != null ? parseInt(body.price, 10) : null;
        const priceForProjectImprovements = (body.priceForProjectImprovements ?? body.price_for_project_improvements) != null
            ? parseInt(body.priceForProjectImprovements ?? body.price_for_project_improvements, 10)
            : null;

        const { data, error } = await supabase
            .from('subscriptions')
            .insert({
                organization_id: orgId,
                type: mappedType,
                starts_at,
                ends_at,
                price,
                price_for_project_improvements: priceForProjectImprovements,
                active: true
            })
            .select()
            .single();

        if (error || !data) {
            return NextResponse.json({ error: error?.message || 'Failed to create subscription' }, { status: 400 });
        }

        return NextResponse.json({
            '@context': '/api/contexts/Subscription',
            '@id': `/api/subscriptions/${data.id}`,
            '@type': 'Subscription',
            id: data.id,
            type: data.type === 'trial' ? 'demo' : 'general',
            start: data.starts_at,
            end: data.ends_at,
            active: data.active,
            price: data.price,
            priceForProjectImprovements: data.price_for_project_improvements
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

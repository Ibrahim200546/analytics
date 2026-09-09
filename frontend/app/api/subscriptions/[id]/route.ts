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
        const { id: rawId } = await params;
        const id = parseInt(rawId.replace('.jsonld', '').replace('.json', ''), 10);

        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : (await auth())?.user?.token;
        const supabase = createSupabaseServerClient(token);
        const { id: rawId } = await params;
        const id = parseInt(rawId.replace('.jsonld', '').replace('.json', ''), 10);
        const body = await request.json();

        const updateData: Record<string, unknown> = {};

        if (body.type !== undefined) {
            updateData.type = (body.type === 'demo' || body.type === 'trial') ? 'trial' : 'monthly';
        }
        if (body.start !== undefined || body.starts_at !== undefined) {
            const val = body.start ?? body.starts_at;
            updateData.starts_at = val ? new Date(val).toISOString() : null;
        }
        if (body.end !== undefined || body.ends_at !== undefined) {
            const val = body.end ?? body.ends_at;
            updateData.ends_at = val ? new Date(val).toISOString() : null;
        }
        if (body.price !== undefined) {
            updateData.price = body.price != null ? parseInt(body.price, 10) : null;
        }
        if (body.priceForProjectImprovements !== undefined || body.price_for_project_improvements !== undefined) {
            const val = body.priceForProjectImprovements ?? body.price_for_project_improvements;
            updateData.price_for_project_improvements = val != null ? parseInt(val, 10) : null;
        }
        if (body.active !== undefined) {
            updateData.active = Boolean(body.active);
        }
        if (body.organization !== undefined || body.organization_id !== undefined) {
            let orgId: number | null = null;
            if (typeof body.organization === 'string') {
                const match = body.organization.match(/\/(\d+)$/);
                orgId = match ? parseInt(match[1], 10) : parseInt(body.organization, 10);
            } else if (typeof body.organization === 'number') {
                orgId = body.organization;
            } else if (body.organization?.id) {
                orgId = parseInt(body.organization.id, 10);
            } else if (body.organization_id) {
                orgId = parseInt(body.organization_id, 10);
            }
            if (orgId && !isNaN(orgId)) {
                updateData.organization_id = orgId;
            }
        }

        const { data, error } = await supabase
            .from('subscriptions')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            return NextResponse.json({ error: error?.message || 'Failed to update subscription' }, { status: 400 });
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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : (await auth())?.user?.token;
        const supabase = createSupabaseServerClient(token);
        const { id: rawId } = await params;
        const id = parseInt(rawId.replace('.jsonld', '').replace('.json', ''), 10);

        const { error } = await supabase
            .from('subscriptions')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return new NextResponse(null, { status: 204 });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

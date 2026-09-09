import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { auth } from '@/auth';

export async function DELETE(
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

        const { searchParams } = new URL(request.url);
        const orgParam = searchParams.get('organizationId') || searchParams.get('organization');

        let query = supabase
            .from('organization_members')
            .delete()
            .eq('user_id', id)
            .eq('role', 'ROLE_EMPLOYEE');

        if (orgParam) {
            const orgId = parseInt(orgParam.replace('/api/organizations/', ''));
            if (!isNaN(orgId)) {
                query = query.eq('organization_id', orgId);
            }
        }

        const { error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return new NextResponse(null, { status: 204 });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

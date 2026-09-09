import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { auth } from '@/auth';

export async function PUT(
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
        const orgId = parseInt(rawId.replace('.jsonld', '').replace('.json', ''));

        if (isNaN(orgId)) {
            return NextResponse.json({ error: 'Invalid organization ID' }, { status: 400 });
        }

        const body = await request.json();
        let supervisorId: string | null = null;

        if (typeof body.supervisor === 'string') {
            supervisorId = body.supervisor.replace('/api/users/', '').replace('/users/', '').trim();
        } else if (body.supervisor && typeof body.supervisor === 'object' && body.supervisor.id) {
            const raw = String(body.supervisor.id);
            supervisorId = raw.replace('/api/users/', '').replace('/users/', '').trim();
        } else if (body.supervisor_id) {
            supervisorId = String(body.supervisor_id).replace('/api/users/', '').trim();
        } else if (body.supervisorId) {
            supervisorId = String(body.supervisorId).replace('/api/users/', '').trim();
        }

        if (!supervisorId) {
            return NextResponse.json({ error: 'Supervisor ID is required' }, { status: 400 });
        }

        // Update organizations table: supervisor_id = supervisorId
        const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .update({
                supervisor_id: supervisorId,
                updated_at: new Date().toISOString()
            })
            .eq('id', orgId)
            .select()
            .single();

        if (orgError) {
            return NextResponse.json({ error: orgError.message }, { status: 400 });
        }

        // Upsert organization_members: organization_id, user_id, role: 'ROLE_SUPERVISOR'
        const { error: memberError } = await supabase
            .from('organization_members')
            .upsert({
                organization_id: orgId,
                user_id: supervisorId,
                role: 'ROLE_SUPERVISOR'
            });

        if (memberError) {
            return NextResponse.json({ error: memberError.message }, { status: 400 });
        }

        // Ensure the supervisor has ROLE_SUPERVISOR in their profile roles
        const { data: profile } = await supabase
            .from('profiles')
            .select('roles')
            .eq('id', supervisorId)
            .maybeSingle();

        if (profile && !profile.roles?.includes('ROLE_SUPERVISOR')) {
            const updatedRoles = [...(profile.roles || ['ROLE_USER']), 'ROLE_SUPERVISOR'];
            await supabase
                .from('profiles')
                .update({
                    roles: updatedRoles,
                    updated_at: new Date().toISOString()
                })
                .eq('id', supervisorId);
        }

        return NextResponse.json(orgData);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

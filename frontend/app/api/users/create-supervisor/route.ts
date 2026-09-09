import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : (await auth())?.user?.token;
        const supabase = createSupabaseServerClient(token);
        const { searchParams } = new URL(request.url);
        const orgParam = searchParams.get('organizationId') || searchParams.get('organization');
        const orgId = orgParam ? parseInt(orgParam.replace('/api/organizations/', '')) : null;

        const body = await request.json();
        const firstName = (body.firstName ?? body.first_name ?? '').trim();
        const lastName = (body.lastName ?? body.last_name ?? '').trim();
        const patronymic = (body.patronymic ?? '').trim();
        const iin = (body.iin ?? '').trim();
        const email = body.email ? body.email.trim() : `${iin || Date.now()}@smi.kz`;

        // Check if profile exists
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id, roles')
            .eq('email', email)
            .maybeSingle();

        let userId = existingProfile?.id;

        if (!userId) {
            const { data: authData } = await supabase.auth.signUp({
                email,
                password: body.plainPassword || 'Password123!',
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        patronymic,
                        iin,
                        roles: ['ROLE_USER', 'ROLE_SUPERVISOR']
                    }
                }
            });

            userId = authData?.user?.id;
        }

        if (userId) {
            const existingRoles = existingProfile?.roles || [];
            const rolesSet = new Set([...existingRoles, 'ROLE_USER', 'ROLE_SUPERVISOR']);
            const updatedRoles = Array.from(rolesSet);

            const { error: profileError } = await supabase.from('profiles').upsert({
                id: userId,
                email,
                first_name: firstName,
                last_name: lastName,
                patronymic,
                iin,
                roles: updatedRoles,
                updated_at: new Date().toISOString()
            });

            if (profileError) {
                return NextResponse.json({ error: profileError.message }, { status: 400 });
            }

            if (orgId && !isNaN(orgId)) {
                await supabase
                    .from('organizations')
                    .update({
                        supervisor_id: userId,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', orgId);

                await supabase.from('organization_members').upsert({
                    organization_id: orgId,
                    user_id: userId,
                    role: 'ROLE_SUPERVISOR'
                });
            }
        }

        return NextResponse.json({
            '@context': '/api/contexts/User',
            '@id': `/api/users/${userId}`,
            '@type': 'User',
            id: userId,
            email,
            firstName,
            lastName,
            patronymic,
            iin,
            roles: ['ROLE_USER', 'ROLE_SUPERVISOR']
        }, { status: 201 });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

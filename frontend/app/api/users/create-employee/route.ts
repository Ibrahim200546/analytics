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
        const email = body.email ? body.email.trim() : `${body.iin || Date.now()}@smi.kz`;

        // Check if profile exists
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        let userId = existingProfile?.id;

        if (!userId) {
            const { data: authData } = await supabase.auth.signUp({
                email,
                password: body.plainPassword || 'Password123!',
                options: {
                    data: {
                        first_name: body.firstName || '',
                        last_name: body.lastName || '',
                        patronymic: body.patronymic || '',
                        iin: body.iin || '',
                        roles: ['ROLE_USER', 'ROLE_EMPLOYEE']
                    }
                }
            });

            userId = authData?.user?.id;
        }

        if (userId) {
            await supabase.from('profiles').upsert({
                id: userId,
                email,
                first_name: body.firstName || '',
                last_name: body.lastName || '',
                patronymic: body.patronymic || '',
                iin: body.iin || '',
                roles: ['ROLE_USER', 'ROLE_EMPLOYEE']
            });

            if (orgId) {
                await supabase.from('organization_members').upsert({
                    organization_id: orgId,
                    user_id: userId,
                    role: 'ROLE_EMPLOYEE'
                });
            }
        }

        return NextResponse.json({
            id: userId,
            email,
            firstName: body.firstName,
            lastName: body.lastName,
            patronymic: body.patronymic,
            iin: body.iin
        }, { status: 201 });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

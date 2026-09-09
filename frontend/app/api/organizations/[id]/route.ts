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
        const id = parseInt(rawId.replace('.jsonld', '').replace('.json', ''));

        const { data, error } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        const org = {
            '@context': '/api/contexts/Organization',
            '@id': `/api/organizations/${data.id}`,
            '@type': 'Organization',
            id: data.id,
            name: data.name,
            bin: data.bin,
            city: data.city ? { name: data.city } : null,
            employeeLimit: data.employee_limit ?? 10,
            projectLimit: data.project_limit ?? 5,
            limitEmployees: data.employee_limit ?? 10,
            limitProjects: data.project_limit ?? 5,
            createdAt: data.created_at,
            created_at: data.created_at,
            subscription: null,
            supervisor: null
        };

        return NextResponse.json(org, {
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
        const id = parseInt(rawId.replace('.jsonld', '').replace('.json', ''));
        const body = await request.json();

        const updateData: Record<string, unknown> = {};
        if (body.name !== undefined) updateData.name = body.name;
        if (body.bin !== undefined) updateData.bin = body.bin;
        if (body.city !== undefined) updateData.city = body.city;
        if (body.limitEmployees !== undefined || body.employeeLimit !== undefined) {
            updateData.employee_limit = body.limitEmployees ?? body.employeeLimit;
        }
        if (body.limitProjects !== undefined || body.projectLimit !== undefined) {
            updateData.project_limit = body.limitProjects ?? body.projectLimit;
        }

        const { data, error } = await supabase
            .from('organizations')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(data);
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
        const id = parseInt(rawId.replace('.jsonld', '').replace('.json', ''));

        await supabase.from('organizations').delete().eq('id', id);
        return new NextResponse(null, { status: 204 });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

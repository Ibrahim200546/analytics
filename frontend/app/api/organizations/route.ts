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
        const limit = 10;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, count, error } = await supabase
            .from('organizations')
            .select('*', { count: 'exact' })
            .order('id', { ascending: true })
            .range(from, to);

        if (error) {
            console.error('Supabase error fetching organizations:', error);
            return NextResponse.json({
                '@context': '/api/contexts/Organization',
                '@id': '/api/organizations',
                '@type': 'hydra:Collection',
                'hydra:totalItems': 0,
                'hydra:member': [],
                'hydra:view': {
                    '@id': `/api/organizations?page=${page}`,
                    '@type': 'hydra:PartialCollectionView',
                    'hydra:first': '/api/organizations?page=1',
                    'hydra:last': '/api/organizations?page=1'
                }
            });
        }

        const members = (data || []).map(row => ({
            '@id': `/api/organizations/${row.id}`,
            '@type': 'Organization',
            id: row.id,
            name: row.name,
            bin: row.bin,
            city: row.city ? { name: row.city } : null,
            employeeLimit: row.employee_limit ?? 10,
            projectLimit: row.project_limit ?? 5,
            limitEmployees: row.employee_limit ?? 10,
            limitProjects: row.project_limit ?? 5,
            createdAt: row.created_at,
            created_at: row.created_at,
            subscription: null,
            supervisor: null
        }));

        const total = count || members.length;
        const lastPage = Math.max(1, Math.ceil(total / limit));

        return NextResponse.json({
            '@context': '/api/contexts/Organization',
            '@id': '/api/organizations',
            '@type': 'hydra:Collection',
            'hydra:totalItems': total,
            'hydra:member': members,
            'hydra:view': {
                '@id': `/api/organizations?page=${page}`,
                '@type': 'hydra:PartialCollectionView',
                'hydra:first': '/api/organizations?page=1',
                'hydra:last': `/api/organizations?page=${lastPage}`
            }
        }, {
            headers: {
                'Content-Type': 'application/ld+json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    } catch (e: unknown) {
        console.error('Error in /api/organizations:', e);
        return NextResponse.json({
            '@context': '/api/contexts/Organization',
            '@id': '/api/organizations',
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

        const rawBin = body.bin ? String(body.bin).replace(/\D/g, '') : '';
        const bin = rawBin.length === 12 ? rawBin : String(Math.floor(100000000000 + Math.random() * 900000000000));

        const insertData: { name: string; bin: string; city: string | null; employee_limit: number; project_limit: number } = {
            name: body.name ? String(body.name).trim() : 'Новая организация',
            bin,
            city: body.city || null,
            employee_limit: parseInt(body.employeeLimit || body.limitEmployees || '10') || 10,
            project_limit: parseInt(body.projectLimit || body.limitProjects || '5') || 5,
        };

        let result = await supabase
            .from('organizations')
            .insert(insertData)
            .select()
            .single();

        // If duplicate BIN error, retry once with a guaranteed fresh random 12-digit BIN
        if (result.error && (result.error.code === '23505' || result.error.message.includes('unique'))) {
            insertData.bin = String(Math.floor(100000000000 + Math.random() * 900000000000));
            result = await supabase
                .from('organizations')
                .insert(insertData)
                .select()
                .single();
        }

        if (result.error) {
            console.error('Supabase error inserting organization:', result.error);
            return NextResponse.json({ error: result.error.message }, { status: 400 });
        }

        const data = result.data;
        const org = {
            '@context': '/api/contexts/Organization',
            '@id': `/api/organizations/${data.id}`,
            '@type': 'Organization',
            id: data.id,
            name: data.name,
            bin: data.bin,
            city: data.city ? { name: data.city } : null,
            employeeLimit: data.employee_limit,
            projectLimit: data.project_limit,
            limitEmployees: data.employee_limit,
            limitProjects: data.project_limit,
            createdAt: data.created_at,
            subscription: null,
            supervisor: null
        };

        return NextResponse.json(org, { status: 201 });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error('Error in POST /api/organizations:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

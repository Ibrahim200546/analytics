import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const name = slug.join('/');

    const structure = {
        name,
        entity: name.split('/')[0] || name,
        paths: {
            create: '/api/organizations',
            edit: '/api/organizations/{id}',
            get: '/api/organizations/{id}',
            collection: '/api/organizations'
        },
        idColumn: 'id',
        fields: [
            {
                path: 'name',
                component: 'Input',
                componentArguments: { placeholder: 'Введите название' },
                title: 'Название организации',
                priority: 1,
                defaultValue: '',
                hidden: false,
                sectionGroupKey: 'default'
            },
            {
                path: 'bin',
                component: 'Input',
                componentArguments: { placeholder: '12 цифр' },
                title: 'БИН',
                priority: 2,
                defaultValue: '',
                hidden: false,
                sectionGroupKey: 'default'
            },
            {
                path: 'limitEmployees',
                component: 'Input',
                componentArguments: { type: 'number', defaultValue: 10 },
                title: 'Лимит сотрудников',
                priority: 3,
                defaultValue: 10,
                hidden: false,
                sectionGroupKey: 'default'
            },
            {
                path: 'limitProjects',
                component: 'Input',
                componentArguments: { type: 'number', defaultValue: 5 },
                title: 'Лимит проектов',
                priority: 4,
                defaultValue: 5,
                hidden: false,
                sectionGroupKey: 'default'
            }
        ],
        events: []
    };

    return NextResponse.json(structure, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    });
}

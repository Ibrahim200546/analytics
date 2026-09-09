import { NextResponse } from 'next/server';

export async function GET() {
    const navigation = {
        _icons: {
            organizations: 'users',
            projects: 'folder',
            news: 'newspaper',
            settings: 'settings',
        },
        organizations: {
            list: {
                type: 'EntityTable',
                name: 'app.entity.organization'
            },
            create: {
                type: 'EntityForm',
                name: 'app.entity.organization',
                mode: 'create'
            }
        },
        projects: {
            type: 'projects'
        },
        news: {
            type: 'news'
        },
        rootRedirect: '/admin/organizations/list'
    };

    return NextResponse.json(navigation, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    });
}

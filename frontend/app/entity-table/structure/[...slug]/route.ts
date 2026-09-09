import { NextRequest, NextResponse } from 'next/server';

const structures: Record<string, unknown> = {
    'app.entity.organization': {
        name: 'app.entity.organization',
        entity: 'Organization',
        path: '/api/organizations',
        columns: [
            {
                dataKey: 'id',
                getDataAction: 'entity.id',
                priority: 1,
                title: 'ID',
                filters: [{ type: 'sort', query: 'order[id]=' }]
            },
            {
                dataKey: 'name',
                getDataAction: 'entity.name',
                priority: 2,
                title: 'Название организации',
                filters: [
                    { type: 'sort', query: 'order[name]=' },
                    { type: 'search', query: 'name={data0}' }
                ]
            },
            {
                dataKey: 'bin',
                getDataAction: 'entity.bin',
                priority: 3,
                title: 'БИН',
                filters: [
                    { type: 'sort', query: 'order[bin]=' },
                    { type: 'search', query: 'bin={data0}' }
                ]
            },
            {
                dataKey: 'limitEmployees',
                getDataAction: 'entity.employeeLimit || entity.limitEmployees || 10',
                priority: 4,
                title: 'Лимит сотрудников',
                filters: []
            },
            {
                dataKey: 'limitProjects',
                getDataAction: 'entity.projectLimit || entity.limitProjects || 5',
                priority: 5,
                title: 'Лимит проектов',
                filters: []
            }
        ],
        actions: [
            {
                type: 'link',
                title: 'Подробнее',
                path: '/admin/organizations/view/{entity.id}',
                isVisible: 'true'
            }
        ]
    },
    'app.entity.project': {
        name: 'app.entity.project',
        entity: 'Project',
        path: '/api/projects',
        columns: [
            {
                dataKey: 'id',
                getDataAction: 'entity.id',
                priority: 1,
                title: 'ID',
                filters: [{ type: 'sort', query: 'order[id]=' }]
            },
            {
                dataKey: 'name',
                getDataAction: 'entity.name',
                priority: 2,
                title: 'Название проекта',
                filters: [
                    { type: 'sort', query: 'order[name]=' },
                    { type: 'search', query: 'name={data0}' }
                ]
            },
            {
                dataKey: 'tags',
                getDataAction: 'entity.tags',
                priority: 3,
                title: 'Теги',
                filters: []
            }
        ],
        actions: [
            {
                type: 'button',
                title: 'Изменить',
                onClick: 'showEditProjectModal(entity.id)',
                style: 2
            },
            {
                type: 'button',
                title: 'Удалить',
                onClick: 'showDeleteProjectModal(entity.id)',
                style: 1
            }
        ]
    },
    'app.entity.user:employee': {
        name: 'app.entity.user:employee',
        entity: 'User',
        path: '/api/users',
        columns: [
            {
                dataKey: 'id',
                getDataAction: 'entity.id',
                priority: 1,
                title: 'ID',
                filters: [{ type: 'sort', query: 'order[id]=' }]
            },
            {
                dataKey: 'name',
                getDataAction: 'entity.name || entity.email',
                priority: 2,
                title: 'Имя / Email',
                filters: []
            }
        ],
        actions: [
            {
                type: 'button',
                title: 'Изменить',
                onClick: 'showEditModal(entity.id)',
                style: 2
            },
            {
                type: 'button',
                title: 'Удалить',
                onClick: 'showDeleteModal(entity.id)',
                style: 1
            }
        ]
    },
    'app.entity.organization-account': {
        name: 'app.entity.organization-account',
        entity: 'OrganizationAccount',
        path: '/api/organization-accounts',
        columns: [
            {
                dataKey: 'id',
                getDataAction: 'entity.id',
                priority: 1,
                title: 'ID',
                filters: [{ type: 'sort', query: 'order[id]=' }]
            },
            {
                dataKey: 'accountName',
                getDataAction: 'entity.accountName || entity.account_name',
                priority: 2,
                title: 'Имя аккаунта',
                filters: []
            },
            {
                dataKey: 'parserName',
                getDataAction: 'entity.parserName || entity.parser_name',
                priority: 3,
                title: 'Парсер',
                filters: []
            }
        ],
        actions: []
    }
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const name = slug.join('/');
    const cleanName = name.replace(/\//g, '.');

    let structure = structures[name] || structures[cleanName];
    if (!structure) {
        if (cleanName.includes('project')) {
            structure = structures['app.entity.project'];
        } else if (cleanName.includes('employee') || cleanName.includes('user')) {
            structure = structures['app.entity.user:employee'];
        } else if (cleanName.includes('account')) {
            structure = structures['app.entity.organization-account'];
        } else if (cleanName.includes('organization')) {
            structure = structures['app.entity.organization'];
        }
    }

    if (!structure) {
        structure = {
            name,
            entity: name,
            path: `/api/${name.split('.').pop()}s`,
            columns: [
                {
                    dataKey: 'id',
                    getDataAction: 'entity.id',
                    priority: 1,
                    title: 'ID',
                    filters: [{ type: 'sort', query: 'order[id]=' }]
                }
            ],
            actions: []
        };
    }

    return NextResponse.json(structure, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    });
}

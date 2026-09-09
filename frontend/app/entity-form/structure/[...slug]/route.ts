import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const name = slug.join('/');

    if (name.includes('telegram-account')) {
        const telegramStructure = {
            name,
            entity: 'TelegramAccount',
            paths: {
                create: '/api/telegram_accounts',
                edit: '/api/telegram_accounts/{id}',
                get: '/api/telegram_accounts/{id}',
                collection: '/api/telegram_accounts'
            },
            idColumn: 'id',
            fields: [
                {
                    path: 'name',
                    component: 'Input',
                    componentArguments: { placeholder: 'Имя аккаунта' },
                    title: 'Имя аккаунта',
                    priority: 1,
                    defaultValue: '',
                    hidden: false,
                    sectionGroupKey: 'default'
                },
                {
                    path: 'apiId',
                    component: 'Input',
                    componentArguments: { type: 'number', placeholder: 'API ID' },
                    title: 'API ID',
                    priority: 2,
                    defaultValue: 0,
                    hidden: false,
                    sectionGroupKey: 'default'
                },
                {
                    path: 'apiHash',
                    component: 'Input',
                    componentArguments: { placeholder: 'API Hash' },
                    title: 'API Hash',
                    priority: 3,
                    defaultValue: '',
                    hidden: false,
                    sectionGroupKey: 'default'
                }
            ],
            events: []
        };
        return NextResponse.json(telegramStructure, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }

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
                componentArguments: { placeholder: 'Введите официальное название организации' },
                title: 'Название организации',
                priority: 1,
                defaultValue: '',
                hidden: false,
                sectionGroupKey: 'basic_info'
            },
            {
                path: 'bin',
                component: 'Input',
                componentArguments: { placeholder: '12-значный БИН' },
                title: 'Бизнес-идентификационный номер (БИН)',
                priority: 2,
                defaultValue: '',
                hidden: false,
                sectionGroupKey: 'basic_info'
            },
            {
                path: 'limitEmployees',
                component: 'Input',
                componentArguments: { type: 'number', defaultValue: 10, placeholder: 'По умолчанию 10' },
                title: 'Лимит учетных записей сотрудников',
                priority: 3,
                defaultValue: 10,
                hidden: false,
                sectionGroupKey: 'limits_info'
            },
            {
                path: 'limitProjects',
                component: 'Input',
                componentArguments: { type: 'number', defaultValue: 5, placeholder: 'По умолчанию 5' },
                title: 'Лимит активных аналитических проектов',
                priority: 4,
                defaultValue: 5,
                hidden: false,
                sectionGroupKey: 'limits_info'
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

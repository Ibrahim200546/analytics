import {NextResponse} from "next/server";

const translationsRu = [
    { key: "project.name", value: "ISMI" },
    { key: "logout", value: "Выйти" },
    { key: "navigation.organizations", value: "Организации" },
    { key: "navigation.organizations.list", value: "Список организаций" },
    { key: "navigation.organizations.create", value: "Создать организацию" },
    { key: "navigation.projects", value: "Проекты" },
    { key: "navigation.news", value: "Новости" },
    { key: "navigation.myOrganization", value: "Моя организация" },
    { key: "navigation.settings", value: "Настройки" },
    { key: "navigation.settings.telegram", value: "Телеграмм" },
    { key: "navigation.settings.telegram.accounts", value: "Аккаунты" },
    { key: "navigation.settings.telegram.accounts.list", value: "Список аккаунтов" },
    { key: "navigation.settings.telegram.accounts.create", value: "Добавить аккаунт" },
    { key: "navigation.settings.telegram.channels", value: "Телеграмм каналы" },
    { key: "navigation.settings.webResource", value: "Веб-ресурс" },
    { key: "navigation.settings.location", value: "Местоположения" },
];

export async function GET(
    request: Request,
    { params }: { params: Promise<{ lng: string }> }
) {
    const { lng = "ru" } = await params;

    return NextResponse.json({
        locale: lng,
        translations: lng === "ru" ? translationsRu : [],
    }, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    });
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    });
}

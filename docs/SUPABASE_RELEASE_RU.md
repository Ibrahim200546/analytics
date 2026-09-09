# Переход ISMI на Supabase

## Назначение системы

ISMI собирает и показывает материалы информационного поля по проектам организации. Пользователь видит только данные своей организации; администратор управляет организациями, доступами и подписками.

## Что уже реализовано во фронтенде

1. Вход выполняется через **Supabase Auth** по email и паролю.
2. Админ-панель не использует Symfony API и не делает запросов к `api.ismi.kz`.
3. Панель показывает количество организаций, проектов, материалов и подключённых источников напрямую из Supabase.
4. Все основные маршруты используют русские названия: обзор, организации, проекты, материалы, настройки и справка.
5. Переключатель темы остаётся доступен на всех страницах.

## Разделы панели

| Раздел | Для чего нужен | Что делать |
| --- | --- | --- |
| Обзор | Быстро показывает объём данных в системе. | Проверяйте, что поступают материалы и подключены источники. |
| Организации | Хранит компании, сотрудников и руководителей. | Создайте организацию, назначьте руководителя и добавьте сотрудников. |
| Проекты | Группирует мониторинг по темам. | Для каждой организации создайте проект и укажите ключевые слова. |
| Материалы | Показывает публикации, связанные с проектами. | Просматривайте новые упоминания и отмечайте важные. |
| Настройки | Используется для подключений и управления доступом. | Добавляйте источники и проверяйте роли пользователей. |
| Справка | Напоминает порядок работы. | Открывайте при первичной настройке новой организации. |

## Настройка Supabase

1. Создайте проект Supabase в нужной организации.
2. Откройте SQL Editor и выполните файл `supabase/migrations/20260909000000_ismi_core.sql`.
3. В разделе **Authentication → Users** создайте пользователя с email и паролем.
4. Добавьте его UUID в `public.profiles`. Для администратора массив `roles` должен содержать `ROLE_ADMIN`.
5. В **Authentication → URL Configuration** добавьте:
   - `https://ismi-analytics.vercel.app`
   - `http://localhost:3001` для локальной разработки.
6. В настройках Vercel добавьте переменные для Production, Preview и Development:

```text
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
AUTH_SECRET=<random-long-secret>
NEXTAUTH_URL=https://ismi-analytics.vercel.app
AUTH_TRUST_HOST=true
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` можно использовать в браузере: доступ к таблицам ограничивает RLS. Никогда не добавляйте в Vercel или фронтенд `service_role` key.

## Импорт старых данных

1. Перед остановкой прежней базы сделайте резервную копию PostgreSQL.
2. Создайте пользователей в Supabase Auth и сопоставьте старые ID пользователей с их новыми UUID.
3. Импортируйте данные в порядке: `profiles` → `organizations` → `organization_members` → `projects` → `articles` → `project_articles` → `organization_accounts` → `subscriptions`.
4. После импорта проверьте доступ под администратором, руководителем и сотрудником.
5. Только после успешной проверки удалите старые `NEXT_PUBLIC_API_URL` и `NEXT_PUBLIC_API_URL_FROM_SERVER` из Vercel и разверните фронтенд.

## Локальный запуск

В PowerShell:

```powershell
cd C:\Users\user\Desktop\1\exchange-rates\frontend
corepack yarn install --frozen-lockfile
Copy-Item .env.example .env.local
# Заполните URL и anon key Supabase в .env.local
corepack yarn dev
```

Откройте `http://localhost:3001/login`.

## Проверки перед релизом

```powershell
cd C:\Users\user\Desktop\1\exchange-rates\frontend
npx tsc --noEmit
corepack yarn lint
corepack yarn build
vercel deploy --prod --yes
```

Проверьте вход и все шесть разделов панели в браузере. В Vercel не должно остаться переменных `NEXT_PUBLIC_API_URL` и `NEXT_PUBLIC_API_URL_FROM_SERVER` после того, как Supabase-переменные добавлены и проверены.

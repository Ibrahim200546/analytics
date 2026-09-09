"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {signOut, useSession} from "next-auth/react";
import {useEffect, useMemo, useState} from "react";
import {FiActivity, FiArrowRight, FiBookOpen, FiBriefcase, FiFileText, FiFolder, FiHelpCircle, FiHome, FiLogOut, FiMenu, FiSettings, FiUsers, FiX} from "react-icons/fi";
import {getSupabaseBrowserClient} from "@/lib/supabase/client";
import {isSupabaseConfigured} from "@/lib/supabase/config";
import styles from "./ModernAdmin.module.scss";

type Metric = {label: string; value: string; hint: string; icon: typeof FiHome; tone: "green" | "blue" | "amber" | "rose"};
type RecordPreview = {title: string; subtitle: string; meta: string};

const navigation = [
    {href: "/admin", label: "Обзор", icon: FiHome}, {href: "/admin/organizations/list", label: "Организации", icon: FiUsers},
    {href: "/admin/projects", label: "Проекты", icon: FiFolder}, {href: "/admin/news", label: "Материалы", icon: FiFileText},
    {href: "/admin/settings", label: "Настройки", icon: FiSettings}, {href: "/admin/help", label: "Справка", icon: FiHelpCircle},
];

const pageDetails = (pathname: string) => {
    if (pathname.includes("organizations")) return {title: "Организации", description: "Компании, доступы сотрудников и лимиты проектов."};
    if (pathname.includes("projects")) return {title: "Проекты", description: "Темы мониторинга и ключевые слова для сбора материалов."};
    if (pathname.includes("news")) return {title: "Материалы", description: "Новости и публикации, подобранные по проектам."};
    if (pathname.includes("settings")) return {title: "Настройки", description: "Подключения источников, роли и параметры системы."};
    if (pathname.includes("help")) return {title: "Справка", description: "Краткое объяснение возможностей системы и порядка работы."};
    return {title: "Рабочий обзор", description: "Состояние мониторинга и быстрый доступ к основным разделам."};
};

const countRows = async (table: string) => {
    const client = getSupabaseBrowserClient();
    if (!client) return null;
    const {count, error} = await client.from(table).select("*", {count: "exact", head: true});
    if (error) throw error;
    return count ?? 0;
};
const formatCount = (value: number | null) => value === null ? "-" : new Intl.NumberFormat("ru-RU").format(value);
const getPreview = async (table: "organizations" | "projects" | "articles"): Promise<RecordPreview[]> => {
    const client = getSupabaseBrowserClient();
    if (!client) return [];
    const article = table === "articles";
    const {data, error} = await client.from(table).select(article ? "title,source_name,published_at" : "name,created_at").order("created_at", {ascending: false}).limit(5);
    if (error) throw error;
    const rows = (data ?? []) as Array<Record<string, unknown>>;
    return rows.map((row) => ({title: String(article ? row.title : row.name), subtitle: article ? String(row.source_name ?? "Источник не указан") : table === "projects" ? "Проект мониторинга" : "Организация", meta: new Date(String(article ? row.published_at : row.created_at)).toLocaleDateString("ru-RU")}));
};

export default function ModernAdmin() {
    const pathname = usePathname(); const {data: session} = useSession(); const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(isSupabaseConfigured()); const [status, setStatus] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<Metric[]>([]); const [records, setRecords] = useState<RecordPreview[]>([]);
    const details = useMemo(() => pageDetails(pathname), [pathname]);
    useEffect(() => { let active = true; const load = async () => {
        if (!isSupabaseConfigured()) { setLoading(false); setStatus("Supabase ещё не подключён. Добавьте URL проекта и публичный anon-ключ в переменные окружения Vercel."); return; }
        setLoading(true); setStatus(null);
        try { const [organizations, projects, articles, accounts] = await Promise.all([countRows("organizations"), countRows("projects"), countRows("articles"), countRows("organization_accounts")]);
            const target = pathname.includes("news") ? "articles" : pathname.includes("projects") ? "projects" : "organizations";
            const preview = await getPreview(target); if (!active) return;
            setMetrics([{label: "Организации", value: formatCount(organizations), hint: "доступных в системе", icon: FiUsers, tone: "green"}, {label: "Проекты", value: formatCount(projects), hint: "активных направлений", icon: FiFolder, tone: "blue"}, {label: "Материалы", value: formatCount(articles), hint: "в базе мониторинга", icon: FiFileText, tone: "amber"}, {label: "Источники", value: formatCount(accounts), hint: "подключённых аккаунтов", icon: FiActivity, tone: "rose"}]); setRecords(preview);
        } catch (error) { console.error("Unable to load Supabase dashboard data", error); if (active) setStatus("Не удалось получить данные. Проверьте миграцию базы, права RLS и настройки Supabase."); } finally { if (active) setLoading(false); }
    }; void load(); return () => { active = false; }; }, [pathname]);
    const initials = session?.user?.email?.slice(0, 2).toUpperCase() ?? "IS"; const isCurrent = (href: string) => href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
    return <div className={styles.appShell}>
        <button className={styles.mobileMenu} type="button" aria-label="Открыть навигацию" onClick={() => setMenuOpen(true)}><FiMenu /></button>
        <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`} aria-label="Основная навигация"><div className={styles.brand}><span className={styles.brandMark}>I</span><span>ISMI</span><button type="button" className={styles.closeMenu} aria-label="Закрыть навигацию" onClick={() => setMenuOpen(false)}><FiX /></button></div><nav className={styles.navigation}>{navigation.map(({href, label, icon: Icon}) => <Link key={href} href={href} className={isCurrent(href) ? styles.activeLink : styles.navLink} onClick={() => setMenuOpen(false)}><Icon aria-hidden="true" /><span>{label}</span></Link>)}</nav><div className={styles.profile}><div className={styles.avatar}>{initials}</div><div><strong>{session?.user?.email ?? "Пользователь ISMI"}</strong><span>{session?.user?.roles?.includes("ROLE_ADMIN") ? "Администратор" : "Пользователь"}</span></div><button type="button" className={styles.signOut} aria-label="Выйти" title="Выйти" onClick={() => void signOut({callbackUrl: "/login"})}><FiLogOut /></button></div></aside>
        {menuOpen && <button className={styles.backdrop} type="button" aria-label="Закрыть меню" onClick={() => setMenuOpen(false)} />}
        <main className={styles.content}><header className={styles.header}><div><p className={styles.breadcrumb}>ISMI / {details.title}</p><h1>{details.title}</h1><p>{details.description}</p></div><Link className={styles.helpLink} href="/admin/help"><FiBookOpen aria-hidden="true" />Как работать с системой</Link></header>
        {status && <section className={styles.notice} role="status"><FiActivity aria-hidden="true" /><p>{status}</p></section>}
        {pathname.includes("help") ? <HelpContent /> : <><section className={styles.metrics} aria-label="Ключевые показатели">{loading ? [0, 1, 2, 3].map((item) => <div className={styles.metricSkeleton} key={item} />) : metrics.map(({label, value, hint, icon: Icon, tone}) => <article className={styles.metric} key={label}><span className={`${styles.metricIcon} ${styles[tone]}`}><Icon aria-hidden="true" /></span><div><span>{label}</span><strong>{value}</strong><small>{hint}</small></div></article>)}</section><section className={styles.workArea}><div className={styles.sectionHeading}><div><p>Последние данные</p><h2>{details.title}</h2></div><Link href={pathname === "/admin" ? "/admin/projects" : pathname}><span>Открыть раздел</span><FiArrowRight aria-hidden="true" /></Link></div>{loading ? <div className={styles.listSkeleton} /> : records.length ? <div className={styles.recordList}>{records.map((record) => <article className={styles.record} key={`${record.title}-${record.meta}`}><div className={styles.recordIcon}><FiBriefcase aria-hidden="true" /></div><div><h3>{record.title}</h3><p>{record.subtitle}</p></div><time>{record.meta}</time></article>)}</div> : <EmptyState />}</section></>}</main>
    </div>;
}
const EmptyState = () => <div className={styles.empty}><FiFileText aria-hidden="true" /><h3>Здесь пока нет данных</h3><p>После импорта данных в Supabase этот раздел будет заполнен автоматически.</p></div>;
const HelpContent = () => <section className={styles.helpGrid}><article><FiUsers aria-hidden="true" /><h2>Организации</h2><p>Создавайте организации, назначайте руководителей и сотрудников, задавайте лимиты проектов.</p></article><article><FiFolder aria-hidden="true" /><h2>Проекты</h2><p>Добавляйте темы и ключевые слова, по которым система группирует материалы.</p></article><article><FiFileText aria-hidden="true" /><h2>Материалы</h2><p>Просматривайте публикации, отмечайте важное и отслеживайте упоминания.</p></article><article><FiSettings aria-hidden="true" /><h2>Настройки</h2><p>Подключайте источники, управляйте ролями и проверяйте интеграции.</p></article></section>;

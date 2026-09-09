import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "ISMI",
    description: "Админ панель для ISMI",
};

export default function AdminLayout({children}: Readonly<{children: React.ReactNode}>) {
    return <>{children}</>;
}

import React from "react";
import Card from "@/libs/@dexodus/bootstrap/UserInterface/Card";
import AdminLayout from "@/libs/@dexodus/admin-constructor/src/AdminLayout";

const NotFoundPage: React.FC = () => {
    return (
        <AdminLayout params={{slug: ['page-not-found']}}>
            <Card title="Страница не найдена">
                Перезагрузите страницу или попробуйте попозже.
            </Card>
        </AdminLayout>
    )
}

export default NotFoundPage;

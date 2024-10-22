'use client'

import React from "react";
import Card from "@/libs/@dexodus/bootstrap/UserInterface/Card";

const ErrorPage: React.FC = () => {
    return (
        <Card title="Произошла ошибка">
            Что-то пошло не так. Перезагрузите страницу или попробуйте попозже.
        </Card>
    )
}

export default ErrorPage;


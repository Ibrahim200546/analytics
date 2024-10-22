'use server'

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import {LoginData} from "@/libs/@dexodus/admin-constructor/src/LoginForm/LoginForm";

export async function login(
    loginData: LoginData,
) {
    try {
        await signIn('credentials', loginData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Неверные данные';
                default:
                    return 'Что-то пошло не так, попробуйте позже.';
            }
        }
        throw error;
    }
}

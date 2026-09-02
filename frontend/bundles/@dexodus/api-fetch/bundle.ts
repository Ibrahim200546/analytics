import {Container} from "@/bundler";
import * as dotenv from 'dotenv'

export const init = (container: Container) => {
    const env = dotenv.config({path: '.env.local'}).parsed ?? {};

    if (!('NEXT_PUBLIC_API_URL' in env)) {
        console.log('Add variable in your .env: \x1b[36mNEXT_PUBLIC_API_URL=https://yourhost.com/\x1b[0m');
    }

    if (!('NEXT_PUBLIC_API_URL_FROM_SERVER' in env)) {
        console.log('Add variable in your .env: \x1b[36mNEXT_PUBLIC_API_URL_FROM_SERVER=https://yourhost.com/\x1b[0m');
    }
}

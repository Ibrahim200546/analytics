import {Container} from "@/bundler";

export const getDefaultParameters = () => {
    return {
        '@dexodus.next-auth.providers': {},
    }
}

export const init = async (container: Container) => {
    const {stderr, stdout: authSecret} = await container.shellExecute(`npx auth secret --raw`);

    console.log(`Add variable in your .env: \x1b[36mAUTH_SECRET="${authSecret.replace('\n', '')}"\x1b[0m`);

    if (stderr) {
        throw new Error(stderr);
    }
}

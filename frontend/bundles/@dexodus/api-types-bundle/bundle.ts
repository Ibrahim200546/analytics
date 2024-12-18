import {Container} from "@/bundler";
import getApiFetch from "@dexodus/api-fetch/src/server/getApiFetch";
import path from "path";
import * as fs from "fs";

export const init = async (container: Container) => {
    const apiFetch = await getApiFetch();
    const typescriptTypesResponse = await apiFetch('typescript-types/all');

    if (!typescriptTypesResponse.ok) {
        console.log('\x1b[41mError when trying loading Typescript Types from backend API\x1b[0m')
        throw new Error();
    }

    const typescriptTypes: {fullName: string, calculatedCode: string}[] = await typescriptTypesResponse.json();

    const apiTypesAbsolutePath = path.join(container.projectPath, 'apiTypes');

    if (fs.existsSync(apiTypesAbsolutePath)) {
        fs.rmSync(apiTypesAbsolutePath, { recursive: true, force: true });
    }

    for (const typescriptType of typescriptTypes) {
        const typescriptTypeAbsolutePath = path.join(apiTypesAbsolutePath, typescriptType.fullName) + '.d.ts';
        const typescriptTypeDirectoryPath = typescriptTypeAbsolutePath.split('/').slice(0, -1).join('/');

        if (!fs.existsSync(typescriptTypeDirectoryPath)) {
            fs.mkdirSync(typescriptTypeDirectoryPath, {recursive: true});
        }

        fs.writeFileSync(typescriptTypeAbsolutePath, typescriptType.calculatedCode, {});
    }
}

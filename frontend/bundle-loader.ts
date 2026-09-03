import {Container} from "@/bundler";
import {Jsel, JselContext} from "@dexodus/jsel";
import * as os from "os";

const fs = require("fs");
const path = require("path");
const util = require("util");
const shellExecute = util.promisify(require("child_process").exec);


// Configuration
const availableRelativePaths = ["bundles"];
const requiredBundlesRelativePath = "required-bundles.ts";
const bundleResourcesRelativePath = "src/resources";
const resourcesFilesRelativePath = "files";

// Private
type BundleName = string;
type AbsolutePath = string;
type FoundedBundles = { [bundleOwner: string]: { [bundleName: string]: AbsolutePath } };

interface BundleInfo {
    name: BundleName;
    absolutePath: AbsolutePath;
    dependencies: BundleName[];
}

const findBundles = (): FoundedBundles => {
    const bundles: FoundedBundles = {};

    for (const availableRelativePath of availableRelativePaths) {
        const availableAbsolutePath = path.join(__dirname, availableRelativePath);

        if (!fs.existsSync(availableAbsolutePath)) {
            continue;
        }

        fs.readdirSync(availableAbsolutePath).map((bundleOwner: string) => {
            if (!(bundleOwner in bundles)) {
                bundles[bundleOwner] = {};
            }

            const bundleOwnerAbsolutePath = path.join(availableAbsolutePath, bundleOwner);

            fs.readdirSync(bundleOwnerAbsolutePath).map((bundleSubName: string) => {
                const formattedBundleSubName = formatBundleSubName(bundleSubName);

                if (formattedBundleSubName in bundles[bundleOwner]) {
                    throw new Error(`Bundle "${bundleOwner}/${formattedBundleSubName}" already exists`);
                }

                bundles[bundleOwner][formattedBundleSubName] = path.join(bundleOwnerAbsolutePath, bundleSubName);
            });
        });
    }

    return bundles;
};

const buildBundlesInfo = (foundedBundles: FoundedBundles): BundleInfo[] => {
    const bundleInfos: BundleInfo[] = [];

    for (const bundleOwner in foundedBundles) {
        for (const bundleSubName in foundedBundles[bundleOwner]) {
            const bundleAbsolutePath = foundedBundles[bundleOwner][bundleSubName];
            const requiredBundlesAbsolutePath = path.join(bundleAbsolutePath, requiredBundlesRelativePath);
            const bundleName = getBundleName(bundleOwner, bundleSubName);
            let bundleDependencies: BundleName[] = [];

            if (fs.existsSync(requiredBundlesAbsolutePath)) {
                bundleDependencies = require(requiredBundlesAbsolutePath).default;
            }

            bundleInfos.push({name: bundleName, dependencies: bundleDependencies, absolutePath: bundleAbsolutePath});
        }
    }

    return bundleInfos;
};

const formatBundleSubName = (bundleSubName: string): string => {
    return bundleSubName.toLowerCase();
};

const getBundleName = (bundleOwner: string, bundleSubName: string): BundleName => {
    return `${bundleOwner}/${bundleSubName}`;
};

const sortBundleInfosByDependencies = (bundleInfos: BundleInfo[]): BundleInfo[] => {
    const bundleMap = new Map<string, BundleInfo>();
    bundleInfos.forEach(bundle => bundleMap.set(bundle.name, bundle));

    const visited = new Set<string>();
    const result: BundleInfo[] = [];

    const visit = (bundle: BundleInfo) => {
        if (visited.has(bundle.name)) return;
        visited.add(bundle.name);

        for (const dependency of bundle.dependencies) {
            const dependentBundle = bundleMap.get(dependency);
            if (dependentBundle) {
                visit(dependentBundle);
            }
        }

        result.push(bundle);
    };

    for (const bundle of bundleInfos) {
        if (!visited.has(bundle.name)) {
            visit(bundle);
        }
    }

    return result;
};
const installBundlesInDefaultPackageManager = async (bundleInfos: BundleInfo[]): Promise<void> => {
    for (const bundleInfo of bundleInfos) {
        await installPackageInNpm(bundleInfo);
    }
};

const installPackageInNpm = async (bundleInfo: BundleInfo): Promise<void> => {
    console.log(`Adding "${bundleInfo.name}" to packages.json...`);
    const {stderr: yarnError} = await shellExecute(`yarn add ${bundleInfo.absolutePath}`);

    if (yarnError) {
        throw new Error(yarnError);
    }
};

const installBundlesResources = (bundleInfos: BundleInfo[], container: Container): void => {
    for (const bundleInfo of bundleInfos) {
        installBundleResources(bundleInfo, container);
    }
};

const installBundleResources = (bundleInfo: BundleInfo, container: Container): void => {
    const bundleResourcesAbsolutePath = path.join(bundleInfo.absolutePath, bundleResourcesRelativePath);

    if (!fs.existsSync(bundleResourcesAbsolutePath)) {
        return;
    }

    installBundleResourcesFiles(bundleInfo, container);
};

const installBundleResourcesFiles = (bundleInfo: BundleInfo, container: Container): void => {
    const resourcesFilesAbsolutePath = path.join(bundleInfo.absolutePath, bundleResourcesRelativePath, resourcesFilesRelativePath);

    if (!fs.existsSync(resourcesFilesAbsolutePath)) {
        return;
    }

    const resourcesFiles: string[] = [];
    let resourcesFilesQueue = fs.readdirSync(resourcesFilesAbsolutePath);

    while (resourcesFilesQueue.length) {
        const resourcesFileRelativePath = resourcesFilesQueue.pop();
        const resourcesFileAbsolutePath = path.join(resourcesFilesAbsolutePath, resourcesFileRelativePath);
        const resourcesFileStats = fs.lstatSync(resourcesFileAbsolutePath);

        if (resourcesFileStats.isFile()) {
            resourcesFiles.push(resourcesFileRelativePath);
            continue;
        }

        if (resourcesFileStats.isDirectory()) {
            const newFilesInQueue = fs.readdirSync(resourcesFileAbsolutePath).map((childResourcesFileRelativePath: string) => path.join(resourcesFileRelativePath, childResourcesFileRelativePath));
            resourcesFilesQueue = [...resourcesFilesQueue, ...newFilesInQueue];
        }
    }

    for (const resourcesFile of resourcesFiles) {
        const resourcesFilePathDirectories = resourcesFile.split("/").slice(0, -1);
        let absoluteDirectoryPath = __dirname;

        for (const resourcesFilePathDirectory of resourcesFilePathDirectories) {
            absoluteDirectoryPath = path.join(absoluteDirectoryPath, resourcesFilePathDirectory);

            if (!fs.existsSync(absoluteDirectoryPath)) {
                fs.mkdirSync(absoluteDirectoryPath);
            }
        }

        const absoluteProjectResourceFile = path.join(__dirname, resourcesFile);
        const absoluteBundleResourceFile = path.join(resourcesFilesAbsolutePath, resourcesFile);

        if (fs.existsSync(absoluteProjectResourceFile)) {
            fs.unlinkSync(absoluteProjectResourceFile);
        }

        const resourceFileBuffer = fs.readFileSync(absoluteBundleResourceFile);
        const resourceFileContent = resourceFileBuffer.toString()

        const resourceFileUpdatedContent = resourceFileContent.replace(/'\/\/(.*?)\/\/'/, (_match: string, key: string) => {
            const replacement = container.parameters[key];
            if (replacement === undefined) {
                throw new Error(`Placeholder ${key} not found in container.parameters`);
            }

            return JSON.stringify(replacement);
        });

        fs.writeFileSync(absoluteProjectResourceFile, processJselBlocks(resourceFileUpdatedContent, container))
    }
};

function processJselBlocks(content: string, container: Container): string {
    const jsel = new Jsel(new JselContext({parameters: container.parameters}))

    const jselRegex = /\/\*>jsel\n([\s\S]*?)\*\//g;
    const jselRegexForTsx = /\{\/\*>jsel\n([\s\S]*?)\*\/}/g;

    const jselReplace = (codeBlock: string) => {
        let newContent = '';

        jsel.assign('write', (...strings: any[]) => {
            newContent += strings.join('');
        })

        jsel.assign('writeln', (...strings: any[]) => {
            newContent += strings.join('') + os.EOL;
        })

        jsel.exec(codeBlock);
        return newContent;
    }

    return content
        .replace(jselRegex, (_match: string, codeBlock: string) => jselReplace(codeBlock))
        .replace(jselRegexForTsx, (_match: string, codeBlock: string) => jselReplace(codeBlock));
}

const initContainer = (): Container => {
    return {
        parameters: {},
        shellExecute: shellExecute,
        projectPath: __dirname,
    };
};

const initBundles = async (bundleInfos: BundleInfo[], container: Container): Promise<void> => {
    for (const bundleInfo of bundleInfos) {
        const bundleFileAbsolutePath = path.join(bundleInfo.name, '/bundle.ts');
        try {
            const bundleFunctions = require(bundleFileAbsolutePath);

            console.log(`Init bundle ${bundleInfo.name}`);

            if ('init' in bundleFunctions) {
                if (bundleFunctions.init instanceof Promise) {
                    await bundleFunctions.init(container);
                } else {
                    bundleFunctions.init(container);
                }
            }

            if ('getDefaultParameters' in bundleFunctions) {
                container.parameters = {...container.parameters, ...bundleFunctions.getDefaultParameters()};
            }
        } catch (Error) {
        }
    }
};

const main = async () => {
    console.log("Bundle loader is run");
    const foundedBundles = findBundles();
    const builtBundleInfos = buildBundlesInfo(foundedBundles);
    const sortedBundleInfos = sortBundleInfosByDependencies(builtBundleInfos);

    // await installBundlesInDefaultPackageManager(sortedBundleInfos);

    const container: Container = initContainer();
    await initBundles(sortedBundleInfos, container);
    installBundlesResources(sortedBundleInfos, container);
};

main().then();

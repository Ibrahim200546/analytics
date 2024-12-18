export type ParameterName = string;
export type ParameterValue = any;

export interface Container {
    parameters: {[parameterName: ParameterName]: ParameterValue};
    shellExecute: (script: string) => Promise<{stderr; stdout}>;
    readonly projectPath: string;
}

export type BundleGenerator = (container: Container) => void;


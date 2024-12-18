import ValidatorInterface from "./ValidatorInterface";
import {Jsel, JselContext} from "@dexodus/jsel";
import apiFetch from "@dexodus/api-fetch/src/apiFetch";

export default class JselValidator implements ValidatorInterface
{
    private jsel: Jsel;
    private scope: {[property: string]: any} = {};

    constructor(
        private validationCode: string,
        private errorMessage: string,
    ) {
        this.scope = {
            apiUrl: process.env.NEXT_PUBLIC_API_URL,
            fetchJson: async (url: string) => {
                const result = await apiFetch(url);
                return await result.json();
            }
        }
        this.jsel = new Jsel(new JselContext(this.scope));
    }

    async validate(data: any, value: any): Promise<true | string> {
        this.scope.data = data;
        this.scope.currentValue = value;

        let result = this.jsel.exec(this.validationCode);

        if ((result instanceof Promise && await result) || (!(result instanceof Promise) && result)) {
            return true;
        }

        return this.errorMessage;
    }
}

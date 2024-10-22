import ValidatorInterface from "../validators/ValidatorInterface";
import {Jsel, JselContext} from "@dexodus/jsel";
import apiFetch from "../../../api-fetch/src/apiFetch";

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

    validate(data: any, value: any): true | string {
        this.scope.data = data;
        this.scope.currentValue = value;

        if (this.jsel.exec(this.validationCode)) {
            return true;
        }

        return this.errorMessage;
    }
}

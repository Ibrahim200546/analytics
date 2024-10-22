import ValidatorInterface from "../validators/ValidatorInterface";

export default class JsValidator implements ValidatorInterface {
    constructor(
        private validateFunction: (data: any, value: any) => Promise<true | string> | true | string,
    ) {
    }

    validate(data: any, value: any): Promise<true | string> | true | string {
        return this.validateFunction(data, value);
    }
}

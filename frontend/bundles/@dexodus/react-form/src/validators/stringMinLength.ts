import JsValidator from "./JsValidator";

export default (length: number, message: string) => new JsValidator((data, value) => {
    if (typeof value === 'string' && value.length >= length) {
        return true;
    }

    return message;
});

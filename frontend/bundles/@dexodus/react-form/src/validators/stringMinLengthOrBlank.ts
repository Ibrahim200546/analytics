import JsValidator from "./JsValidator";

export default (length: number, message: string) => new JsValidator((data, value) => {
    if (!value || (typeof value === 'string' && value.length >= length)) {
        return true;
    }

    return message;
});

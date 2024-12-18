import JsValidator from "./JsValidator";

export default (message: string) => new JsValidator((data, value) => {
    if (Array.isArray(value) && value.length) {
        return true;
    }

    return message;
});

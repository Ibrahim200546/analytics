import JsValidator from "./JsValidator";

export default (message: string) => new JsValidator((data, value) => {
    if (value) {
        return true;
    }

    return message;
});

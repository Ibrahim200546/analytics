import JsValidator from "./JsValidator";

export default (message: string) => new JsValidator((data, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(value)) {
        return true;
    }

    return message;
});

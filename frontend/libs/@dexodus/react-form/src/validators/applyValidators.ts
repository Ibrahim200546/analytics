import ValidatorInterface from "../validators/ValidatorInterface";

const applyValidators = async (validators: ValidatorInterface[], data: any, value: any): Promise<string[]> => {
    const results = validators.map(validator => validator.validate(data, value));
    const pureResults = [];
    const promiseResults = [];

    for (const result of results) {
        if (result instanceof Promise) {
            promiseResults.push(result);
        } else {
            pureResults.push(result);
        }
    }

    const errors = [...pureResults, ...await Promise.all(promiseResults)];

    return errors.filter(error => error !== true) as string[];
}

export default applyValidators;

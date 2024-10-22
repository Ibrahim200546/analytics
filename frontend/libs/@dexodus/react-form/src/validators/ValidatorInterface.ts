export default interface ValidatorInterface {
    /**
     * @param any data  - Form data object
     * @param any value - Property value
     *
     * @return boolean If return true    - then validation is successful
     *                 If return string  - then validation is failed, and return error message
     *                 If return Promise - then after complete Promise, return result need compare above
     **/
    validate: (data: any, value: any) => Promise<true | string> | true | string;
}

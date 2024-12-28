const responseIsNotOkSendError = (promise: Promise<Response>): Promise<Response> => {
    return new Promise((resolve, reject) => {
        promise
            .then(response => {
                if (response.ok) {
                    resolve(response);
                } else {
                    reject();
                }
            })
            .catch(value => reject(value));
    });
};

export default responseIsNotOkSendError;

type InvokeContract = (action: string, version: number, params?: object ) => Promise<unknown>

export const invoke: InvokeContract = (action, version, params = {}) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("error", () => reject("failed to issue request"));
        xhr.addEventListener("load", () => {
            try {
                const response = JSON.parse(xhr.responseText);
                if (Object.getOwnPropertyNames(response).length != 2) {
                    throw "response has an unexpected number of fields";
                }
                if (!Object.prototype.hasOwnProperty.call(response, "error")) {
                    throw "response is missing required error field";
                }
                if (!Object.prototype.hasOwnProperty.call(response, "result")) {
                    throw "response is missing required result field";
                }
                if (response.error) {
                    throw response.error;
                }
                resolve(response.result);
            } catch (e) {
                reject(e);
            }
        });

        xhr.open("POST", "http://127.0.0.1:8765");
        xhr.send(JSON.stringify({ action, version, params }));
    });
}

function invoke(action, version, params = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("error", () => reject("failed to issue request"));
        xhr.addEventListener("load", () => {
            try {
                const response = JSON.parse(xhr.responseText);
                if (Object.getOwnPropertyNames(response).length != 2) {
                    throw "response has an unexpected number of fields";
                }
                if (!response.hasOwnProperty("error")) {
                    throw "response is missing required error field";
                }
                if (!response.hasOwnProperty("result")) {
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

class StorageHepper {
    static set({ key, value, callback }) {
        if (!key || !value) {
            throw new Error("Key or value not found");
        }

        chrome.storage.sync.set({ [key]: value }, callback);
    }

    static get({ key, callback }) {
        if (!key) {
            throw new Error("Key not found");
        } else if (!callback) {
            throw new Error("Callback not found");
        }

        chrome.storage.sync.get([key], function (storage) {
            if (storage[key]) {
                callback(storage[key]);
            } else {
                throw new Error('Value from "chrome.storage" not found');
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const deckHTMLElement = document.querySelector(`#deck`);
    const modelHTMLElement = document.querySelector(`#model`);
    const frontHTMLElement = document.querySelector(`#front`);
    const backHTMLElement = document.querySelector(`#back`);
    const submitHTMLElement = document.querySelector(`#submit`);

    if (
        !deckHTMLElement ||
        !modelHTMLElement ||
        !frontHTMLElement ||
        !backHTMLElement ||
        !submitHTMLElement
    ) {
        throw new Error("Elements not found");
    }

    //! Deck
    const resultDeckNames = await invoke("deckNames", 6);

    deckHTMLElement.innerHTML = resultDeckNames
        .map((deck) => `<option value="${deck}">${deck}</option>`)
        .join("");

    StorageHepper.get({
        key: "deck",
        callback: (valueFromStorage) => {
            deckHTMLElement.value = valueFromStorage;
        },
    });

    deckHTMLElement.addEventListener("change", async (event) => {
        const inputtedDeckName = event.target.value;

        StorageHepper.set({
            key: "deck",
            value: inputtedDeckName,
        });
    });

    //! Model
    const resultModelNames = await invoke("modelNames", 6);

    modelHTMLElement.innerHTML = resultModelNames
        .map((model) => `<option value="${model}">${model}</option>`)
        .join("");

    StorageHepper.get({
        key: "model",
        callback: (valueFromStorage) => {
            modelHTMLElement.value = valueFromStorage;
        },
    });

    modelHTMLElement.addEventListener("change", async (event) => {
        const inputtedModelName = event.target.value;

        // chrome.storage.sync.set({ model: inputtedModelName }, () => { });
        StorageHepper.set({
            key: "model",
            value: inputtedModelName,
        });

        // const gotFindModelsByName = await invoke("findModelsByName", 6, {
        //     modelNames: [gotModelName],
        // });
    });

    submitHTMLElement.addEventListener("click", async () => {
        StorageHepper.get({
            key: "deck",
            callback: (deckFromStorage) => {
                StorageHepper.get({
                    key: "model",
                    callback: async (modelFromStorage) => {
                        if (!deckFromStorage || !modelFromStorage) {
                            throw new Error(
                                '"deckFromStorage" or "modelFromStorage" not found'
                            );
                        }

                        const result = await invoke("addNote", 6, {
                            note: {
                                deckName: deckFromStorage,
                                modelName: modelFromStorage,
                                fields: {
                                    Front: frontHTMLElement.value,
                                    Back: backHTMLElement.value,
                                },
                                options: {
                                    allowDuplicate: false,
                                    duplicateScope: "deck",
                                    duplicateScopeOptions: {
                                        deckName: "Default",
                                        checkChildren: false,
                                        checkAllModels: false,
                                    },
                                },
                            },
                        });

                        console.log(`result addNote >>> `, result);
                    },
                });
            },
        });
    });
});

// // Прослушивание сообщений от родительского окна
// window.addEventListener("message", async (event) => {
//     console.log(`111111111111111`);

//     // Проверка источника сообщения для безопасности
//     // if (event.origin !== "https://parent-domain.com") return;

//     if (event.data.type === "getInputValue") {
//         var input = document.getElementById("inputT");
//         var message = {
//             type: "inputValue",
//             value: input.value,
//         };
//         // Отправка ответа родительскому окну
//         window.parent.postMessage(message, "*");
//     }
// });

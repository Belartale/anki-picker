import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { invoke } from '../tools/invoke'


const Root = () => {

    useEffect(() => {
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

                StorageHepper.set({
                    key: "model",
                    value: inputtedModelName,
                });
            });

            StorageHepper.get({
                key: "selectedText",
                callback: (selectedTextFromStorage) => {
                    frontHTMLElement.value = selectedTextFromStorage; // todo
                },
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

        // Прослушивание сообщений от родительского окна
        // window.addEventListener("message", async (event) => {
        //     console.log('window.addEventListener => event:', event)

        //     // Проверка источника сообщения для безопасности
        //     // if (event.origin !== "https://parent-domain.com") return;

        //     if (event.data.type === "selectedText") {
        //         var input = document.getElementById("inputT");
        //         var message = {
        //             type: "inputValue",
        //             value: input.value,
        //         };
        //         // Отправка ответа родительскому окну
        //         window.parent.postMessage(message, "*");
        //     }
        // });

    }, [])

    return (
       <div>div element</div>
    );
};

const container = document.getElementById('app');

if (container) {
    const root = createRoot(container);
    root.render(<Root />);
}


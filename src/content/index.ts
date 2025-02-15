console.log(`start content/index.js`);

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

const uniqIdForIframeHTMLElement = `anki-picker-${new Date().getMilliseconds()}`;

function showPopover(x, y, word) {
    const popover = document.createElement("div");
    popover.id = "popover-anki-picker";
    const url = chrome.runtime.getURL("/content/index.html");
    popover.innerHTML = `<iframe id="${uniqIdForIframeHTMLElement}" src="${url}"></iframe>`;
    popover.style.position = "absolute";
    popover.style.left = `${x}px`;
    popover.style.top = `${y}px`;
    popover.style.border = `1px solid black`;
    popover.style.backgroundColor = `white`;
    popover.style.zIndex = `999`;
    document.body.appendChild(popover);

    // setTimeout(() => {
    //     popover.remove();
    // }, 3_000);
}

document.addEventListener("dblclick", (event) => {
    let attempts = 0;
    const maxAttempts = 3;

    const start = async (selectedText) => {
        const recursion = () => {
            setTimeout(() => {
                start();
                attempts++;
            }, 100);
        };

        const iframe = document.querySelector(`#${uniqIdForIframeHTMLElement}`);
        if (!iframe && attempts < maxAttempts) {
            recursion();
        } else if (iframe && attempts < maxAttempts) {
            StorageHepper.set({
                key: "selectedText",
                value: selectedText,
            });
        } else {
            throw new Error("ERROR, something went wrong!!!");
        }
    };

    const selectedText = window.getSelection().toString();
    console.log(`selectedText >>> `, selectedText);

    showPopover(event.pageX, event.pageY, selectedText);

    start(selectedText);

    //! open new window
    // chrome.runtime.sendMessage(
    //     JSON.stringify({
    //         left: window.screenLeft + window.outerWidth,
    //         top: window.screenTop,
    //     }),
    //     (response) => {}
    // );
    //!

    //! send message to serviceWorkers/index.js
    // chrome.runtime.sendMessage({ message: "updatePopupContent", data: "Hello world!" });
    //!

    //! save text to chrome.storage
    // The quota limitation is approximately 100 KB, 8 KB per item.
    // chrome.storage.sync.set({ selectedText: selectedText }, function () {
    //     //  A data saved callback omg so fancy
    // });

    // chrome.storage.sync.get(
    //     /* String or Array */ ["selectedText"],
    //     function (storage) {
    //         console.log(`storage.selectedText >>> `, storage["selectedText"]);
    //         if (storage["selectedText"]) {
    //             startCreating((input_data = storage["selectedText"]));
    //         }
    //     }
    // );
    //!
});

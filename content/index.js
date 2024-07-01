console.log(`start content/index.js`);
/*export*/ function invoke(action, version, params = {}) {
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

const uniqIdForIframeHTMLElement = `anki-picker-${new Date().getMilliseconds()}`;
console.log("uniqIdForIframeHTMLElement:", uniqIdForIframeHTMLElement);

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
    document.body.appendChild(popover);
    // import { invoke } from "tools/invoke.js";

    // setTimeout(() => {
    //     popover.remove();
    // }, 3_000);
}

document.addEventListener("dblclick", (event) => {
    const attempts = 0;
    const maxAttempts = 3;

    const start = async () => {
        const result = await invoke("modelNames", 6);
        console.log("result >>>", result);

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
            const iframeDocument =
                iframe.contentWindow.document.querySelector(`#form`);

            if (!iframeDocument) {
                // todo is need to check?
                recursion();
            } else {
                const formHTMLElement =
                    iframeDocument.document.querySelector(`#form`);

                if (!formHTMLElement) {
                    recursion();
                } else {
                    console.log(`formHTMLElement >>> `, formHTMLElement);
                }
            }
        } else {
            throw new Error("ERROR, something went wrong!!!");
        }
    };
    start();

    const selectedText = window.getSelection().toString();
    console.log(`selectedText >>> `, selectedText);

    showPopover(event.pageX, event.pageY, selectedText);

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

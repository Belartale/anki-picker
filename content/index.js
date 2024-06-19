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
};


const startCreating = async (input_data) => {
    await invoke("addNote", 6, {
        note: {
            deckName: "test1",
            modelName: "Basic",
            fields: {
                Front: input_data,
                Back: "back content",
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
};


document.addEventListener("dblclick", (event) => {
    const selectedText = window.getSelection().toString();

    console.log(`selectedText >>> `, selectedText);

    //! The quota limitation is approximately 100 KB, 8 KB per item.
    chrome.storage.sync.set({ selectedText: selectedText }, function () {
        //  A data saved callback omg so fancy
    });

    chrome.storage.sync.get(
        /* String or Array */ ["selectedText"],
        function (storage) {
            console.log(`storage.selectedText >>> `, storage["selectedText"]);
            if (storage["selectedText"]) {
                startCreating(input_data=storage["selectedText"]);
            };
        }
    );
});

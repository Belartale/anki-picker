console.log(`start popup/index.js`);

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

const startCreating = async () => {
    await invoke("createDeck", 6, { deck: "test1" });
    /*    await invoke("addNote", 6, {
        note: {
            deckName: "test1",
            modelName: "Basic",
            fields: {
                Front: "front content",
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
    });*/
    const resultCreateDeck = await invoke("createDeck", 6, { deck: "test1" });
    console.log("resultCreateDeck >>> ", resultCreateDeck);
};
startCreating();
chrome.storage.sync.get(
    /* String or Array */ ["selectedText"],
    function (storage) {
        console.log(`storage.selectedText >>> `, storage["selectedText"]);

        /*const htmlElementWord = document.querySelector(`#word`);

        htmlElementWord.innerHTML = storage["selectedText"];*/
    }
);

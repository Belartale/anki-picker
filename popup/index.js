import { invoke } from "../tools";

console.log(`start popup/index.js`);

const startCreating = async () => {
    await invoke("createDeck", 6, { deck: "test1" });
    const result = await invoke("addNote", 6, {
        note: {
            deckName: "test1",
            modelName: "Простая",
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
    });

    console.log(`result >>> `, result);
};

startCreating();

//! get text from chrome.storage
// chrome.storage.sync.get(
//     /* String or Array */ ["selectedText"],
//     function (storage) {
//         console.log(`storage.selectedText >>> `, storage["selectedText"]);

//         /*const htmlElementWord = document.querySelector(`#word`);

//         htmlElementWord.innerHTML = storage["selectedText"];*/
//     }
// );
//!

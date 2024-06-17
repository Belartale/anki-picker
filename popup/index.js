console.log(`start popup/index.js`);

chrome.storage.sync.get(
    /* String or Array */ ["selectedText"],
    function (storage) {
        console.log(`storage.selectedText >>> `, storage["selectedText"]);

        const htmlElementWord = document.querySelector(`#word`);

        htmlElementWord.innerHTML = storage["selectedText"];
    }
);

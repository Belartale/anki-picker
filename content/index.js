console.log(`start content/index.js`);

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
        }
    );
});

console.log(`start content/index.js`);

function showPopover(x, y, word) {
    const popover = document.createElement("div");
    popover.id = "popover-anki-picker";
    const url = chrome.runtime.getURL("/content/index.html");
    popover.innerHTML = `<iframe src="${url}" title="description"></iframe>`;
    popover.style.position = "absolute";
    popover.style.left = `${x}px`;
    popover.style.top = `${y}px`;
    popover.style.border = `1px solid black`;
    popover.style.backgroundColor = `white`;
    document.body.appendChild(popover);

    // setTimeout(() => {
    //     popover.remove();
    // }, 3_000);
}

document.addEventListener("dblclick", (event) => {
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

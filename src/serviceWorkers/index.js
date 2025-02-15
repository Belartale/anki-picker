console.log(`start serviceWorkers/index.js`);

//! get message content/index.js
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log("chrome.runtime.onMessage.addListener => request:", request);
//     if (request.message === "updatePopupContent") {
//         chrome.storage.local.set({ popupContent: request.data });
//     }
// });
//!

//! create new window
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     let data = JSON.parse(request);
//     chrome.windows.create({
//         url: chrome.runtime.getURL("popup/index.html"),
//         type: "popup",
//         top: data.top,
//         left: data.left - 400,
//         width: 400,
//         height: 600,
//     });
// });
//!

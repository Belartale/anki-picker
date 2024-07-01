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

const resultModelNames = await invoke("modelNames", 6);

const deckHTMLElement = document.querySelector(`#deck`);
deckHTMLElement.innerHTML = resultModelNames
    .map((deck) => `<option value="${deck}">${deck}</option>`)
    .join("");

deckHTMLElement.addEventListener("change", async (event) => {
    const gotModelName = event.target.value;
    console.log(
        "deckHTMLElement.addEventListener => gotModelName:",
        gotModelName
    );

    const gotFindModelsByName = await invoke("findModelsByName", 6, {
        modelNames: [gotModelName],
    });
    console.log(
        "deckHTMLElement.addEventListener => gotFindModelsByName:",
        gotFindModelsByName
    );
});

// // Прослушивание сообщений от родительского окна
// window.addEventListener("message", async (event) => {
//     console.log(`111111111111111`);

//     // Проверка источника сообщения для безопасности
//     // if (event.origin !== "https://parent-domain.com") return;

//     if (event.data.type === "getInputValue") {
//         var input = document.getElementById("inputT");
//         var message = {
//             type: "inputValue",
//             value: input.value,
//         };
//         // Отправка ответа родительскому окну
//         window.parent.postMessage(message, "*");
//     }
// });

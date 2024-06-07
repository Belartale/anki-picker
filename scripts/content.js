console.log(`Start scripts/content.js`)

const article = document.querySelector("article");

// `document.querySelector` may return null if the selector doesn't match anything.
if (article) {
    const text = article.textContent;
    const wordMatchRegExp = /[^\s]+/g; // Regular expression
    const words = text.matchAll(wordMatchRegExp);
    // matchAll returns an iterator, convert to array to get word count
    const wordCount = [...words].length;
    const readingTime = Math.round(wordCount / 200);
    const badge = document.createElement("p");
    // Use the same styling as the publish information in an article's header
    badge.classList.add("color-secondary-text", "type--caption");
    badge.textContent = `⏱️ ${readingTime} min read`;

    // Support for API reference docs
    const heading = article.querySelector("h1");
    // Support for article docs with date
    const date = article.querySelector("time")?.parentNode;

    (date ?? heading).insertAdjacentElement("afterend", badge);
}

async function justFun(params) {
    function invoke(action, version, params = {}) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.addEventListener('error', () => reject('failed to issue request'));
            xhr.addEventListener('load', () => {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (Object.getOwnPropertyNames(response).length != 2) {
                        throw 'response has an unexpected number of fields';
                    }
                    if (!response.hasOwnProperty('error')) {
                        throw 'response is missing required error field';
                    }
                    if (!response.hasOwnProperty('result')) {
                        throw 'response is missing required result field';
                    }
                    if (response.error) {
                        throw response.error;
                    }
                    resolve(response.result);
                } catch (e) {
                    reject(e);
                }
            });

            xhr.open('POST', 'http://127.0.0.1:8765');
            xhr.send(JSON.stringify({ action, version, params }));
        });
    }

    await invoke('createDeck', 6, { deck: 'test1' });
    const result = await invoke('deckNames', 6);
    console.log(`got list of decks: ${result}`);
    return result;
}

justFun().then((...a) => {
    console.log(`a >>> `, a)
}).catch((...b) => {
    console.log(`b >>> `, b)
});
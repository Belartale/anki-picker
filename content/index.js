chrome.runtime.onMessage.addListener((message, sender, sendResponse, ...rest) => {
  console.log("message >>> ", message);
  console.log("sender >>> ", sender);
  console.log("sendResponse >>> ", sendResponse);
  console.log("rest >>> ", ...rest);
  
    if (message.type === 'getWordInfo') {
      sendResponse({
        definition: "definitionTest",
        synonyms: "synonymsTest",
        examples: "examplesTest",
      });
    }
});

document.addEventListener('dblclick', (event) => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
        chrome.runtime.sendMessage({
            type: 'getWordInfo',
            word: selectedText
        }, (response) => {
            const definition = response.definition;
            const synonyms = response.synonyms.join(', ');
            const examples = response.examples.join('\n');
            const popupContent = `
                <div class="popup">
                    <h2>${selectedText}</h2>
                    <p>Определение: ${definition}</p>
                    <p>Синонимы: ${synonyms}</p>
                    <p>Примеры: ${examples}</p>
                </div>
            `;
            const popup = document.createElement('div');
            popup.innerHTML = popupContent;
            popup.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #fff;
                padding: 20px;
                border: 1px solid #ccc;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            `;
            document.body.appendChild(popup);

            setTimeout(() => {
                document.body.removeChild(popup);
            }, 5000);
        });
    }
});

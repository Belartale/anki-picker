console.log(`start content/index.js`);

document.addEventListener("dblclick", (event) => {
    const selectedText = window.getSelection().toString();

    console.log(`selectedText >>> `, selectedText);
    alert(selectedText);
});

// Core
import React from 'react';

/* global chrome */
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';

// Images
import './assets/images/icon-16.png';
import './assets/images/icon-32.png';
import './assets/images/icon-48.png';
import './assets/images/icon-128.png';

// Init
import { store as reduxStore } from './init';

// View

const Root = () => {
    return (
        <ReduxProvider store = { reduxStore }>
            <BrowserRouter>
                content
            </BrowserRouter>
        </ReduxProvider>
    );
};

console.log('start content/index.js');

class StorageHepper {
    static set({ key, value }: {key: string, value: string }) {
        chrome.storage.sync.set({ [ key ]: value });
    }

    static get({ key }: { key: string }) {
        chrome.storage.sync.get([ key ]);
    }
}

const idIframe = 'iframe-anki-picker';
const idPopover = 'popover-anki-picker';

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function showPopover(x: number, y: number) {
    const popover = document.createElement('div');
    popover.id = idPopover;

    const url = chrome.runtime.getURL('./content.html');
    popover.innerHTML = `<iframe id="${idIframe}" src="${url}"></iframe>`;
    popover.style.position = 'absolute';
    popover.style.left = `${x}px`;
    popover.style.top = `${y}px`;
    popover.style.border = '1px solid black';
    popover.style.backgroundColor = 'white';
    popover.style.zIndex = '999';
    document.body.appendChild(popover);

    // setTimeout(() => {
    //     popover.remove();
    // }, 3_000);
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

document.addEventListener('dblclick', (event) => {
    let attempts = 0;
    const maxAttempts = 3;

    const start = (selectedText: string) => {
        const recursion = () => {
            setTimeout(() => {
                start(selectedText);
                attempts += 1;
            }, 100);
        };

        const iframe = document.querySelector(`#${idIframe}`);
        if (!iframe && attempts < maxAttempts) {
            recursion();
        } else if (iframe && attempts < maxAttempts) {
            StorageHepper.set({
                key:   'selectedText',
                value: selectedText,
            });

            console.log('iframe >>> ', iframe);


            const container = document.querySelector('#app-anki-picker');
            console.log('start => container:', container);

            if (container) {
                const root = createRoot(container);
                root.render(<Root />);
            }
        } else {
            throw new Error('ERROR, something went wrong!!!');
        }
    };

    const selection = window.getSelection();
    const selectedText = selection ? selection.toString() : '';
    console.log('selectedText >>> ', selectedText);

    showPopover(event.pageX, event.pageY);

    start(selectedText);
});

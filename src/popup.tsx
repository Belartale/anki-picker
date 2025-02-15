// Core
import React from 'react';
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
                popup
            </BrowserRouter>
        </ReduxProvider>
    );
};

const container = document.getElementById('app-anki-picker');

if (container) {
    const root = createRoot(container);
    root.render(<Root />);
}

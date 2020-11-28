'use strict';

import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDom from 'react-dom';

import App from './App';
import AppAdminSettings from './AppAdminSettings';

import config from './config';

// Enable React devtools
window.React = React;

function render(App, rootElement, props = {}) {
    ReactDom.render(
        <AppContainer>
            <App config={config} {...props} />
        </AppContainer>,
        rootElement
    );
}

$(document).ready(() => {
    const rootElement = document.getElementById('ehr-root');
    if (rootElement) {
        render(App, rootElement);
    }

    const adminSettingsElement = document.getElementById('ehr-admin-settings');
    if (adminSettingsElement) {
        const adminSettings = JSON.parse(adminSettingsElement.getAttribute('data-settings'));
        render(AppAdminSettings, adminSettingsElement, { adminSettings });
    }

    if (module.hot) {
        module.hot.accept('./App', () => {
            const { App: NextApp } = require('./App');
            render(NextApp, rootElement);
        });
        module.hot.accept('./AppAdminSettings', () => {
            const { AppAdminSettings: NextAppAdminSettings } = require('./AppAdminSettings');
            const adminSettings = JSON.parse(adminSettingsElement.getAttribute('data-settings'));
            render(NextAppAdminSettings, adminSettingsElement, { adminSettings });
        });
    }
});

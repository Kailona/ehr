'use strict';

import { App } from './App';
import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDom from 'react-dom';

// Enable React devtools
window.React = React;

function render (App, rootElement) {
	ReactDom.render(
		<AppContainer>
			<App />
		</AppContainer>, rootElement);
}

$(document).ready(() => {
	const rootElement = document.getElementById('ehr-root');
	render(App, rootElement);

	if (module.hot) {
		module.hot.accept('./App', () => {
			const {App: NextApp} = require('./App');
			render(NextApp, rootElement);
		});
	}
});

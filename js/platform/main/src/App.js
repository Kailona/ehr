import React, { Component } from 'react';
import { ConfigManager, PluginManager } from '@kailona/core';
import Dashboard from './components/Dashboard';

export default class App extends Component {
    constructor(props) {
        super(props);

        const { plugins } = ConfigManager.appConfig;
        plugins.forEach(plugin => {
            PluginManager.registerPlugin(plugin);
        });
    }

    render() {
        return <Dashboard />;
    }
}

import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ConfigManager, ModuleTypeEnum, PluginManager } from '@kailona/core';
import Dashboard from './components/Dashboard';

export default class App extends Component {
    constructor(props) {
        super(props);

        const { basename, plugins } = ConfigManager.appConfig;

        // Register available plugins
        plugins.forEach(plugin => {
            PluginManager.registerPlugin(plugin);
        });

        this.basename = basename;
    }

    getPluginRoutes = () => {
        const menuItems = [];

        PluginManager.plugins.forEach((plugin, index) => {
            const menuModule = plugin.modules[ModuleTypeEnum.WidgetModule];
            if (!menuModule) {
                return;
            }

            const dataModule = plugin.modules[ModuleTypeEnum.DataModule];
            menuItems.push(<Route key={index} path={menuModule.path} component={dataModule} />);
        });

        return menuItems;
    };

    render() {
        const pluginRoutes = this.getPluginRoutes();

        return (
            <Router basename={this.basename}>
                <Switch>
                    <Route exact path="/" component={Dashboard} />
                    {pluginRoutes}
                </Switch>
            </Router>
        );
    }
}

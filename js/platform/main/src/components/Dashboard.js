import React, { Component } from 'react';
import { PluginManager, ModuleTypeEnum } from '@kailona/core';

export default class Dashboard extends Component {
    getWidgets() {
        const widgetModules = [];

        // Get widget modules from plugins
        PluginManager.plugins.forEach(plugin => {
            const widgetModule = plugin.modules[ModuleTypeEnum.WidgetModule];
            if (!widgetModule) {
                return;
            }
            widgetModules.push(widgetModule);
        });

        return widgetModules.map(WidgetComponent => {
            return <WidgetComponent />;
        });
    }

    render() {
        const widgets = this.getWidgets();

        return (
            <>
                <h1>Dashboard coming...</h1>
                <div>{widgets}</div>
            </>
        );
    }
}

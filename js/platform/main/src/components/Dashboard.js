import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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

        return widgetModules.map((WidgetComponent, index) => {
            return <WidgetComponent key={index} />;
        });
    }

    getMenuItems = () => {
        const menuItems = [];

        // Get menu modules from plugins
        PluginManager.plugins.forEach(plugin => {
            const menuModule = plugin.modules[ModuleTypeEnum.MenuModule];
            if (!menuModule) {
                return;
            }
            menuItems.push(menuModule);
        });

        // Sort by priority (high priority comes first)
        menuItems.sort((mi1, mi2) => (mi1.priority < mi2.priority ? 1 : -1));

        return menuItems.map((menuItem, index) => (
            <Link key={index} to={menuItem.path}>
                {menuItem.name}
            </Link>
        ));
    };

    render() {
        const widgets = this.getWidgets();
        const menuItems = this.getMenuItems();

        return (
            <>
                <h1>{t('ehr', 'Dashboard coming...')}</h1>
                <div>{menuItems}</div>
                <div>{widgets}</div>
            </>
        );
    }
}

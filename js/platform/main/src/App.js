import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Logger, ConfigManager, ModuleTypeEnum, PluginManager, ProviderManager } from '@kailona/core';
import { ThemeProvider, Loader } from '@kailona/ui';
import { ModalProvider } from './context/ModalContext';
import { NotificationProvider } from './context/NotificationContext';
import { MainContextProvider } from './context/MainContext';
import Dashboard from './components/Dashboard';
import MainLayout from './components/MainLayout';
import initFHIRPatients from './lib/initFHIRPatients';
import importLocalFonts from './lib/importLocalFonts';

import './App.css';

const logger = new Logger('main.App');

export default class App extends Component {
    constructor(props) {
        super(props);

        this.basename = ConfigManager.appConfig.basename;
        this.state = {
            loading: true,
            error: null,
        };
    }

    componentDidMount = async () => {
        // Load local fonts
        importLocalFonts(ConfigManager.appConfig.fontsPath);

        try {
            const firstTime = await initFHIRPatients();

            // Register available plugins
            ConfigManager.appConfig.plugins.forEach(plugin => {
                PluginManager.registerPlugin(plugin);
            });

            // Register available providers
            ConfigManager.appConfig.providers.forEach(provider => {
                ProviderManager.registerProvider(provider);
            });

            this.setState({
                loading: false,
                firstTime,
            });
        } catch (error) {
            logger.error('Failed to initialize', error);

            this.setState({
                loading: false,
                error: t('ehr', 'Failed to initialize! Please contact your administrator!'),
            });
        }
    };

    getPluginRoutes = () => {
        const routes = [];

        PluginManager.plugins.forEach((plugin, index) => {
            const { path, modules } = plugin;
            const { Component: DataModule } = modules[ModuleTypeEnum.DataModule];

            routes.push(
                <Route
                    key={index}
                    path={path}
                    render={() => (
                        <MainLayout error={this.state.error}>
                            <DataModule />
                        </MainLayout>
                    )}
                />
            );
        });

        return routes;
    };

    render() {
        const pluginRoutes = this.getPluginRoutes();

        return (
            <ThemeProvider>
                <MainContextProvider>
                    <NotificationProvider>
                        <ModalProvider>
                            {this.state.loading ? (
                                <Loader />
                            ) : (
                                <Router basename={this.basename}>
                                    <Switch>
                                        <Route
                                            exact
                                            path="/"
                                            render={() => (
                                                <MainLayout firstTime={this.state.firstTime} error={this.state.error}>
                                                    <Dashboard />
                                                </MainLayout>
                                            )}
                                        />
                                        {pluginRoutes}
                                    </Switch>
                                </Router>
                            )}
                        </ModalProvider>
                    </NotificationProvider>
                </MainContextProvider>
            </ThemeProvider>
        );
    }
}

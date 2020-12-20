import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Grid, Divider, Box, Typography } from '@material-ui/core';
import { PluginManager, ModuleTypeEnum } from '@kailona/core';
import ImportDataWidget from './ImportData/ImportDataWidget';
import RequestDataWidget from './RequestData/RequestDataWidget';
import { DashboardWidget } from '@kailona/ui';

class Dashboard extends Component {
    onRedirectWidgetClick = path => {
        this.props.history.push(path);
    };

    getWidgets() {
        const widgets = [];

        // Get widget modules from plugins
        PluginManager.plugins.forEach(plugin => {
            const { path, modules } = plugin;
            const widgetModule = modules[ModuleTypeEnum.WidgetModule];
            if (!widgetModule) {
                return;
            }
            widgets.push({
                path,
                ...widgetModule,
            });
        });

        // Sort by priority (high priority comes first)
        widgets.sort((i1, i2) => (i1.priority < i2.priority ? 1 : -1));

        return widgets.map((widget, index) => {
            const { Component: WidgetComponent, name, icon, path } = widget;

            // Render a widget with custom component
            if (WidgetComponent) {
                return (
                    <Grid key={index} item>
                        <DashboardWidget>
                            <WidgetComponent key={index} />
                        </DashboardWidget>
                    </Grid>
                );
            }

            // Render a widget with name and icon redirecting user to a page
            return (
                <Grid key={index} item>
                    <DashboardWidget onClick={() => this.onRedirectWidgetClick(path)} icon={icon} name={name} />
                </Grid>
            );
        });
    }

    render() {
        const widgets = this.getWidgets();

        return (
            <>
                <h1>{t('ehr', 'Dashboard coming...')}</h1>
                <Box>
                    <Typography variant="h5">{t('ehr', 'Shortcuts')}</Typography>
                    <Grid container direction="row" spacing={2}>
                        <Grid item>
                            <RequestDataWidget />
                        </Grid>
                        <Grid item>
                            <ImportDataWidget />
                        </Grid>
                        <Grid item>
                            <Divider orientation="vertical" />
                        </Grid>
                        {widgets}
                    </Grid>
                </Box>
            </>
        );
    }
}

export default withRouter(Dashboard);

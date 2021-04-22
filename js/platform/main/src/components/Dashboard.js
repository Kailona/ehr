import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Box, Typography } from '@material-ui/core';
import { PluginManager, ModuleTypeEnum } from '@kailona/core';
import { DashboardWidget } from '@kailona/ui';
import { withModal } from '../context/ModalContext';
import Timeline from './Timeline/Timeline';

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
            <Grid container direction="column">
                <Grid item>
                    <Timeline />
                </Grid>
                <Grid item>
                    <Box mt={2} ml={4}>
                        <Typography variant="h3" color="primary">
                            {t('ehr', 'Shortcuts')}
                        </Typography>
                        <Box mt={1} pl={2}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item>
                                    <DashboardWidget
                                        onClick={() => this.props.toggleRequestDataModal(true)}
                                        icon="ArchiveOutlined"
                                        name={t('ehr', 'Request Data from Provider')}
                                    />
                                </Grid>
                                <Grid item>
                                    <DashboardWidget
                                        onClick={() => this.props.toggleImportDataModal(true)}
                                        icon="CloudUploadOutlined"
                                        name={t('ehr', 'Import Data')}
                                    />
                                </Grid>
                                {widgets}
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        );
    }
}

export default withRouter(withModal(Dashboard));

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Chart from 'chart.js';
import { Grid, Divider, Box, Typography } from '@material-ui/core';
import { DirectionsWalk, FavoriteBorder } from '@material-ui/icons';
import { PluginManager, ModuleTypeEnum } from '@kailona/core';
import { DashboardWidget } from '@kailona/ui';
import { withModal } from '../context/ModalContext';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }

    componentDidMount() {
        const chartData = {
            labels: ['July 2020', 'Aug 2020', 'Sep 2020', 'Oct 2020', 'Nov 2020', 'Dec 2020'],
            datasets: [
                {
                    label: 'Steps',
                    data: [12, 19, 3, 5, 2, 3],
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 0.4)',
                    yAxisID: 'yAxisSteps',
                    lineTension: 0,
                },
                {
                    label: 'Blood Pressure',
                    data: [1, 2, 1, 1, 2, 2],
                    fill: false,
                    backgroundColor: 'rgb(54, 162, 235)',
                    borderColor: 'rgba(54, 162, 235, 0.4)',
                    yAxisID: 'yAxisBloodPressure',
                    lineTension: 0,
                },
            ],
        };

        const chartOptions = {
            responsive: true,
            aspectRatio: 4,
            legend: {
                display: false,
            },
            scales: {
                yAxes: [
                    {
                        id: 'yAxisSteps',
                        display: false,
                        gridLines: {
                            drawOnArea: false,
                        },
                    },
                    {
                        id: 'yAxisBloodPressure',
                        display: false,
                        gridLines: {
                            drawOnArea: false,
                        },
                    },
                ],
            },
        };

        new Chart(this.chartRef.current, {
            type: 'line',
            data: chartData,
            options: chartOptions,
        });
    }

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
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <Typography variant="h5">{t('ehr', 'Chart')}</Typography>
                    <Box mt={1} border={1}>
                        <Box m={4}>
                            <canvas ref={this.chartRef} />
                        </Box>
                    </Box>
                    <Box border={1}>
                        <Box ml={8} mr={8} mt={2} mb={2}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item>
                                    <Grid container direction="column" alignItems="center">
                                        <Typography style={{ fontSize: '12px', color: 'rgb(255, 99, 132)' }}>
                                            Steps
                                        </Typography>
                                        <DirectionsWalk style={{ color: 'rgb(255, 99, 132)' }} />
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container direction="column" alignItems="center">
                                        <Typography style={{ fontSize: '12px', color: 'rgb(54, 162, 235)' }}>
                                            Blood Pressure
                                        </Typography>
                                        <FavoriteBorder style={{ color: 'rgb(54, 162, 235)' }} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
                <Grid item>
                    <Box mt={2}>
                        <Typography variant="h3">{t('ehr', 'Shortcuts')}</Typography>
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

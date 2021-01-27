import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Chart from 'chart.js';
import moment from 'moment';
import { Grid, Box, Typography, Link as MuiLink, withStyles } from '@material-ui/core';
import { DirectionsWalk, FavoriteBorder } from '@material-ui/icons';
import { PluginManager, ModuleTypeEnum } from '@kailona/core';
import { DashboardWidget } from '@kailona/ui';
import { withModal } from '../context/ModalContext';
import TimeRangeFilter from './Timeline/TimeRangeFilter';

const Link = withStyles(theme => ({
    root: {
        margin: '0 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '&:hover': {
            textDecoration: 'none',
        },
        '& > .plugin-name': {
            fontSize: '12px',
        },
        '& > .plugin-name, & > .plugin-icon': {
            color: theme.palette.gray40.main,
        },
    },
}))(MuiLink);

const chartStyle = [
    {
        label: 'Steps',
        activeColor: 'rgb(255, 99, 132)',
        inactiveColor: '#999999',
    },
    {
        label: 'Blood Pressure',
        activeColor: 'rgb(54, 162, 235)',
        inactiveColor: '#999999',
    },
];

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
        this.state = {
            activePlugins: ['Steps', 'Blood Pressure'],
        };
    }

    getColor(id) {
        const { activePlugins } = this.state;
        const status = activePlugins.includes(id) ? 'active' : 'inactive';
        const key = status.concat('Color');
        return chartStyle.find(item => item.label === id)[key];
    }

    componentDidMount() {
        const daysOfMonth = moment().daysInMonth();
        const labels = [];
        for (let i = 1; i <= daysOfMonth; i++) {
            labels.push(i);
        }

        const chartData = {
            labels,
            datasets: [
                {
                    label: 'Steps',
                    data: [
                        {
                            x: 1,
                            y: 8,
                        },
                        {
                            x: 10,
                            y: 7,
                        },
                        {
                            x: 20,
                            y: 10,
                        },
                    ],
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 1.0)',
                    yAxisID: 'yAxisSteps',
                    lineTension: 0,
                    showLine: false,
                    pointStyle: 'line',
                    pointBorderWidth: 3,
                    pointRadius: 10,
                    pointHoverRadius: 12,
                    pointHoverBorderWidth: 4,
                    pointBackgroundColor: 'rgba(255, 99, 132, 1.0)',
                },
                {
                    label: 'Blood Pressure',
                    data: [
                        {
                            x: 20,
                            y: 132,
                        },
                    ],
                    fill: false,
                    backgroundColor: 'rgb(54, 162, 235)',
                    borderColor: 'rgba(54, 162, 235, 1.0)',
                    yAxisID: 'yAxisBloodPressure',
                    lineTension: 0,
                    showLine: false,
                    pointStyle: 'line',
                    borderWidth: 3,
                    pointRadius: 10,
                    pointHoverRadius: 12,
                    pointHoverBorderWidth: 4,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1.0)',
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
                        ticks: {
                            min: 0,
                            max: 10,
                            stepSize: 1,
                        },
                        gridLines: {
                            drawOnArea: false,
                        },
                    },
                    {
                        id: 'yAxisBloodPressure',
                        display: false,
                        ticks: {
                            min: 50,
                            max: 160,
                            stepSize: 5,
                        },
                        gridLines: {
                            drawOnArea: false,
                        },
                    },
                ],
            },
        };

        const ch = new Chart(this.chartRef.current, {
            type: 'line',
            data: Object.assign({}, chartData),
            options: chartOptions,
        });

        this.setState({
            chart: ch,
            initialChartData: chartData,
            initialChartOptions: chartOptions,
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

    changePlugin(e) {
        debugger;
        const { chart, activePlugins, initialChartData } = this.state;
        const element = e.currentTarget;
        const { id } = element;
        const isActive = element.classList.contains('active');

        if (isActive) {
            const index = activePlugins.indexOf(id);
            activePlugins.splice(index, 1);
        } else {
            // Add to active plugins
            activePlugins.push(id);
        }

        this.setState({
            activePlugins,
        });

        chart.data.datasets = initialChartData.datasets.filter(ds => activePlugins.includes(ds.label));
        chart.update();
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
                        <Box ml={4} mr={4} mt={2} mb={2}>
                            <Grid container direction="row" spacing={2} alignItems="center">
                                <Grid item xs={8}>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Typography style={{ fontWeight: 'bold' }}>Show:</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Link
                                                id="Steps"
                                                onClick={e => this.changePlugin(e)}
                                                className={`${
                                                    this.state.activePlugins.includes('Steps') ? 'active' : ''
                                                }`}
                                            >
                                                <DirectionsWalk
                                                    className="plugin-icon"
                                                    style={{ color: this.getColor('Steps') }}
                                                />
                                                <Typography
                                                    className="plugin-name"
                                                    style={{ color: this.getColor('Steps') }}
                                                >
                                                    Steps
                                                </Typography>
                                            </Link>
                                        </Grid>
                                        <Grid item>
                                            <Link
                                                id="Blood Pressure"
                                                onClick={e => this.changePlugin(e)}
                                                className={`${
                                                    this.state.activePlugins.includes('Blood Pressure') ? 'active' : ''
                                                }`}
                                            >
                                                <FavoriteBorder
                                                    className="plugin-icon"
                                                    style={{ color: this.getColor('Blood Pressure') }}
                                                />
                                                <Typography
                                                    className="plugin-name"
                                                    style={{ color: this.getColor('Blood Pressure') }}
                                                >
                                                    Blood Pressure
                                                </Typography>
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={4} style={{ textAlign: 'right' }}>
                                    <TimeRangeFilter />
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

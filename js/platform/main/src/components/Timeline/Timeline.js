import React, { Component } from 'react';
import Chart from 'chart.js';
import moment from 'moment';
import { Card, Grid, Box, Typography, Link as MuiLink, withStyles, CircularProgress } from '@material-ui/core';
import { ModuleTypeEnum, PluginManager, Logger, getIcon, ProfileManager } from '@kailona/core';
import TimeRangeFilter from './TimeRangeFilter';
import DateRangeEnum from '@kailona/core/src/enums/DateRange.enum';
import { withMain } from '../../context/MainContext';

const logger = new Logger('Timeline');

const Link = withStyles(theme => ({
    root: {
        margin: '0 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: 0.7,
        '&.active': {
            opacity: 1,
        },
        '&:hover': {
            textDecoration: 'none',
        },
        '& > .plugin-name': {
            fontSize: '12px',
        },
        '& > .plugin-name, & > .plugin-icon': {
            color: theme.palette.gray40.main,
        },
        '&.disabled': {
            pointerEvents: 'none',
            color: theme.palette.gray30.main,

            '& .plugin-name': {
                color: theme.palette.gray30.main,
            },
        },
    },
}))(MuiLink);

class Timeline extends Component {
    constructor(props) {
        super(props);

        this.timelineModules = [];

        this.chartRef = React.createRef();
        this.chartBoxRef = React.createRef();

        this.state = {
            activeDataNames: [],
            selectedDateRange: DateRangeEnum.ONE_MONTH,
            slotWidth: 30,
            completedPlugins: [],
            userId: this.props.userId,
        };

        Chart.pluginService.register({
            beforeDatasetsDraw: chart => {
                if (!chart || !chart.config) {
                    return;
                }

                if (!chart.config.data || !chart.config.data.datasets || !chart.config.data.datasets.length) {
                    return;
                }

                if (!chart.config.data.datasets[0]._meta) {
                    return;
                }

                this.repositionPointsOnTheSameLabel(chart);
            },
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.userId === nextProps.userId) {
            this.fetchChartData();
            return;
        }

        const chart = this.state.chart;
        if (chart) {
            chart.destroy();
        }

        // Destroy and reinitialize the chart with new profile info
        this.setState({
            selectedDateRange: DateRangeEnum.ONE_MONTH,
            userId: nextProps.userId,
            chart,
            chartData: [],
        });

        this.fetchChartData();
    }

    repositionPointsOnTheSameLabel = chart => {
        chart.config.data.datasets.forEach((dataset, datasetIndex) => {
            const { data } = dataset;
            const metaKey = Object.keys(dataset._meta)[0];

            // Set index of data points
            data.forEach((dt, index) => (dt.index = index));

            // Group data by x value
            const result = data.reduce(function(r, a) {
                r[a.x] = r[a.x] || [];
                r[a.x].push(a);
                return r;
            }, Object.create(null));

            Object.keys(result).forEach(key => {
                const dataByKey = result[key];
                const centerIndex = dataByKey.length >= 3 ? Math.ceil(dataByKey.length / 3) : 0;
                const centerData = dataByKey[centerIndex];
                let positionOfLatest =
                    chart.config.data.datasets[datasetIndex]._meta[metaKey].data[centerData.index]._model.x;
                if (dataByKey.length <= 1) {
                    return;
                }

                // Sort group data as descending
                const pointRadius = this.state.dynamicPointRadius || 0;
                dataByKey.forEach((dt, index) => {
                    const dtIndex = dt.index;
                    // Skip repositioning the latest point
                    if (index < centerIndex) {
                        chart.config.data.datasets[datasetIndex]._meta[metaKey].data[dtIndex]._model.x =
                            positionOfLatest - pointRadius;
                    } else if (index > centerIndex) {
                        chart.config.data.datasets[datasetIndex]._meta[metaKey].data[dtIndex]._model.x =
                            positionOfLatest + pointRadius;
                    }
                });
            });
        });
    };

    getDataButtonColor = timelineDataName => {
        if (
            !this.state.activeDataNames.includes(timelineDataName) ||
            !this.state.completedPlugins.includes(timelineDataName)
        ) {
            return '#999999';
        }

        return this.timelineModules.find(item => item.name === timelineDataName).color;
    };

    handleDateRangeChange = dateRangeEnumValue => {
        this.setState(
            {
                selectedDateRange: dateRangeEnumValue,
            },
            () => {
                this.fetchChartData();
            }
        );
    };

    getChartData = (existingChartData, xLabels, name, color, mappedData) => {
        // Do not get this.state here since it is a lazy loading function
        // Keep the existing datasets
        const chartData = Object.assign(
            {},
            {
                datasets: [],
            },
            existingChartData || {}
        );

        // Use the new xLabels
        chartData.labels = xLabels;

        // Resize data points dynamically
        const slotWidth = this.state.slotWidth;
        const slotHalfWidth = slotWidth / 2;
        const maxPointsOnSameLabel = 4;
        const minSize = 2;
        const size = Math.max(slotHalfWidth / maxPointsOnSameLabel);
        const dynamicPointRadius = size < minSize ? minSize : size;
        this.setState({
            dynamicPointRadius,
        });

        const dataSet = {
            label: name,
            data: mappedData,
            fill: false,
            backgroundColor: color,
            borderColor: color,
            yAxisID: `yAxis${name.replace(/\s/g, '')}`,
            lineTension: 0,
            showLine: false,
            pointStyle: 'line',
            pointBorderWidth: 3,
            pointRadius: dynamicPointRadius,
            pointHoverRadius: dynamicPointRadius + 2,
            pointHoverBorderWidth: 4,
            pointBackgroundColor: color,
        };

        let found = false;
        for (let i = 0; i < chartData.datasets.length; i++) {
            if (chartData.datasets[i].label !== name) {
                continue;
            }

            found = true;
            chartData.datasets[i] = dataSet;
        }

        if (!found) {
            chartData.datasets.push(dataSet);
        }

        return chartData;
    };

    getChartOptions = (existingChartOptions, name, mappedData) => {
        // Do not get this.state here since it is a lazy loading function

        const chartOptions = Object.assign(
            {},
            existingChartOptions || {
                responsive: true,
                aspectRatio: 4,
                legend: {
                    display: false,
                },
                layout: {
                    padding: {
                        top: 5,
                    },
                },
                tooltips: {
                    callbacks: {
                        title: function(tooltipItems, data) {
                            return data.datasets[tooltipItems[0].datasetIndex].data[tooltipItems[0].index].x;
                        },
                    },
                },
                scales: {
                    yAxes: [],
                },
            }
        );

        let min = 0;
        let max = 10;
        if (mappedData && mappedData.length) {
            min = mappedData[0].y;
            max = mappedData[0].y;
            mappedData.forEach(({ y }) => {
                if (y < min) {
                    min = y;
                }
                if (y > max) {
                    max = y;
                }
            });
        }

        const stepSize = Math.round((max - min) / 10);

        const yAxis = {
            id: `yAxis${name.replace(/\s/g, '')}`,
            display: false,
            ticks: {
                beginAtZero: true,
                stepSize,
                max: max + stepSize, // add some space on top
            },
            gridLines: {
                drawOnArea: false,
            },
        };

        let found = false;
        for (let i = 0; i < chartOptions.scales.yAxes.length; i++) {
            if (chartOptions.scales.yAxes[i].label !== name) {
                continue;
            }

            found = true;
            chartOptions.scales.yAxes[i] = yAxis;
        }

        if (!found) {
            chartOptions.scales.yAxes.push(yAxis);
        }

        return chartOptions;
    };

    mapTimelineData = (data, isYearDifferent) => {
        const mappedData = [];

        data.forEach(dataItem => {
            const { date, value, values } = dataItem;

            const x = this.getXValue(date, isYearDifferent);

            if (value) {
                mappedData.push({
                    x,
                    y: value,
                });
            } else if (values && values.length) {
                mappedData.push(
                    values.map(v => ({
                        x,
                        y: v,
                    }))
                );
            }
        });

        return mappedData;
    };

    getXValue = (date, isYearDifferent) => {
        if (isYearDifferent) {
            return moment(date).format(`MMM DD, YYYY`);
        }

        return moment(date).format(`MMM DD`);
    };

    getDateRangeValues = () => {
        const { selectedDateRange } = this.state;

        if (selectedDateRange === DateRangeEnum.ONE_MONTH) {
            return {
                dateStart: moment().subtract(1, 'month'),
                dateEnd: moment(),
            };
        }

        if (selectedDateRange === DateRangeEnum.THREE_MONTH) {
            return {
                dateStart: moment().subtract(3, 'month'),
                dateEnd: moment(),
            };
        }

        if (selectedDateRange === DateRangeEnum.SIX_MONTH) {
            return {
                dateStart: moment().subtract(6, 'month'),
                dateEnd: moment(),
            };
        }

        if (selectedDateRange === DateRangeEnum.NINE_MONTH) {
            return {
                dateStart: moment().subtract(9, 'month'),
                dateEnd: moment(),
            };
        }

        if (selectedDateRange === DateRangeEnum.ONE_YEAR) {
            return {
                dateStart: moment().subtract(1, 'year'),
                dateEnd: moment(),
            };
        }

        if (selectedDateRange === DateRangeEnum.TWO_YEAR) {
            return {
                dateStart: moment().subtract(2, 'year'),
                dateEnd: moment(),
            };
        }

        // MAX (All Lifetime)
        const { patientDob } = ProfileManager.activeProfile;
        if (patientDob) {
            return {
                dateStart: moment(patientDob),
                dateEnd: moment(),
            };
        }

        // Revert back to 1M
        return {
            dateStart: moment().subtract(1, 'month'),
            dateEnd: moment(),
        };
    };

    getXLabels = (dateStart, dateEnd, isYearDifferent) => {
        const xLabels = [];

        for (let date = dateStart.clone(); date.isSameOrBefore(dateEnd); date.add(1, 'day')) {
            xLabels.push(this.getXValue(date, isYearDifferent));
        }

        return xLabels;
    };

    loadChart = (currentState, xLabels, dataSetList) => {
        let existingChartData = currentState.chartData && Object.assign({}, currentState.chartData);
        let existingChartOptions = currentState.chartOptions && Object.assign({}, currentState.chartOptions);

        let allMappedDataInGroup = [];
        dataSetList.forEach(({ name, color, mappedData }) => {
            allMappedDataInGroup.push(...mappedData);

            const chartData = this.getChartData(existingChartData, xLabels, name, color, mappedData);
            const chartOptions = this.getChartOptions(existingChartOptions, name, allMappedDataInGroup);

            existingChartData = chartData && Object.assign({}, chartData);
            existingChartOptions = chartOptions && Object.assign({}, chartOptions);
        });

        return {
            chartData: existingChartData,
            chartOptions: existingChartOptions,
        };
    };

    fetchChartData = async () => {
        const { dateStart, dateEnd } = this.getDateRangeValues();
        const isYearDifferent = dateStart.year() !== dateEnd.year();
        const completedPlugins = [];
        this.setState({ completedPlugins });

        const xLabels = this.getXLabels(dateStart, dateEnd, isYearDifferent);
        this.setSlotWidth(xLabels.length);

        this.timelineModules.forEach(async timelineModule => {
            const { name, color, getData, children } = timelineModule;

            // Fetch data using timeline data function(s)
            const dataSetList = [];
            if (typeof getData === 'function') {
                const data = await getData(dateStart, dateEnd);
                const mappedData = this.mapTimelineData(data, isYearDifferent);

                dataSetList.push({
                    name,
                    color,
                    mappedData,
                });
            } else if (children) {
                const promises = [];

                children.forEach(child => {
                    const promise = new Promise(resolve => {
                        child.getData(dateStart, dateEnd).then(data => {
                            const mappedData = this.mapTimelineData(data, isYearDifferent);

                            resolve({
                                name: child.name,
                                color: child.color || color,
                                mappedData,
                            });
                        });
                    });

                    promises.push(promise);
                });

                const promiseResults = await Promise.all(promises);
                dataSetList.push(...promiseResults);
            } else {
                return;
            }

            // Prevent race condition with react state since this is lazy loading for multiple timeline data
            completedPlugins.push(name);
            this.setState(currentState => {
                const { chartData, chartOptions } = this.loadChart(currentState, xLabels, dataSetList);

                // Destroy the previous chart
                if (currentState.chart) {
                    currentState.chart.destroy();
                }

                const chart = new Chart(this.chartRef.current, {
                    type: 'line',
                    data: Object.assign({}, chartData),
                    options: Object.assign({}, chartOptions),
                });

                // Show only active ones after date range change
                chart.data.datasets = this.filterVisibleDatasets(chartData);
                chart.update();

                return {
                    chartData,
                    chartOptions,
                    chart,
                    completedPlugins,
                };
            });
        });
    };

    setSlotWidth = labelsCount => {
        const margin = 70;
        const chartBoxWidth = this.chartBoxRef.current.clientWidth - margin;
        const slotWidth = chartBoxWidth / labelsCount;
        this.setState({ slotWidth });
    };

    componentDidMount() {
        PluginManager.plugins.forEach(plugin => {
            const timelineModule = plugin.modules[ModuleTypeEnum.TimelineModule];
            if (timelineModule && typeof timelineModule.getData === 'function') {
                return this.timelineModules.push(timelineModule);
            }

            if (Array.isArray(timelineModule) && timelineModule.length) {
                const validModules = timelineModule.filter(
                    m =>
                        typeof m.getData === 'function' ||
                        (Array.isArray(m.children) && m.children.every(c => c.name && typeof c.getData === 'function'))
                );
                return this.timelineModules.push(...validModules);
            }

            if (timelineModule) {
                logger.warn('Invalid Timeline Module', timelineModule.name);
            }
        });

        // Activate all on load
        this.setState({
            activeDataNames: this.timelineModules.map(m => m.name),
        });
    }

    filterVisibleDatasets(chartData) {
        const { activeDataNames } = this.state;

        const activeTimelineModules = this.timelineModules.filter(m => activeDataNames.includes(m.name));

        return chartData.datasets.filter(
            ds =>
                activeDataNames.includes(ds.label) ||
                activeTimelineModules.some(m => m.children && m.children.some(c => c.name === ds.label))
        );
    }

    changeTimelineModule(e) {
        const { chart, activeDataNames, chartData } = this.state;
        const element = e.currentTarget;
        const { id } = element;
        const isActive = element.classList.contains('active');

        if (isActive) {
            const index = activeDataNames.indexOf(id);
            activeDataNames.splice(index, 1);
        } else {
            // Add to active plugins
            activeDataNames.push(id);
        }

        this.setState({
            activeDataNames,
        });

        chart.data.datasets = this.filterVisibleDatasets(chartData);

        chart.update();
    }

    getButtonStyle(name) {
        if (this.state.completedPlugins.includes(name) < 0) {
            return 'disabled';
        }

        if (this.state.activeDataNames.includes(name)) {
            return 'active';
        }
    }

    getDataButtons() {
        return this.timelineModules.map((module, index) => {
            const completed = this.state.completedPlugins.includes(module.name);

            return (
                <Grid key={index} item style={{ maxWidth: '110px', margin: '0 10px' }}>
                    <Link
                        id={module.name}
                        onClick={e => this.changeTimelineModule(e)}
                        className={this.getButtonStyle(module.name)}
                    >
                        <div style={{ width: '32px', height: '32px' }}>
                            {completed ? (
                                getIcon(module.icon, 32, this.getDataButtonColor(module.name))
                            ) : (
                                <CircularProgress color="primary" size={32} />
                            )}
                        </div>

                        <Typography
                            className="plugin-name"
                            align="center"
                            style={{ color: this.getDataButtonColor(module.name), marginTop: '5px' }}
                        >
                            {module.name}
                        </Typography>
                    </Link>
                </Grid>
            );
        });
    }

    render() {
        return (
            <React.Fragment>
                <Box>
                    <Typography variant="h3" color="primary" style={{ margin: '5px 15px 0 30px' }}>
                        {t('ehr', 'Timeline')}
                    </Typography>
                </Box>
                <Card>
                    <Box mt={1} style={{ position: 'relative' }}>
                        <Box ref={this.chartBoxRef} m={4}>
                            <canvas ref={this.chartRef} />
                        </Box>
                        {!this.state.completedPlugins.length && (
                            <div style={{ position: 'absolute', top: '30px', left: 'calc(50% - 10px)' }}>
                                <Typography variant="h3" color="primary">
                                    <CircularProgress size={48} color="primary" />
                                </Typography>
                            </div>
                        )}
                    </Box>
                    <Box>
                        <Box ml={4} mr={4} mt={2} mb={2}>
                            <Grid container direction="row" spacing={2} alignItems="center">
                                <Grid item xs={8}>
                                    <Grid container alignItems="center">
                                        {this.getDataButtons()}
                                    </Grid>
                                </Grid>
                                <Grid item xs={4} style={{ textAlign: 'right' }}>
                                    <TimeRangeFilter handleDateRangeChange={this.handleDateRangeChange} />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Card>
            </React.Fragment>
        );
    }
}

export default withMain(Timeline);

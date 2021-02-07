import React, { Component } from 'react';
import Chart from 'chart.js';
import moment from 'moment';
import { Grid, Box, Typography, Link as MuiLink, withStyles } from '@material-ui/core';
import { ModuleTypeEnum, PluginManager, Logger, getIcon, ProfileManager } from '@kailona/core';
import TimeRangeFilter from './TimeRangeFilter';
import DateRangeEnum from '@kailona/core/src/enums/DateRange.enum';

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
    },
}))(MuiLink);

export default class Timeline extends Component {
    constructor(props) {
        super(props);

        this.timelineModules = [];

        this.chartRef = React.createRef();

        this.state = {
            activeDataNames: [],
            selectedDateRange: DateRangeEnum.ONE_MONTH,
        };
    }

    getDataButtonColor = timelineDataName => {
        if (!this.state.activeDataNames.includes(timelineDataName)) {
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
        const dynamicPointRadius = Math.max(Math.round((50 * 10) / xLabels.length), 2);

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
                max,
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

        // MAX (Lifetime)
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

    fetchChartData = async () => {
        const { dateStart, dateEnd } = this.getDateRangeValues();
        const isYearDifferent = dateStart.year() !== dateEnd.year();

        const xLabels = this.getXLabels(dateStart, dateEnd, isYearDifferent);

        this.timelineModules.forEach(async timelineModule => {
            const { name, color, getData } = timelineModule;

            const data = await getData(dateStart, dateEnd);

            const mappedData = this.mapTimelineData(data, isYearDifferent);

            // Prevent race condition with react state since this is lazy loading for multiple timeline data
            this.setState(currentState => {
                const { chartData: existingChartData, chartOptions: existingChartOptions } = currentState;

                const chartData = this.getChartData(existingChartData, xLabels, name, color, mappedData);
                const chartOptions = this.getChartOptions(existingChartOptions, name, mappedData);

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
                chart.data.datasets = chartData.datasets.filter(ds => currentState.activeDataNames.includes(ds.label));
                chart.update();

                return {
                    chartData,
                    chartOptions,
                    chart,
                };
            });
        });
    };

    componentDidMount() {
        PluginManager.plugins.forEach(plugin => {
            const timelineModule = plugin.modules[ModuleTypeEnum.TimelineModule];
            if (timelineModule && typeof timelineModule.getData === 'function') {
                return this.timelineModules.push(timelineModule);
            }

            if (Array.isArray(timelineModule) && timelineModule.length) {
                const validModules = timelineModule.filter(m => typeof m.getData === 'function');
                return this.timelineModules.push(...validModules);
            }

            if (timelineModule) {
                logger.warn('Invalid Timeline Module', timelineModule.name);
            }
        });

        // Activate all on load
        this.setState(
            {
                activeDataNames: this.timelineModules.map(m => m.name),
            },
            () => {
                this.fetchChartData();
            }
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

        chart.data.datasets = chartData.datasets.filter(ds => activeDataNames.includes(ds.label));
        chart.update();
    }

    getDataButtons() {
        return this.timelineModules.map((module, index) => (
            <Grid key={index} item>
                <Link
                    id={module.name}
                    onClick={e => this.changeTimelineModule(e)}
                    className={this.state.activeDataNames.includes(module.name) ? 'active' : ''}
                >
                    {getIcon(module.icon, 32, this.getDataButtonColor(module.name))}
                    <Typography className="plugin-name" style={{ color: this.getDataButtonColor(module.name) }}>
                        {module.name}
                    </Typography>
                </Link>
            </Grid>
        ));
    }

    render() {
        return (
            <React.Fragment>
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
                                    {this.getDataButtons()}
                                </Grid>
                            </Grid>
                            <Grid item xs={4} style={{ textAlign: 'right' }}>
                                <TimeRangeFilter handleDateRangeChange={this.handleDateRangeChange} />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </React.Fragment>
        );
    }
}

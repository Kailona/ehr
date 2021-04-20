import React, { Component } from 'react';
import moment from 'moment';
import { Typography, Box, FormControl, Grid } from '@material-ui/core';
import { KailonaButton, KailonaTable, KailonaDateRangePicker } from '@kailona/ui';
import { Edit, Delete } from '@material-ui/icons';
import ActivitiesService from '../services/ActivitiesService';
import { Logger, fhirDataFormatter } from '@kailona/core';
import ActivitiesEditModal from './ActivitiesEditModal';

const logger = new Logger('Activities.ActivitiesDataModule');

export default class ActivitiesDataModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            filters: {
                dateRange: {
                    begin: moment()
                        .clone()
                        .subtract(1, 'month'),
                    end: moment(),
                },
            },
            page: 0,
            rowsPerPage: 10,
            data: [],
            columns: [
                {
                    label: '',
                    key: 'datePeriodFormatted',
                },
                {
                    label: t('ehr', 'Steps'),
                    key: 'steps',
                },
                {
                    label: t('ehr', 'Distance'),
                    key: 'distance',
                },
                {
                    label: t('ehr', 'Calories'),
                    key: 'calories',
                },
            ],
            activitiesDataToUpdate: null,
            savingActivities: false,
        };

        this.contextMenuOptions = [
            {
                label: t('ehr', 'Edit'),
                icon: <Edit fontSize="small" />,
                onClick: this.onEditActivities,
            },
            {
                label: t('ehr', 'Delete'),
                icon: <Delete fontSize="small" />,
                onClick: this.handleDelete,
            },
        ];

        this.activitiesService = new ActivitiesService();

        this.activitiesEditModalRef = React.createRef();
    }

    formatActivityTime = activities => {
        return activities.map(activity => ({
            datePeriodFormatted: fhirDataFormatter.formatDatePeriod(activity.datePeriod),
            ...activity,
        }));
    };

    fetchActivities = async () => {
        this.setState({
            loading: true,
        });

        const { filters } = this.state;

        try {
            const params = [
                {
                    date: `ge${moment(filters.dateRange.begin)
                        .hour(0)
                        .minute(0)
                        .second(0)
                        .utc()
                        .toISOString()}`,
                },
                {
                    date: `le${moment(filters.dateRange.end)
                        .hour(23)
                        .minute(59)
                        .second(59)
                        .utc()
                        .toISOString()}`,
                },
                {
                    _sort: '-date',
                    _count: this.state.rowsPerPage,
                },
            ];

            const activities = await this.activitiesService.fetchData(params);

            const data = this.formatActivityTime(activities);

            this.setState({
                loading: false,
                data,
            });
        } catch (error) {
            logger.error(error);
        }
    };

    fetchNextActivities = async () => {
        if (!this.activitiesService.hasNextData) {
            return;
        }

        this.setState({
            loading: true,
        });

        try {
            const nextActivities = await this.activitiesService.fetchNextData(this.state.data);

            const allActivities = [...this.state.data, ...nextActivities];

            this.setState({
                loading: false,
                data: this.formatActivityTime(allActivities),
            });
        } catch (error) {
            logger.error(error);
        }
    };

    componentDidMount = () => {
        this.fetchActivities();
    };

    filterByDateRange = dateRangeValue => {
        const { filters } = this.state;
        filters.dateRange = dateRangeValue;

        this.setState(
            {
                filters,
            },
            () => {
                this.fetchActivities();
            }
        );
    };

    handleSave = async activitiesData => {
        this.setState({
            savingActivities: true,
        });

        try {
            await this.activitiesService.upsertData(activitiesData);

            this.activitiesEditModalRef.current.toggleModal(false);
            this.fetchActivities();
        } catch (error) {
            logger.error(error);
        }

        this.setState({
            savingActivities: false,
        });
    };

    handleDelete = async activitiesData => {
        const { id: observationId } = activitiesData;
        this.setState({
            savingActivities: true,
        });

        try {
            await this.activitiesService.removeData(observationId);

            this.activitiesEditModalRef.current.toggleModal(false);
            this.fetchActivities();
        } catch (error) {
            logger.error(error);
        }
        this.setState({
            savingActivities: false,
        });
    };

    onChangePage = (e, page) => {
        this.setState(
            {
                page,
            },
            () => {
                this.fetchActivities();
            }
        );
    };

    onChangeRowsPerPage = e => {
        const { value } = e.target;

        this.setState(
            {
                rowsPerPage: value,
            },
            () => {
                this.fetchActivities();
            }
        );
    };

    onAddNewActivities = () => {
        this.setState(
            {
                activitiesDataToUpdate: null,
            },
            () => {
                this.activitiesEditModalRef.current.toggleModal(true);
            }
        );
    };

    onEditActivities = activitiesData => {
        this.setState(
            {
                activitiesDataToUpdate: activitiesData,
            },
            () => {
                this.activitiesEditModalRef.current.toggleModal(true);
            }
        );
    };

    render() {
        const { loading, filters } = this.state;

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div>
                    <div className="title">
                        <Typography variant="h3">Activities</Typography>
                    </div>
                    <Box className="add-new" mt={2}>
                        <KailonaButton title={t('ehr', 'Add New Activity')} onClick={this.onAddNewActivities} />
                    </Box>
                    <Box className="filters" mt={2}>
                        <Grid container alignItems="center" justifyContent="center">
                            <Grid item>
                                <Typography variant="body1" style={{ marginRight: '6px' }}>
                                    Filter by:{' '}
                                </Typography>
                            </Grid>
                            <Grid className="right-column" item>
                                <FormControl>
                                    <KailonaDateRangePicker
                                        id="date"
                                        defaultValue={filters.dateRange}
                                        onChange={this.filterByDateRange}
                                        ariaLabel={t('ehr', 'Filter by date')}
                                        maxDate={new Date()}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </div>

                <Box className="content" mt={3} style={{ display: 'flex', flex: 1 }}>
                    <KailonaTable
                        data={this.state.data}
                        columns={this.state.columns}
                        page={this.state.page}
                        rowsPerPage={this.state.rowsPerPage}
                        onChangePage={this.onChangePage}
                        onChangeRowsPerPage={this.onChangeRowsPerPage}
                        contextMenu={this.contextMenuOptions}
                        onEdit={this.onEditActivities}
                        loading={loading}
                        fetchNewData={this.fetchNextActivities}
                    />
                </Box>
                <ActivitiesEditModal
                    ref={this.activitiesEditModalRef}
                    activitiesData={this.state.activitiesDataToUpdate}
                    handleSave={this.handleSave}
                    savingActivities={this.state.savingActivities}
                />
            </div>
        );
    }
}

import React, { Component } from 'react';
import moment from 'moment';
import { Typography, Box, FormControl, Grid } from '@material-ui/core';
import { KailonaButton, KailonaTable, KailonaDateRangePicker } from '@kailona/ui';
import { Edit, Delete } from '@material-ui/icons';
import VitalsService from '../services/VitalsService';
import { Logger } from '@kailona/core';
import VitalsEditModal from './VitalsEditModal';
import GridColumn from '../lib/GridColumn';

const logger = new Logger('VitalsDataModule');

export default class VitalsDataModule extends Component {
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
                    key: 'date',
                },
                {
                    label: t('ehr', 'Systolic Blood Pressure'),
                    key: 'systolicBloodPressure',
                },
                {
                    label: t('ehr', 'Diastolic Blood Pressure'),
                    key: 'diastolicBloodPressure',
                },
                {
                    label: t('ehr', 'Heart Rate'),
                    key: 'heartRate',
                },
                {
                    label: t('ehr', 'Oxygen Saturation (SpO2)'),
                    key: 'oxygenSaturation',
                },
            ],
            vitalsDataToUpdate: null,
            savingVitals: false,
        };

        this.contextMenuOptions = [
            {
                label: t('ehr', 'Edit'),
                icon: <Edit fontSize="small" />,
                onClick: this.onEditVitals,
            },
            {
                label: t('ehr', 'Delete'),
                icon: <Delete fontSize="small" />,
                onClick: this.handleDelete,
            },
        ];

        this.vitalsService = new VitalsService();

        this.vitalsEditModalRef = React.createRef();
    }

    sortVitals(vitals) {
        return vitals.sort((v1, v2) => (moment(v1.date).isSameOrAfter(moment(v2.date)) ? -1 : 1));
    }

    fetchVitals = async () => {
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
                    code: 'http://loinc.org|85353-1',
                    _include: 'Observation:has-member',
                    //_sort: '-date', // not supported with _include by ibm fhir server
                    _count: this.state.rowsPerPage,
                },
            ];

            const vitals = await this.vitalsService.fetchData(params);

            this.setState({
                loading: false,
                data: this.sortVitals(vitals),
            });
        } catch (error) {
            logger.error(error);
        }
    };

    fetchNextVitals = async () => {
        if (!this.vitalsService.hasNextData) {
            return;
        }

        this.setState({
            loading: true,
        });

        try {
            const nextVitals = await this.vitalsService.fetchNextData(this.state.data);

            const allVitals = [...this.state.data, ...nextVitals];

            this.setState({
                loading: false,
                data: this.sortVitals(allVitals),
            });
        } catch (error) {
            logger.error(error);
        }
    };

    componentDidMount = () => {
        this.fetchVitals();
    };

    filterByDateRange = dateRangeValue => {
        const { filters } = this.state;
        filters.dateRange = dateRangeValue;

        this.setState(
            {
                filters,
            },
            () => {
                this.fetchVitals();
            }
        );
    };

    handleSave = async vitalsData => {
        this.setState({
            savingVitals: true,
        });

        try {
            await this.vitalsService.upsertData(vitalsData);

            this.vitalsEditModalRef.current.toggleModal(false);
            this.fetchVitals();
        } catch (error) {
            logger.error(error);
        }

        this.setState({
            savingVitals: false,
        });
    };

    handleDelete = async vitalsData => {
        const { idMap } = vitalsData;
        this.setState({
            savingVitals: true,
        });

        const promises = [];

        Object.values(idMap).forEach(id => {
            const promise = this.vitalsService.removeData(id);
            promises.push(promise);
        });

        try {
            await Promise.all(promises);

            this.vitalsEditModalRef.current.toggleModal(false);
            this.fetchVitals();
        } catch (error) {
            logger.error(error);
        }
        this.setState({
            savingVitals: false,
        });
    };

    onChangePage = (e, page) => {
        this.setState(
            {
                page,
            },
            () => {
                this.fetchVitals();
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
                this.fetchVitals();
            }
        );
    };

    onAddNewVitals = () => {
        this.setState(
            {
                vitalsDataToUpdate: null,
            },
            () => {
                this.vitalsEditModalRef.current.toggleModal(true);
            }
        );
    };

    onEditVitals = vitalsData => {
        this.setState(
            {
                vitalsDataToUpdate: vitalsData,
            },
            () => {
                this.vitalsEditModalRef.current.toggleModal(true);
            }
        );
    };

    render() {
        const { loading, filters } = this.state;

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div>
                    <div className="title">
                        <Typography variant="h3">Vitals</Typography>
                    </div>
                    <Box className="add-new" mt={2}>
                        <KailonaButton title={t('ehr', 'Add New Vitals')} onClick={this.onAddNewVitals} />
                    </Box>
                    <Box className="filters" mt={2}>
                        <Grid container alignItems="center" justifyContent="center">
                            <Grid item>
                                <Typography variant="body1" style={{ marginRight: '6px' }}>
                                    Filter by:{' '}
                                </Typography>
                            </Grid>
                            <GridColumn className="right-column" item>
                                <FormControl>
                                    <KailonaDateRangePicker
                                        id="date"
                                        defaultValue={filters.dateRange}
                                        onChange={this.filterByDateRange}
                                        ariaLabel={t('ehr', 'Filter by date')}
                                        maxDate={new Date()}
                                    />
                                </FormControl>
                            </GridColumn>
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
                        onEdit={this.onEditVitals}
                        loading={loading}
                        fetchNewData={this.fetchNextVitals}
                    />
                </Box>
                <VitalsEditModal
                    ref={this.vitalsEditModalRef}
                    vitalsData={this.state.vitalsDataToUpdate}
                    handleSave={this.handleSave}
                    savingVitals={this.state.savingVitals}
                />
            </div>
        );
    }
}

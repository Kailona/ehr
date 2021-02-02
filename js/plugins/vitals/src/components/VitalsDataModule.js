import React, { Component } from 'react';
import moment from 'moment';
import { Typography, Box, FormControl, Grid } from '@material-ui/core';
import { KailonaButton, KailonaTable, KailonaDatePicker, Loader } from '@kailona/ui';
import VitalsService from '../services/VitalsService';
import { Logger } from '@kailona/core';
import VitalsEditModal from './VitalsEditModal';
import GridColumn from '../lib/GridColumn';

import { Edit, Delete } from '@material-ui/icons';

const logger = new Logger('VitalsDataModule');

export default class VitalsDataModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            filters: {},
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

    fetchVitals = async () => {
        this.setState({
            loading: true,
        });

        try {
            // Filter by last month (FHIR date/time in UTC)
            const endMoment = moment.utc();
            const startMoment = endMoment.clone().subtract(1, 'month');

            const params = [
                {
                    date: `le${endMoment.format('YYYY-MM-DD')}`,
                },
                {
                    date: `ge${startMoment.format('YYYY-MM-DD')}`,
                },
                {
                    _sort: '-date',
                    _count: this.state.rowsPerPage,
                },
            ];

            // TODO: Apply filters and pagination

            const vitals = await this.vitalsService.fetchVitals(params);

            this.setState({
                loading: false,
                data: vitals,
            });
        } catch (error) {
            logger.error(error);
        }
    };

    componentDidMount = () => {
        this.fetchVitals();
    };

    filterByDate = dateValue => {
        const formattedDate = moment(dateValue).format('DD/MM/YYYY');

        const filters = this.state.filters || {};
        filters.date = formattedDate;

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
        const { idMap } = vitalsData;
        this.setState({
            savingVitals: true,
        });

        try {
            if (idMap && Object.keys(idMap).length) {
                await this.vitalsService.updateVitals(vitalsData);
            } else {
                await this.vitalsService.addVitals(vitalsData);
            }

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
            const promise = this.vitalsService.removeVitals(id);
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
        const { loading } = this.state;

        return (
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
                            <Typography variant="body1">Filter by: </Typography>
                        </Grid>
                        <GridColumn className="right-column" item>
                            <FormControl>
                                <KailonaDatePicker
                                    id="date"
                                    onChange={this.filterByDate}
                                    ariaLabel={t('ehr', 'Filter by date')}
                                />
                            </FormControl>
                        </GridColumn>
                    </Grid>
                </Box>
                <Box className="content" mt={3} style={{ display: 'flex' }}>
                    {loading ? (
                        <Loader />
                    ) : (
                        <KailonaTable
                            data={this.state.data}
                            columns={this.state.columns}
                            page={this.state.page}
                            rowsPerPage={this.state.rowsPerPage}
                            onChangePage={this.onChangePage}
                            onChangeRowsPerPage={this.onChangeRowsPerPage}
                            contextMenu={this.contextMenuOptions}
                            onEdit={this.onEditVitals}
                        />
                    )}
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

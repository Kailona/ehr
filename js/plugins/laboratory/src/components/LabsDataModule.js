import React, { Component } from 'react';
import moment from 'moment';
import { Typography, Box, FormControl, Grid } from '@material-ui/core';
import { KailonaButton, KailonaTable, KailonaDateRangePicker } from '@kailona/ui';
import { Edit, Delete } from '@material-ui/icons';
import LaboratoryService from '../services/LaboratoryService';
import { Logger } from '@kailona/core';
import LabsEditModal from './LabsEditModal';
import GridColumn from '../lib/GridColumn';

const logger = new Logger('Laboratory.LabsDataModule');

export default class LabsDataModule extends Component {
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
            rowsPerPage: 25,
            data: [],
            columns: [
                {
                    label: '',
                    key: 'date',
                },
                {
                    label: t('ehr', 'Leukocytes'),
                    key: 'leukocytes',
                },
                {
                    label: t('ehr', 'Hemoglobin'),
                    key: 'hemoglobin',
                },
                {
                    label: t('ehr', 'Platelets'),
                    key: 'platelets',
                },
            ],
            labsDataToUpdate: null,
            savingLabs: false,
        };

        this.contextMenuOptions = [
            {
                label: t('ehr', 'Edit'),
                icon: <Edit fontSize="small" />,
                onClick: this.onEditLabs,
            },
            {
                label: t('ehr', 'Delete'),
                icon: <Delete fontSize="small" />,
                onClick: this.handleDelete,
            },
        ];

        this.laboratoryService = new LaboratoryService();

        this.labsEditModalRef = React.createRef();
    }

    sortLabs(labs) {
        return labs.sort((v1, v2) => (moment(v1.date).isSameOrAfter(moment(v2.date)) ? -1 : 1));
    }

    fetchLabs = async () => {
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
                    code: 'http://loinc.org|55429-5',
                    _include: 'Observation:has-member',
                    //_sort: '-date', // not supported with _include by ibm fhir server
                    _count: this.state.rowsPerPage,
                },
            ];

            const labs = await this.laboratoryService.fetchData(params);

            this.setState({
                loading: false,
                data: this.sortLabs(labs),
            });
        } catch (error) {
            logger.error(error);
        }
    };

    fetchNextLabs = async () => {
        if (!this.laboratoryService.hasNextData) {
            return;
        }

        this.setState({
            loading: true,
        });

        try {
            const nextLabs = await this.laboratoryService.fetchNextData(this.state.data);

            const allLabs = [...this.state.data, ...nextLabs];

            this.setState({
                loading: false,
                data: this.sortLabs(allLabs),
            });
        } catch (error) {
            logger.error(error);
        }
    };

    componentDidMount = () => {
        this.fetchLabs();
    };

    filterByDateRange = dateRangeValue => {
        const { filters } = this.state;
        filters.dateRange = dateRangeValue;

        this.setState(
            {
                filters,
            },
            () => {
                this.fetchLabs();
            }
        );
    };

    handleSave = async labsData => {
        this.setState({
            savingLabs: true,
        });

        try {
            await this.laboratoryService.upsertData(labsData);

            this.labsEditModalRef.current.toggleModal(false);
            this.fetchLabs();
        } catch (error) {
            logger.error(error);
        }

        this.setState({
            savingLabs: false,
        });
    };

    handleDelete = async labsData => {
        const { idMap } = labsData;
        this.setState({
            savingLabs: true,
        });

        const promises = [];

        Object.values(idMap).forEach(id => {
            const promise = this.laboratoryService.removeData(id);
            promises.push(promise);
        });

        try {
            await Promise.all(promises);

            this.labsEditModalRef.current.toggleModal(false);
            this.fetchLabs();
        } catch (error) {
            logger.error(error);
        }
        this.setState({
            savingLabs: false,
        });
    };

    onChangePage = (e, page) => {
        this.setState(
            {
                page,
            },
            () => {
                this.fetchLabs();
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
                this.fetchLabs();
            }
        );
    };

    onAddNewLabs = () => {
        this.setState(
            {
                labsDataToUpdate: null,
            },
            () => {
                this.labsEditModalRef.current.toggleModal(true);
            }
        );
    };

    onEditLabs = labsData => {
        this.setState(
            {
                labsDataToUpdate: labsData,
            },
            () => {
                this.labsEditModalRef.current.toggleModal(true);
            }
        );
    };

    render() {
        const { loading, filters } = this.state;

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div>
                    <div className="title">
                        <Typography variant="h3">Laboratory Results</Typography>
                    </div>
                    <Box className="add-new" mt={2}>
                        <KailonaButton title={t('ehr', 'Add New Lab Results')} onClick={this.onAddNewLabs} />
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
                        onEdit={this.onEditLabs}
                        loading={loading}
                        fetchNewData={this.fetchNextLabs}
                    />
                </Box>
                <LabsEditModal
                    ref={this.labsEditModalRef}
                    labsData={this.state.labsDataToUpdate}
                    handleSave={this.handleSave}
                    savingLabs={this.state.savingLabs}
                />
            </div>
        );
    }
}

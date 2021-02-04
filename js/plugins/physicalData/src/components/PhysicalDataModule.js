import React, { Component } from 'react';
import moment from 'moment';
import { Box, FormControl, Grid, Typography } from '@material-ui/core';
import { KailonaButton, KailonaDatePicker, KailonaDateRangePicker, KailonaTable, Loader } from '@kailona/ui';
import { Delete, Edit } from '@material-ui/icons';
import PhysicalDataEditModal from './PhysicalDataEditModal';
import PhysicalDataService from '../services/PhysicalDataService';
import { Logger, ProfileManager } from '@kailona/core';
import calculateAge from '../lib/calculateAge';

const logger = new Logger('PhysicalDataModule');

export default class PhysicalDataModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            filters: {
                dateRange: {
                    begin: moment()
                        .clone()
                        .subtract(19, 'month'),
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
                    label: t('ehr', 'Age'),
                    key: 'age',
                },
                {
                    label: t('ehr', 'Body Height'),
                    key: 'bodyHeight',
                },
                {
                    label: t('ehr', 'Body Weight'),
                    key: 'bodyWeight',
                },
                {
                    label: t('ehr', 'Body Mass Index'),
                    key: 'bmi',
                },
            ],
            physicalDataToUpdate: null,
            savingPhysicalData: false,
        };

        this.contextMenuOptions = [
            {
                label: t('ehr', 'Edit'),
                icon: <Edit fontSize="small" />,
                onClick: this.onEditPhysicalData,
            },
            {
                label: t('ehr', 'Delete'),
                icon: <Delete fontSize="small" />,
                onClick: this.handleDelete,
            },
        ];

        this.physicalDataService = new PhysicalDataService();

        this.physicalDataEditModalRef = React.createRef();
    }

    sortPhysicalDataItems(physicalDataItems) {
        return physicalDataItems.sort((v1, v2) => (moment(v1.date).isSameOrAfter(moment(v2.date)) ? -1 : 1));
    }

    calculateAgeForDataItems(dataItems) {
        return dataItems.map(item => {
            if (item.date) {
                item.age = calculateAge(this.patientDob, item.date);
            }

            return item;
        });
    }

    fetchPhysicalData = async () => {
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
                    code: 'http://loinc.org|34565-2',
                    _include: 'Observation:has-member',
                    //_sort: '-date', // not supported with _include by ibm fhir server
                    _count: this.state.rowsPerPage,
                },
            ];

            const physicalDataItems = await this.physicalDataService.fetchData(params);
            const physicalDataItemsWithAge = this.calculateAgeForDataItems(physicalDataItems);

            this.setState({
                loading: false,
                data: this.sortPhysicalDataItems(physicalDataItemsWithAge),
            });
        } catch (error) {
            logger.error(error);
        }
    };

    fetchNextPhysicalData = async () => {
        if (!this.physicalDataService.hasNextData) {
            return;
        }

        this.setState({
            loading: true,
        });

        try {
            const nextPhysicalDataItems = await this.physicalDataService.fetchNextData(this.state.data);
            const nextPhysicalDataItemsWithAge = this.calculateAgeForDataItems(nextPhysicalDataItems);

            const allPhysicalDataItems = [...this.state.data, ...nextPhysicalDataItemsWithAge];

            this.setState({
                loading: false,
                data: this.sortPhysicalDataItems(allPhysicalDataItems),
            });
        } catch (error) {
            logger.error(error);
        }
    };

    componentDidMount = () => {
        const { patientDob } = ProfileManager.activeProfile;
        this.patientDob = patientDob;

        this.fetchPhysicalData();
    };

    filterByDateRange = dateRangeValue => {
        const { filters } = this.state;
        filters.dateRange = dateRangeValue;

        this.setState(
            {
                filters,
            },
            () => {
                this.fetchPhysicalData();
            }
        );
    };

    handleSave = async physicalData => {
        this.setState({
            savingPhysicalData: true,
        });

        try {
            await this.physicalDataService.upsertData(physicalData);

            this.physicalDataEditModalRef.current.toggleModal(false);
            this.fetchPhysicalData();
        } catch (error) {
            logger.error(error);
        }

        this.setState({
            savingPhysicalData: false,
        });
    };

    handleDelete = async physicalData => {
        const { idMap } = physicalData;
        this.setState({
            savingPhysicalData: true,
        });

        const promises = [];

        Object.values(idMap).forEach(id => {
            const promise = this.physicalDataService.removeData(id);
            promises.push(promise);
        });

        try {
            await Promise.all(promises);

            this.physicalDataEditModalRef.current.toggleModal(false);
            this.fetchPhysicalData();
        } catch (error) {
            logger.error(error);
        }
        this.setState({
            savingPhysicalData: false,
        });
    };

    onChangePage = (e, page) => {
        this.setState(
            {
                page,
            },
            () => {
                this.fetchPhysicalData();
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
                this.fetchPhysicalData();
            }
        );
    };

    onAddNewPhysicalData = () => {
        this.setState(
            {
                physicalDataToUpdate: null,
            },
            () => {
                this.physicalDataEditModalRef.current.toggleModal(true);
            }
        );
    };

    onEditPhysicalData = physicalData => {
        this.setState(
            {
                physicalDataToUpdate: physicalData,
            },
            () => {
                this.physicalDataEditModalRef.current.toggleModal(true);
            }
        );
    };

    render() {
        const { loading, filters } = this.state;

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div>
                    <div className="title">
                        <Typography variant="h3">Physical Data</Typography>
                    </div>
                    <Box className="add-new" mt={2}>
                        <KailonaButton title={t('ehr', 'Add Physical Data')} onClick={this.onAddNewPhysicalData} />
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
                        onEdit={this.onEditPhysicalData}
                        loading={loading}
                        fetchNewData={this.fetchNextPhysicalData}
                    />
                </Box>
                <PhysicalDataEditModal
                    ref={this.physicalDataEditModalRef}
                    physicalData={this.state.physicalDataToUpdate}
                    handleSave={this.handleSave}
                    savingPhysicalData={this.state.savingPhysicalData}
                />
            </div>
        );
    }
}

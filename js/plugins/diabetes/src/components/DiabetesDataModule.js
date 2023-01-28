import React, { Component } from 'react';
import moment from 'moment';
import { Box, FormControl, Grid, Typography } from '@material-ui/core';
import { KailonaButton, KailonaDateRangePicker, KailonaTable } from '@kailona/ui';
import { Delete, Edit } from '@material-ui/icons';
import DiabetesEditModal from './DiabetesEditModal';
import DiabetesDataService from '../services/DiabetesDataService';
import { Logger, ProfileManager } from '@kailona/core';

const logger = new Logger('Diabetes.DiabetesDataModule');

export default class DiabetesDataModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
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
                    label: t('ehr', 'Time of blood draw'),
                    key: 'timeOfBloodDraw',
                },
                {
                    label: t('ehr', 'Glucose Value'),
                    key: 'glucoseValue',
                },
                {
                    label: t('ehr', 'Glucose Measurer'),
                    key: 'glucoseMeasurer',
                },
            ],
            diabetesToUpdate: null,
            savingDiabetes: false,
        };

        this.contextMenuOptions = [
            {
                label: t('ehr', 'Edit'),
                icon: <Edit fontSize="small" />,
                onClick: this.onEditDiabetesData,
            },
            {
                label: t('ehr', 'Delete'),
                icon: <Delete fontSize="small" />,
                onClick: this.handleDelete,
            },
        ];

        this.diabetesDataService = new DiabetesDataService();

        this.diabetesDataEditModalRef = React.createRef();
    }

    sortDiabetesItems(diabetesItems) {
        return diabetesItems.sort((v1, v2) => (moment(v1.date).isSameOrAfter(moment(v2.date)) ? -1 : 1));
    }

    fetchDiabetes = async () => {
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
                    //_sort: '-date', // not supported with _include by ibm fhir server
                    _count: this.state.rowsPerPage,
                },
            ];

            const diabetesItems = await this.diabetesDataService.fetchData(params);

            this.setState({
                loading: false,
                data: this.sortDiabetesItems(diabetesItems),
            });
        } catch (error) {
            logger.error(error);
        }
    };

    fetchNextDiabetes = async () => {
        if (!this.diabetesDataService.hasNextData) {
            return;
        }

        this.setState({
            loading: true,
        });

        try {
            const nextDiabetesItems = await this.diabetesDataService.fetchNextData(this.state.data);
            const allDiabetesItems = [...this.state.data, ...nextDiabetesItems];

            this.setState({
                loading: false,
                data: this.sortDiabetesItems(allDiabetesItems),
            });
        } catch (error) {
            logger.error(error);
        }
    };

    componentDidMount = () => {
        const { patientDob } = ProfileManager.activeProfile;
        this.patientDob = patientDob;

        this.fetchDiabetes();
    };

    filterByDateRange = dateRangeValue => {
        const { filters } = this.state;
        filters.dateRange = dateRangeValue;

        this.setState(
            {
                filters,
            },
            () => {
                this.fetchDiabetes();
            }
        );
    };

    handleSave = async diabetes => {
        this.setState({
            savingDiabetes: true,
        });

        debugger
        try {
            await this.diabetesDataService.upsertData(diabetes);

            this.diabetesDataEditModalRef.current.toggleModal(false);
            this.fetchDiabetes();
        } catch (error) {
            logger.error(error);
        }

        this.setState({
            savingDiabetes: false,
        });
    };

    handleDelete = async diabetes => {
        const { idMap } = diabetes;
        this.setState({
            savingDiabetes: true,
        });

        const promises = [];

        Object.values(idMap).forEach(id => {
            const promise = this.diabetesDataService.removeData(id);
            promises.push(promise);
        });

        try {
            await Promise.all(promises);

            this.diabetesDataEditModalRef.current.toggleModal(false);
            this.fetchDiabetes();
        } catch (error) {
            logger.error(error);
        }
        this.setState({
            savingDiabetes: false,
        });
    };

    onChangePage = (e, page) => {
        this.setState(
            {
                page,
            },
            () => {
                this.fetchDiabetes();
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
                this.fetchDiabetes();
            }
        );
    };

    onAddNewDiabetes = () => {
        this.setState(
            {
                diabetesToUpdate: null,
            },
            () => {
                this.diabetesDataEditModalRef.current.toggleModal(true);
            }
        );
    };

    onEditDiabetesData = diabetes => {
        this.setState(
            {
                diabetesToUpdate: diabetes,
            },
            () => {
                this.diabetesDataEditModalRef.current.toggleModal(true);
            }
        );
    };

    render() {
        const { loading, filters } = this.state;

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div>
                    <div className="title">
                        <Typography variant="h3">{t('ehr', 'Diabetes')}</Typography>
                    </div>
                    <Box className="add-new" mt={2}>
                        <KailonaButton
                            class="primary"
                            title={t('ehr', 'Add Diabetes Data')}
                            onClick={this.onAddNewDiabetes}
                        />
                    </Box>
                    <Box className="filters" mt={2}>
                        <Grid container alignItems="center" justifyContent="center">
                            <Grid item>
                                <Typography variant="body1" style={{ marginRight: '6px' }}>
                                    {t('ehr', 'Filter by')}:{' '}
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
                        onEdit={this.onEditDiabetesData}
                        loading={loading}
                        fetchNewData={this.fetchNextDiabetes}
                    />
                </Box>
                <DiabetesEditModal
                    ref={this.diabetesDataEditModalRef}
                    diabetes={this.state.diabetesToUpdate}
                    handleSave={this.handleSave}
                    savingDiabetes={this.state.savingDiabetes}
                />
            </div>
        );
    }
}

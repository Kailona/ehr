import React, { Component } from 'react';
import { Box, FormControl, Grid, Typography } from '@material-ui/core';
import { KailonaButton, KailonaDatePicker, KailonaTable, Loader } from '@kailona/ui';
import PhysicalDataEditModal from './PhysicalDataEditModal';
import { Delete, Edit } from '@material-ui/icons';

export default class PhysicalDataModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            filters: {},
            page: 0,
            rowsPerPage: 10,
            data: [
                {
                    date: '02/02/2021',
                    age: 32,
                    height: '160 cm',
                    weight: '62 kg',
                    bmi: '20 bmi',
                },
            ],
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
                    label: t('ehr', 'Height'),
                    key: 'height',
                },
                {
                    label: t('ehr', 'Weight'),
                    key: 'weight',
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

        // TODO: SERVICE
        // this.physicalDataService = new PhysicalDataService();
        this.physicalDataService;
        this.physicalDataEditModalRef = React.createRef();
    }

    fetchPhysicalData = async () => {
        // TODO: FETCH DATA
    };

    componentDidMount = () => {
        this.fetchPhysicalData();
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
                this.fetchPhysicalData();
            }
        );
    };

    handleSave = async physicalData => {
        // const { idMap } = physicalData;
        // this.setState({
        //     savingPhysicalData: true,
        // });
        //
        // try {
        //     if (idMap && Object.keys(idMap).length) {
        //         await this.physicalDataService.updatePhysicalData(physicalData);
        //     } else {
        //         await this.physicalDataService.addPhysicalData(physicalData);
        //     }
        //
        //     this.physicalDataEditModalRef.current.toggleModal(false);
        //     this.fetchPhysicalData();
        // } catch (error) {
        //     logger.error(error);
        // }
        //
        // this.setState({
        //     savingPhysicalData: false,
        // });
    };

    handleDelete = async PhysicalData => {
        // const { idMap } = PhysicalData;
        // this.setState({
        //     savingPhysicalData: true,
        // });
        //
        // const promises = [];
        //
        // Object.values(idMap).forEach(id => {
        //     const promise = this.physicalDataService.removePhysicalData(id);
        //     promises.push(promise);
        // });
        //
        // try {
        //     await Promise.all(promises);
        //
        //     this.physicalDataEditModalRef.current.toggleModal(false);
        //     this.fetchPhysicalData();
        // } catch (error) {
        //     logger.error(error);
        // }
        // this.setState({
        //     savingPhysicalData: false,
        // });
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

    onAddPhysicalData = () => {
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
        const { loading } = this.state;

        return (
            <div>
                <div className="title">
                    <Typography variant="h3">Physical Data</Typography>
                </div>
                <Box className="add-new" mt={2}>
                    <KailonaButton title={t('ehr', 'Add Physical Data')} onClick={this.onAddPhysicalData} />
                </Box>
                <Box className="filters" mt={2}>
                    <Grid container alignItems="center" justifyContent="center">
                        <Grid item>
                            <Typography variant="body1">Filter by: </Typography>
                        </Grid>
                        <Grid className="right-column" item>
                            <FormControl>
                                <KailonaDatePicker
                                    id="date"
                                    onChange={this.filterByDate}
                                    ariaLabel={t('ehr', 'Filter by date')}
                                />
                            </FormControl>
                        </Grid>
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
                            onEdit={this.onEditPhysicalData}
                        />
                    )}
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

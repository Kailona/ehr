import React, { Component } from 'react';
import moment from 'moment';
import {
    Typography,
    Box,
    Dialog,
    DialogActions,
    DialogContent as MuiDialogContent,
    DialogTitle,
    FormControl,
    Grid,
    withStyles,
    IconButton,
} from '@material-ui/core';
import { KailonaButton, KailonaTable, KailonaTextField, KailonaDatePicker, KailonaSelect } from '@kailona/ui';
import { Close as CloseIcon } from '@material-ui/icons';

const DialogContent = withStyles({
    root: {
        height: '100%',
        margin: '0 20px 20px 20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EAEAEA',
        borderRadius: '5px',
        paddingBottom: '25px',
    },
})(MuiDialogContent);

const GridColumn = withStyles({
    root: {
        '&.left-column': {
            margin: '10px 10px 10px 0',
            width: '160px',
        },
        '&.right-column': {
            margin: '10 0px 10px 10px',
            width: '160px',
        },
        '& > .MuiFormControl-root': {
            width: '100%',
        },
    },
})(Grid);

export default class VitalsDataModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddVitalModalOpen: false,
            filters: {},
            form: {},
            page: 0,
            rowsPerPage: 1,
            data: [
                {
                    date: '01/15/2021',
                    source: 'ABC Lab',
                    systolicBloodPressure: 110,
                    diastolicBloodPressure: 70,
                    pulseOx: 97,
                    heartRate: 85,
                },
                {
                    date: '01/14/2021',
                    source: 'Nature Metrics',
                    systolicBloodPressure: 130,
                    diastolicBloodPressure: 80,
                    pulseOx: 97,
                    heartRate: 85,
                },
                {
                    date: '01/13/2021',
                    source: 'ABC Lab',
                    systolicBloodPressure: 94,
                    diastolicBloodPressure: 65,
                    pulseOx: 97,
                    heartRate: 70,
                },
            ],
            columns: [
                {
                    label: 'Date',
                    key: 'date',
                },
                {
                    label: 'Systolic Blood Pressure',
                    key: 'systolicBloodPressure',
                },
                {
                    label: 'Diastolic Blood Pressure',
                    key: 'diastolicBloodPressure',
                },
                {
                    label: 'Pulse Ox (SpO2)',
                    key: 'pulseOx',
                },
                {
                    label: 'Heart Rate',
                    key: 'heartRate',
                },
            ],
            sourceOptions: [
                {
                    value: 'ABC Lab',
                    text: 'ABC Lab',
                },
                {
                    value: 'Nature Metrics',
                    text: 'Nature Metrics',
                },
            ],
        };
        this.handleClose = this.handleClose.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.filterDate = this.filterDate.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.onChangeRowsPerPage = this.onChangeRowsPerPage.bind(this);
        this.handleSourceChange = this.handleSourceChange.bind(this);
    }

    handleClose() {
        const { isAddVitalModalOpen } = this.state;
        this.setState({
            isAddVitalModalOpen: !isAddVitalModalOpen,
        });
    }

    filterDate(dateValue) {
        const formattedDate = moment(dateValue).format('DD/MM/YYYY');
        const filters = this.state.filters || {};
        filters.date = formattedDate;
        this.setState({
            filters,
        });

        this.updateTableData();
    }

    changeValue(e) {
        const { id, value, name } = e.target;
        const form = this.state.form || {};
        if (id) {
            form[id] = value;
        } else {
            form[name] = value;
        }
        this.setState({
            form,
        });
    }

    handleSave() {
        debugger;
        const { form, data } = this.state;
        form.date = moment(new Date()).format('DD/MM/YYYY');
        data.push(form);
        this.setState({ data });
        // TODO: Save data or update data if id is available
        this.handleClose();
    }

    updateTableData() {
        // TODO: Update data by the filters and pagination
        const { filters, page, rowsPerPage } = this.state;
        return this.state.data;
    }

    onChangePage(e, page) {
        this.setState({
            page,
        });

        this.updateTableData();
    }

    onChangeRowsPerPage(e) {
        const { value } = e.target;
        this.setState({
            rowsPerPage: value,
        });

        this.updateTableData();
    }

    handleSourceChange(sourceVal) {
        const { form } = this.state;
        form.source = sourceVal;
        this.setState({ form });
    }

    render() {
        return (
            <div>
                <div className="title">
                    <Typography variant="h3">Vitals</Typography>
                </div>
                <Box className="add-new" mt={2}>
                    <KailonaButton title="Add Vital" onClick={this.handleClose} />
                </Box>
                <Box className="filters" mt={2}>
                    <Grid container alignItems="center" justifyContent="center">
                        <Grid item>
                            <Typography variant="body1">Filter by: </Typography>
                        </Grid>
                        <GridColumn className="right-column" item>
                            <FormControl>
                                <KailonaDatePicker id="date" onDateChange={this.filterDate} ariaLabel="Change Date" />
                            </FormControl>
                        </GridColumn>
                    </Grid>
                </Box>
                <Box className="content" mt={3} style={{ display: 'flex' }}>
                    <KailonaTable
                        data={this.state.data}
                        columns={this.state.columns}
                        page={this.state.page}
                        rowsPerPage={this.state.rowsPerPage}
                        onChangePage={this.onChangePage}
                        onChangeRowsPerPage={this.onChangeRowsPerPage}
                    />
                </Box>
                <Dialog open={this.state.isAddVitalModalOpen} onClose={this.handleClose}>
                    <DialogTitle>
                        <Box display="flex" alignItems="center">
                            <Box flexGrow={1}>
                                <Typography variant="h3">{t('ehr', 'Add Vital')}</Typography>
                            </Box>
                            <Box>
                                <IconButton onClick={this.handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <form>
                            <Grid container alignItems="center">
                                <GridColumn className="left-column" item>
                                    <FormControl>
                                        <KailonaTextField
                                            type="number"
                                            id="systolicBloodPressure"
                                            className="kailona-MuiTextField"
                                            label="Systolic Blood Pressure"
                                            onChange={e => this.changeValue(e)}
                                        />
                                    </FormControl>
                                </GridColumn>
                                <GridColumn className="right-column" item>
                                    <FormControl>
                                        <KailonaTextField
                                            type="number"
                                            id="diastolicBloodPressure"
                                            className="kailona-MuiTextField"
                                            label="Diastolic Blood Pressure"
                                            onChange={e => this.changeValue(e)}
                                        />
                                    </FormControl>
                                </GridColumn>
                            </Grid>
                            <Grid container alignItems="center">
                                <GridColumn className="left-column" item>
                                    <FormControl>
                                        <KailonaTextField
                                            type="number"
                                            id="pulseOx"
                                            className="kailona-MuiTextField"
                                            label="Pulse Ox (SpO2)"
                                            onChange={e => this.changeValue(e)}
                                        />
                                    </FormControl>
                                </GridColumn>
                                <GridColumn className="right-column" item>
                                    <FormControl>
                                        <KailonaTextField
                                            id="heartRate"
                                            type="number"
                                            className="kailona-MuiTextField"
                                            label="Heart Rate"
                                            onChange={e => this.changeValue(e)}
                                        />
                                    </FormControl>
                                </GridColumn>
                            </Grid>
                            <Grid container>
                                <GridColumn className="left-column" item>
                                    <KailonaSelect
                                        id="source"
                                        name="source"
                                        inputLabel="Source"
                                        options={this.state.sourceOptions}
                                        handleChange={this.handleSourceChange}
                                    />
                                </GridColumn>
                            </Grid>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <KailonaButton title="Cancel" class="default" onClick={this.handleClose} />
                        <KailonaButton title="Save" class="primary" onClick={this.handleSave} />
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

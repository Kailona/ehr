import React, { Component } from 'react';
import moment from 'moment';
import {
    Box,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent as MuiDialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputAdornment as MuiInputAdornment,
    Typography,
    withStyles,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { KailonaButton, KailonaDateTimePicker, KailonaTextField } from '@kailona/ui';
import GridColumn from '../lib/GridColumn';

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

const InputAdornment = withStyles({
    root: {
        '& p': {
            fontSize: '10px',
        },
    },
})(MuiInputAdornment);

export default class VitalsEditModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
        };

        this.dateRef = React.createRef();
        this.systolicBloodPressureRef = React.createRef();
        this.diastolicBloodPressureRef = React.createRef();
        this.heartRateRef = React.createRef();
        this.oxygenSaturationRef = React.createRef();
    }

    toggleModal = isOpen => {
        this.setState({
            isOpen,
        });
    };

    onConfirm = () => {
        const vitalsData = {
            date: moment(this.dateRef.current.value),
            systolicBloodPressure: this.systolicBloodPressureRef.current.value,
            diastolicBloodPressure: this.diastolicBloodPressureRef.current.value,
            heartRate: this.heartRateRef.current.value,
            oxygenSaturation: this.oxygenSaturationRef.current.value,
        };

        this.props.handleSave(vitalsData);
    };

    getValue = text => {
        if (!text) {
            return '';
        }

        const [value] = text.split(' ');
        return value;
    };

    render() {
        console.log(' vitals data ', this.props.vitalsData);
        const { date, systolicBloodPressure, diastolicBloodPressure, oxygenSaturation, heartRate } =
            this.props.vitalsData || {};

        return (
            <Dialog open={this.state.isOpen} onClose={() => this.toggleModal(false)}>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>
                            <Typography variant="h3">
                                {t('ehr', this.props.vitalsData ? 'Update Vitals' : 'Add New Vitals')}
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton onClick={() => this.toggleModal(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <form>
                        <Grid container>
                            <FormControl>
                                <KailonaDateTimePicker
                                    inputRef={this.dateRef}
                                    id="date"
                                    ariaLabel={t('ehr', 'Select Date/Time')}
                                    defaultValue={date ? moment(date) : null}
                                />
                            </FormControl>
                        </Grid>
                        <Grid container alignItems="center">
                            <GridColumn className="left-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.systolicBloodPressureRef}
                                        id="systolicBloodPressure"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Systolic Blood Pressure')}
                                        defaultValue={this.getValue(systolicBloodPressure)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>mmHg</InputAdornment>,
                                        }}
                                    />
                                </FormControl>
                            </GridColumn>
                            <GridColumn className="right-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.diastolicBloodPressureRef}
                                        type="number"
                                        id="diastolicBloodPressure"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Diastolic Blood Pressure')}
                                        defaultValue={this.getValue(diastolicBloodPressure)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>mmHg</InputAdornment>,
                                        }}
                                    />
                                </FormControl>
                            </GridColumn>
                        </Grid>
                        <Grid container alignItems="center">
                            <GridColumn className="left-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.heartRateRef}
                                        type="number"
                                        id="heartRate"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Heart Rate')}
                                        defaultValue={this.getValue(heartRate)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>beats/minute</InputAdornment>,
                                        }}
                                    />
                                </FormControl>
                            </GridColumn>
                            <GridColumn className="right-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.oxygenSaturationRef}
                                        type="number"
                                        id="oxygenSaturation"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Oxygen Saturation (SpO2)')}
                                        defaultValue={this.getValue(oxygenSaturation)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>%</InputAdornment>,
                                        }}
                                    />
                                </FormControl>
                            </GridColumn>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <KailonaButton
                        title={t('ehr', 'Cancel')}
                        class="default"
                        disabled={this.props.savingVitals}
                        onClick={() => this.toggleModal(false)}
                    />
                    <KailonaButton
                        title={t('ehr', 'Confirm')}
                        class="primary"
                        disabled={this.props.savingVitals}
                        onClick={this.onConfirm}
                        loading={this.props.savingVitals}
                    />
                </DialogActions>
            </Dialog>
        );
    }
}
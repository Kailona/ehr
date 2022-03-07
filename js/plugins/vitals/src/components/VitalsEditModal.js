import React, { Component } from 'react';
import moment from 'moment';
import {
    Box,
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
import { KailonaButton, KailonaCloseButton, KailonaDateTimePicker, KailonaTextField } from '@kailona/ui';
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
        this.bodyTemperatureRef = React.createRef();
    }

    toggleModal = isOpen => {
        this.setState({
            isOpen,
        });
    };

    onConfirm = () => {
        const newVitalsData = {
            date: moment(this.dateRef.current.value),
            systolicBloodPressure: this.systolicBloodPressureRef.current.value,
            diastolicBloodPressure: this.diastolicBloodPressureRef.current.value,
            heartRate: this.heartRateRef.current.value,
            oxygenSaturation: this.oxygenSaturationRef.current.value,
            bodyTemperature: this.bodyTemperatureRef.current.value,
        };

        const { vitalsData } = this.props;
        this.props.handleSave(Object.assign({}, vitalsData || {}, newVitalsData));
    };

    getValue = text => {
        if (!text || !text.split) {
            return text || '';
        }

        const [value] = text.split(' ');
        return value;
    };

    render() {
        const { date, systolicBloodPressure, diastolicBloodPressure, oxygenSaturation, heartRate, bodyTemperature } =
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
                            <KailonaCloseButton onClose={() => this.toggleModal(false)} />
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
                                    disableFuture={true}
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
                                        inputRef={this.bodyTemperatureRef}
                                        type="number"
                                        id="bodyTemperature"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Body Temperature')}
                                        defaultValue={this.getValue(bodyTemperature)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>&deg;C</InputAdornment>,
                                        }}
                                    />
                                </FormControl>
                            </GridColumn>
                        </Grid>
                        <Grid container alignItems="center">
                            <GridColumn className="left-column" item>
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

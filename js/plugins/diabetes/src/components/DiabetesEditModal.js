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
import { KailonaButton, KailonaDateTimePicker, KailonaTextField, KailonaSelect, KailonaCloseButton } from '@kailona/ui';
import { getGlucoseMeter, GlucoseSystemCodes } from '../lib/GlucoseSystemCodes';

const GridColumn = withStyles({
    root: {
        '&.left-column': {
            margin: '10px 10px 10px 0',
            width: '180px',
        },
        '&.right-column': {
            margin: '10 0px 10px 10px',
            width: '180px',
        },
        '& > .MuiFormControl-root': {
            width: '100%',
        },
    },
})(Grid);

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

const styles = {
    uneditable: {
        container: {
            display: 'flex',
            alignItems: 'center',
        },
        value: {
            margin: '0 10px',
            borderBottom: '1px dashed #3F51B5',
            minWidth: '15px',
        },
        unit: {
            fontSize: '10px',
            color: '#999999',
        },
    },
};

export default class DiabetesEditModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
        };

        this.dateRef = React.createRef();
        this.glucoseValueRef = React.createRef();
        this.glucoseSystemRef = React.createRef();

        this.glucoseMeterOptions = Object.keys(GlucoseSystemCodes).map(k => ({
            value: k,
            text: getGlucoseMeter(k),
        }));
    }

    toggleModal = isOpen => {
        this.setState({
            isOpen,
        });
    };

    onConfirm = () => {
        const newDiabetes = {
            date: moment(this.dateRef.current.value),
            glucoseValue: this.glucoseValueRef.current.value,
            glucoseSystem: this.glucoseSystemRef.current.value,
        };

        const { diabetes } = this.props;
        this.props.handleSave(Object.assign({}, diabetes || {}, newDiabetes));
    };

    getValue = text => {
        if (!text || !text.split) {
            return text || '';
        }

        const [value] = text.split(' ');
        return value;
    };

    getUnit = text => {
        if (!text || !text.split) {
            return text || '';
        }

        const [, unit] = text.split(' ');
        return unit;
    };

    render() {
        const { date, glucoseValue, glucoseSystem = 'capillaryBloodByGlucometer' } = this.props.diabetes || {};

        return (
            <Dialog open={this.state.isOpen} onClose={() => this.toggleModal(false)}>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>
                            <Typography variant="h3">
                                {t('ehr', this.props.diabetes ? 'Update Diabetes Data' : 'Add Diabetes Data')}
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
                                    onChange={this.onInputDataChanged}
                                />
                            </FormControl>
                        </Grid>
                        <Grid container alignItems="center">
                            <GridColumn className="left-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.glucoseValueRef}
                                        type="number"
                                        id="glucoseValue"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Glucose Value')}
                                        defaultValue={this.getValue(glucoseValue)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment>
                                                    {this.getUnit(glucoseValue) || 'mmol/L'}
                                                </InputAdornment>
                                            ),
                                        }}
                                        onChange={this.onInputDataChanged}
                                    />
                                </FormControl>
                            </GridColumn>
                            <GridColumn className="right-column" item>
                                <FormControl>
                                    <KailonaSelect
                                        inputRef={this.glucoseSystemRef}
                                        id="glucoseMeter"
                                        className="kailona-MuiTextField"
                                        name={t('ehr', 'Glucose Meter')}
                                        defaultValue={glucoseSystem}
                                        options={this.glucoseMeterOptions}
                                        onChange={this.onInputDataChanged}
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
                        disabled={this.props.savingDiabetes}
                        onClick={() => this.toggleModal(false)}
                    />
                    <KailonaButton
                        title={t('ehr', 'Confirm')}
                        class="primary"
                        disabled={this.props.savingDiabetes}
                        onClick={this.onConfirm}
                        loading={this.props.savingDiabetes}
                    />
                </DialogActions>
            </Dialog>
        );
    }
}

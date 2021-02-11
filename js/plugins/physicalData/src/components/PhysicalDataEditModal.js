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
import { Close as CloseIcon } from '@material-ui/icons';
import { KailonaButton, KailonaDateTimePicker, KailonaTextField } from '@kailona/ui';
import { ProfileManager } from '@kailona/core';
import calculateAge from '../lib/calculateAge';
import calculateBMI from '../lib/calculateBMI';

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

export default class PhysicalDataEditModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
        };

        this.dateRef = React.createRef();
        this.ageRef = React.createRef();
        this.heightRef = React.createRef();
        this.weightRef = React.createRef();
        this.bmiRef = React.createRef();
    }

    componentDidMount() {
        const { patientDob } = ProfileManager.activeProfile;
        this.patientDob = patientDob;
    }

    toggleModal = isOpen => {
        this.setState({
            isOpen,
        });
    };

    onInputDataChanged = () => {
        const age = this.getAge();
        const bmi = this.getBMI(false);

        this.setState({
            age,
            bmi,
        });
    };

    onConfirm = () => {
        const newPhysicalData = {
            date: moment(this.dateRef.current.value),
            age: this.ageRef.current.value,
            bodyHeight: this.heightRef.current.value,
            bodyWeight: this.weightRef.current.value,
            bmi: this.bmiRef.current.value,
        };

        const { physicalData } = this.props;
        this.props.handleSave(Object.assign({}, physicalData || {}, newPhysicalData));
    };

    getValue = text => {
        if (!text || !text.split) {
            return text || '';
        }

        const [value] = text.split(' ');
        return value;
    };

    getBMI = (useStored = true) => {
        const { bmi } = this.props.physicalData || {};
        if (useStored && bmi) {
            return bmi;
        }

        const age = this.getAge();
        const weight = this.getBodyWeight(useStored);
        const height = this.getBodyHeight(useStored);

        const heightInM = height / 100;
        return calculateBMI(age, weight, heightInM);
    };

    getBodyHeight = (useStored = true) => {
        const { bodyHeight } = this.props.physicalData || {};
        if (useStored && bodyHeight) {
            return parseInt(this.getValue(bodyHeight));
        }

        return this.heightRef.current && this.heightRef.current.value;
    };

    getBodyWeight = (useStored = true) => {
        const { bodyWeight } = this.props.physicalData || {};
        if (useStored && bodyWeight) {
            return parseInt(this.getValue(bodyWeight));
        }

        return this.weightRef.current && this.weightRef.current.value;
    };

    getAge = () => {
        const { date } = this.props.physicalData || {};
        const whenDate = (this.dateRef.current && this.dateRef.current.value) || date || moment();
        return this.patientDob && calculateAge(this.patientDob, whenDate);
    };

    render() {
        const { date, bodyHeight, bodyWeight } = this.props.physicalData || {};
        const age = this.state.age || this.getAge();
        const bmi = this.state.bmi || this.getBMI();

        return (
            <Dialog open={this.state.isOpen} onClose={() => this.toggleModal(false)}>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>
                            <Typography variant="h3">
                                {t('ehr', this.props.physicalData ? 'Update Physical Data' : 'Add New Physical Data')}
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
                        <Grid container alignItems="center">
                            <GridColumn className="left-column" item style={styles.uneditable.container}>
                                <Typography variant="body2" color="primary">
                                    {t('ehr', 'Age')}
                                </Typography>
                                <Typography variant="body2" style={styles.uneditable.value}>
                                    {age}
                                </Typography>
                                <Typography style={styles.uneditable.unit}>kg</Typography>
                            </GridColumn>
                            <GridColumn className="right-column" item style={styles.uneditable.container}>
                                <Typography variant="body2" color="primary">
                                    {t('ehr', 'Body Mass Index')}
                                </Typography>
                                <Typography variant="body2" style={styles.uneditable.value}>
                                    {this.getValue(bmi) || ''}
                                </Typography>
                                <Typography style={styles.uneditable.unit}>kg/m2</Typography>
                            </GridColumn>
                        </Grid>
                        <Grid container style={{ marginTop: '20px' }}>
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
                                        inputRef={this.heightRef}
                                        type="number"
                                        id="height"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Height')}
                                        defaultValue={this.getValue(bodyHeight)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>cm</InputAdornment>,
                                        }}
                                        onChange={this.onInputDataChanged}
                                    />
                                </FormControl>
                            </GridColumn>
                            <GridColumn className="right-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.weightRef}
                                        type="number"
                                        id="weight"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Weight')}
                                        defaultValue={this.getValue(bodyWeight)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>kg</InputAdornment>,
                                        }}
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
                        disabled={this.props.savingPhysicalData}
                        onClick={() => this.toggleModal(false)}
                    />
                    <KailonaButton
                        title={t('ehr', 'Confirm')}
                        class="primary"
                        disabled={this.props.savingPhysicalData}
                        onClick={this.onConfirm}
                        loading={this.props.savingPhysicalData}
                    />
                </DialogActions>
            </Dialog>
        );
    }
}

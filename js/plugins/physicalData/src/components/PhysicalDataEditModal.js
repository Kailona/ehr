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

    toggleModal = isOpen => {
        this.setState({
            isOpen,
        });
    };

    onConfirm = () => {
        const physicalData = {
            date: moment(this.dateRef.current.value),
            age: this.ageRef.current.value,
            height: this.heightRef.current.value,
            weight: this.weightRef.current.value,
            bmi: this.bmiRef.current.value,
        };

        this.props.handleSave(physicalData);
    };

    getValue = text => {
        if (!text || !text.length) {
            return '';
        }

        const [value] = text.split(' ');
        return value;
    };

    render() {
        const { date, age, height, weight, bmi } = this.props.physicalData || {};

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
                                        inputRef={this.ageRef}
                                        id="age"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Age')}
                                        defaultValue={age}
                                        InputProps={{
                                            endAdornment: <InputAdornment>years</InputAdornment>,
                                        }}
                                    />
                                </FormControl>
                            </GridColumn>
                            <GridColumn className="right-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.heightRef}
                                        type="number"
                                        id="height"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Height')}
                                        defaultValue={this.getValue(height)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>cm</InputAdornment>,
                                        }}
                                    />
                                </FormControl>
                            </GridColumn>
                        </Grid>
                        <Grid container alignItems="center">
                            <GridColumn className="left-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.weightRef}
                                        type="number"
                                        id="weight"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Weight')}
                                        defaultValue={this.getValue(weight)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>kg</InputAdornment>,
                                        }}
                                    />
                                </FormControl>
                            </GridColumn>
                            <GridColumn className="right-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.bmiRef}
                                        type="number"
                                        id="bmi"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Body Mass Index')}
                                        defaultValue={this.getValue(bmi)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>bmi</InputAdornment>,
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

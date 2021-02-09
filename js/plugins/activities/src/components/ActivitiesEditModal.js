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

export default class ActivitiesEditModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
        };

        this.dateStartRef = React.createRef();
        this.dateEndRef = React.createRef();
        this.stepsRef = React.createRef();
        this.distanceRef = React.createRef();
        this.caloriesRef = React.createRef();
    }

    toggleModal = isOpen => {
        this.setState({
            isOpen,
        });
    };

    onConfirm = () => {
        const newActivitiesData = {
            datePeriod: {
                start: moment(this.dateStartRef.current.value),
                end: moment(this.dateEndRef.current.value),
            },
            steps: this.stepsRef.current.value,
            distance: this.distanceRef.current.value,
            calories: this.caloriesRef.current.value,
        };

        const { activitiesData } = this.props;
        this.props.handleSave(Object.assign({}, activitiesData || {}, newActivitiesData));
    };

    getValue = text => {
        if (!text || !text.split) {
            return text || '';
        }

        const [value] = text.split(' ');
        return value;
    };

    render() {
        const { datePeriod, steps, distance, calories } = this.props.activitiesData || {};
        const { start: dateStart, end: dateEnd } = datePeriod || {};

        return (
            <Dialog open={this.state.isOpen} onClose={() => this.toggleModal(false)}>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>
                            <Typography variant="h3">
                                {t('ehr', this.props.activitiesData ? 'Update Activity' : 'Add New Activity')}
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
                            <GridColumn item className="left-column">
                                <FormControl>
                                    <KailonaDateTimePicker
                                        inputRef={this.dateStartRef}
                                        id="dateStart"
                                        ariaLabel={t('ehr', 'Start Date/Time')}
                                        defaultValue={dateStart ? moment(dateStart) : null}
                                        disableFuture={true}
                                    />
                                </FormControl>
                            </GridColumn>
                            <GridColumn item className="right-column">
                                <FormControl>
                                    <KailonaDateTimePicker
                                        inputRef={this.dateEndRef}
                                        id="dateEnd"
                                        ariaLabel={t('ehr', 'End Date/Time')}
                                        defaultValue={dateEnd ? moment(dateEnd) : null}
                                        disableFuture={true}
                                    />
                                </FormControl>
                            </GridColumn>
                        </Grid>
                        <Grid container alignItems="center">
                            <GridColumn className="left-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.stepsRef}
                                        id="steps"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Steps')}
                                        defaultValue={this.getValue(steps)}
                                    />
                                </FormControl>
                            </GridColumn>
                            <GridColumn className="right-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.distanceRef}
                                        type="number"
                                        id="distance"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Distance')}
                                        defaultValue={this.getValue(distance)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>m</InputAdornment>,
                                        }}
                                    />
                                </FormControl>
                            </GridColumn>
                        </Grid>
                        <Grid container alignItems="center">
                            <GridColumn className="left-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.caloriesRef}
                                        type="number"
                                        id="calories"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Calories')}
                                        defaultValue={this.getValue(calories)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>cal</InputAdornment>,
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
                        disabled={this.props.savingActivities}
                        onClick={() => this.toggleModal(false)}
                    />
                    <KailonaButton
                        title={t('ehr', 'Confirm')}
                        class="primary"
                        disabled={this.props.savingActivities}
                        onClick={this.onConfirm}
                        loading={this.props.savingActivities}
                    />
                </DialogActions>
            </Dialog>
        );
    }
}

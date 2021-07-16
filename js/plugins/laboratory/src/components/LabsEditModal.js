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

export default class LabsEditModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
        };

        this.dateRef = React.createRef();
        this.leukocytesRef = React.createRef();
        this.hemoglobinRef = React.createRef();
        this.plateletsRef = React.createRef();
    }

    toggleModal = isOpen => {
        this.setState({
            isOpen,
        });
    };

    onConfirm = () => {
        const newLabsData = {
            date: moment(this.dateRef.current.value),
            leukocytes: this.leukocytesRef.current.value,
            hemoglobin: this.hemoglobinRef.current.value,
            platelets: this.plateletsRef.current.value,
        };

        const { labsData } = this.props;
        this.props.handleSave(Object.assign({}, labsData || {}, newLabsData));
    };

    getValue = text => {
        if (!text || !text.split) {
            return text || '';
        }

        const [value] = text.split(' ');
        return value;
    };

    render() {
        const { date, leukocytes, hemoglobin, platelets } = this.props.labsData || {};

        return (
            <Dialog open={this.state.isOpen} onClose={() => this.toggleModal(false)}>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>
                            <Typography variant="h3">
                                {t('ehr', this.props.labsData ? 'Update Labs' : 'Add New Lab Results')}
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
                                    disableFuture={true}
                                />
                            </FormControl>
                        </Grid>
                        <Grid container alignItems="center">
                            <GridColumn className="left-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.leukocytesRef}
                                        id="leukocytes"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Leukocytes')}
                                        defaultValue={this.getValue(leukocytes)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>10*9/L</InputAdornment>,
                                        }}
                                    />
                                </FormControl>
                            </GridColumn>
                            <GridColumn className="right-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.hemoglobinRef}
                                        type="number"
                                        id="hemoglobin"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Hemoglobin')}
                                        defaultValue={this.getValue(hemoglobin)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>g/dL</InputAdornment>,
                                        }}
                                    />
                                </FormControl>
                            </GridColumn>
                        </Grid>
                        <Grid container alignItems="center">
                            <GridColumn className="left-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.plateletsRef}
                                        type="number"
                                        id="platelets"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Platelets')}
                                        defaultValue={this.getValue(platelets)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>mg/dL</InputAdornment>,
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
                        disabled={this.props.savingLabs}
                        onClick={() => this.toggleModal(false)}
                    />
                    <KailonaButton
                        title={t('ehr', 'Confirm')}
                        class="primary"
                        disabled={this.props.savingLabs}
                        onClick={this.onConfirm}
                        loading={this.props.savingLabs}
                    />
                </DialogActions>
            </Dialog>
        );
    }
}

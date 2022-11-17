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
            color: 'grey',
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
        this.lymphocytesRef = React.createRef();
        this.neutrophilsRef = React.createRef();
        this.eosinophilsRef = React.createRef();
        this.basophilsRef = React.createRef();
        this.monocytesRef = React.createRef();
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
            lymphocytes: this.lymphocytesRef.current.value,
            neutrophils: this.neutrophilsRef.current.value,
            eosinophils: this.eosinophilsRef.current.value,
            basophils: this.basophilsRef.current.value,
            monocytes: this.monocytesRef.current.value,
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
        const { date, leukocytes, hemoglobin, platelets, lymphocytes, neutrophils, eosinophils, basophils, monocytes } =
            this.props.labsData || {};

        return (
            <Dialog open={this.state.isOpen} onClose={() => this.toggleModal(false)}>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>
                            <Typography variant="h3">
                                {t('ehr', this.props.labsData ? 'Update Lab Results' : 'Add Lab Results')}
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
                                        inputRef={this.leukocytesRef}
                                        id="leukocytes"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Leukocytes')}
                                        defaultValue={this.getValue(leukocytes)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>10&#94;3/&micro;l</InputAdornment>,
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
                                            endAdornment: <InputAdornment>10&#94;3/&micro;l</InputAdornment>,
                                        }}
                                    />
                                </FormControl>
                            </GridColumn>
                            <GridColumn className="right-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.lymphocytesRef}
                                        type="number"
                                        id="lymphocytes"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Lymphocytes')}
                                        defaultValue={this.getValue(lymphocytes)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>10&#94;3/&micro;l</InputAdornment>,
                                        }}
                                    />
                                </FormControl>
                            </GridColumn>
                        </Grid>
                        <Grid container alignItems="center">
                            <GridColumn className="left-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.neutrophilsRef}
                                        type="number"
                                        id="neutrophils"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Neutrophils')}
                                        defaultValue={this.getValue(neutrophils)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>10&#94;3/&micro;l</InputAdornment>,
                                        }}
                                    />
                                </FormControl>
                            </GridColumn>
                            <GridColumn className="right-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.eosinophilsRef}
                                        type="number"
                                        id="eosinophils"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Eosinophils')}
                                        defaultValue={this.getValue(eosinophils)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>10&#94;3/&micro;l</InputAdornment>,
                                        }}
                                    />
                                </FormControl>
                            </GridColumn>
                        </Grid>
                        <Grid container alignItems="center">
                            <GridColumn className="left-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.basophilsRef}
                                        type="number"
                                        id="basophils"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Basophils')}
                                        defaultValue={this.getValue(basophils)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>10&#94;3/&micro;l</InputAdornment>,
                                        }}
                                    />
                                </FormControl>
                            </GridColumn>
                            <GridColumn className="right-column" item>
                                <FormControl>
                                    <KailonaTextField
                                        inputRef={this.monocytesRef}
                                        type="number"
                                        id="Monocytes"
                                        className="kailona-MuiTextField"
                                        label={t('ehr', 'Monocytes')}
                                        defaultValue={this.getValue(monocytes)}
                                        InputProps={{
                                            endAdornment: <InputAdornment>10&#94;3/&micro;l</InputAdornment>,
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

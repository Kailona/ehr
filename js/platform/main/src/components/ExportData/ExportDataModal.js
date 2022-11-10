import React from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent as MuiDialogContent,
    Grid,
    withStyles,
} from '@material-ui/core';
import { KailonaTextField, KailonaButton, KailonaCloseButton } from '@kailona/ui';
import './ExportDataModal.styl';

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

class ExportDataModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
        };
    }

    render() {
        return (
            <Dialog fullWidth={true} open={this.props.isOpen}>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>{t('ehr', 'Export Data')}</Box>
                        <Box>
                            <KailonaCloseButton onClose={this.props.onClose} />
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Grid container direction="column">
                        <Grid item xs={6}>
                            <KailonaTextField
                                inputRef={this.toEmailRef}
                                id="providerEmail"
                                type="text"
                                label={t('ehr', 'Email')}
                                style={{ width: '100%' }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <KailonaButton
                        class="default"
                        title={t('ehr', 'Cancel')}
                        onClick={this.props.onClose}
                        disabled={this.state.loading}
                    />
                    <KailonaButton
                        class="primary"
                        title={t('ehr', 'Send Request')}
                        onClick={this.sendRequest}
                        loading={this.state.loading}
                        disabled={this.state.loading}
                    />
                </DialogActions>
            </Dialog>
        );
    }
}

export default ExportDataModal;

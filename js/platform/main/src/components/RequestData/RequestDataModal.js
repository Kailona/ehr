import React from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent as MuiDialogContent,
    IconButton,
    TextareaAutosize,
    Grid,
    Typography,
    withStyles,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { ProfileManager, MailService, Logger } from '@kailona/core';
import { KailonaTextField, KailonaButton } from '@kailona/ui';
import { withNotification } from '../../context/NotificationContext';

const logger = new Logger('main.RequestDataModal');

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

class RequestDataModal extends React.Component {
    constructor(props) {
        super(props);

        this.mailService = new MailService();

        this.toEmailRef = React.createRef();
        this.emailBodyRef = React.createRef();

        this.defaultEmailBody = t(
            'ehr',
            'I hereby request all data from my last exam to be uploaded to my personal ' +
                'health data archive on the Kailona platform. Please comply within the 30 day period as ' +
                'required by the Berufsordnung der Ärztekammern, §630g Abs. 2  BGB and Art. 15  Abs. 3 DSGVO.'
        );

        this.state = {
            loading: false,
        };
    }

    sendRequest = async () => {
        try {
            this.setState({
                loading: true,
            });
            const to = this.toEmailRef.current.value;
            if (!to) {
                // Warn user missing email
                return this.props.showNotification({
                    severity: 'error',
                    message: t(
                        'ehr',
                        'Unable to send health data request. Please set your email address in user profile settings!'
                    ),
                });
            }

            const patientId = ProfileManager.activePatientId;
            const { patientFullName: fromName } = ProfileManager.activeProfile;
            const body = this.emailBodyRef.current.value || this.defaultEmailBody;

            await this.mailService.sendRequestData(patientId, fromName, to, body);

            this.props.onClose();

            this.props.showNotification({
                severity: 'success',
                message: t('ehr', 'Health data request was successfully sent'),
            });
        } catch (error) {
            logger.error(error);

            this.props.showNotification({
                severity: 'error',
                message: t('ehr', 'Unable to send health data request. Please contact your administrator!'),
            });
        } finally {
            this.setState({
                loading: false,
            });
        }
    };

    render() {
        return (
            <Dialog fullWidth={true} open={this.props.isOpen}>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>{t('ehr', 'Request Data')}</Box>
                        <Box>
                            <IconButton onClick={this.props.onClose}>
                                <CloseIcon />
                            </IconButton>
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
                        <Grid item xs={12} style={{ marginTop: '20px' }}>
                            <Grid container direction="column">
                                <Grid item>
                                    <Typography variant="body2">{t('ehr', 'Message to Provider:')}</Typography>
                                </Grid>
                                <Grid item>
                                    <TextareaAutosize
                                        ref={this.emailBodyRef}
                                        rowsMin={5}
                                        defaultValue={this.defaultEmailBody}
                                        style={{ width: '100%', resize: 'vertical' }}
                                    />
                                </Grid>
                            </Grid>
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

export default withNotification(RequestDataModal);

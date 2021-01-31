import React from 'react';
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { ProfileManager, MailService, Logger } from '@kailona/core';
import { withNotification } from '../../context/NotificationContext';

import './RequestDataModal.styl';

const logger = new Logger('RequestDataModal');

class RequestDataModal extends React.Component {
    constructor(props) {
        super(props);

        this.mailService = new MailService();

        this.toEmailRef = React.createRef();
        this.emailBodyRef = React.createRef();

        this.defaultEmailBody = t('ehr', 'I hereby request my health data.');
    }

    sendRequest = async () => {
        try {
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

            const { patientFullName: fromName } = ProfileManager.activeProfile;
            const body = this.emailBodyRef.current.value || this.defaultEmailBody;

            await this.mailService.sendRequestData(fromName, to, body);

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
                    <div className="requestData">
                        <input
                            ref={this.toEmailRef}
                            type="text"
                            id="providerEmail"
                            placeholder="Enter Provider Email"
                        />
                        <div className="messageContainer">
                            <span>Message to Provider:</span>
                            <div className="messageToProvider">
                                <div className="message">
                                    <textarea ref={this.emailBodyRef} placeholder={this.defaultEmailBody} />
                                </div>
                            </div>
                        </div>
                        <button type="button" onClick={this.sendRequest} className="sendRequest actionBtn">
                            Send Request
                        </button>
                        <button type="button" className="cancelRequest actionBtn">
                            Cancel
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
}

export default withNotification(RequestDataModal);

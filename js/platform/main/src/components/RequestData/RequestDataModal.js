import React from 'react';
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import './RequestDataModal.styl';

export default class RequestDataModal extends React.Component {
    constructor(props) {
        super(props);

        this.sendRequest = this.sendRequest.bind(this);
    }

    sendRequest() {
        console.log(' EMAIL WILL BE SENT ...');
    }

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
                        <input type="text" id="providerEmail" placeholder="Enter Provider Email" />
                        <div className="messageContainer">
                            <span>Message to Provider:</span>
                            <div className="messageToProvider">
                                <div className="message">
                                    <textarea placeholder="Message..."></textarea>
                                </div>
                                <div className="messageActions">
                                    <div className="useDefault">
                                        <a>Use Default</a>
                                    </div>
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

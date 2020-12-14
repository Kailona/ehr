import React, { Component } from 'react';
import { DashboardWidget } from '@kailona/ui';
import { Box } from '@material-ui/core';
import RequestDataModal from './RequestDataModal';

export default class RequestDataWidget extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isRequestDataModalOpen: false,
        };
    }

    openRequestDataModal = () => {
        this.setState({
            isRequestDataModalOpen: true,
        });
    };

    closeRequestDataModal = () => {
        this.setState({
            isRequestDataModalOpen: false,
        });
    };

    render() {
        return (
            <>
                <RequestDataModal isOpen={this.state.isRequestDataModalOpen} onClose={this.closeRequestDataModal} />
                <Box>
                    <DashboardWidget
                        onClick={this.openRequestDataModal}
                        icon="ArchiveOutlined"
                        name={t('ehr', 'Request Data from Provider')}
                    />
                </Box>
            </>
        );
    }
}

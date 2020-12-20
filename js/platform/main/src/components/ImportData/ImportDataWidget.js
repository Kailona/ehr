import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import { DashboardWidget } from '@kailona/ui';
import ImportDataModal from './ImportDataModal';

export default class ImportDataWidget extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isImportDataModalOpen: false,
        };
    }

    openImportDataModal = () => {
        this.setState({
            isImportDataModalOpen: true,
        });
    };

    closeImportDataModal = () => {
        this.setState({
            isImportDataModalOpen: false,
        });
    };

    render() {
        return (
            <>
                <ImportDataModal isOpen={this.state.isImportDataModalOpen} onClose={this.closeImportDataModal} />
                <Box>
                    <DashboardWidget
                        onClick={this.openImportDataModal}
                        icon="CloudUploadOutlined"
                        name={t('ehr', 'Import Data')}
                    />
                </Box>
            </>
        );
    }
}

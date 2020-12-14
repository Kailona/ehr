import React, { Component } from 'react';
import { DashboardWidget } from '@kailona/ui';
import { Box } from '@material-ui/core';

export default class RequestDataWidget extends Component {
    onWidgetClick = () => {
        // TODO: Request Data Workflow
    };

    render() {
        return (
            <Box>
                <DashboardWidget
                    onClick={this.onWidgetClick}
                    icon="ArchiveOutlined"
                    name={t('ehr', 'Request Data from Provider')}
                />
            </Box>
        );
    }
}

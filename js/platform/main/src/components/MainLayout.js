import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import ProfileHeader from './ProfileHeader/ProfileHeader';
import { withNotification } from '../context/NotificationContext';

class MainLayout extends Component {
    componentDidMount() {
        const { error, showNotification } = this.props;

        if (error) {
            showNotification({
                severity: 'error',
                message: error,
            });
        }
    }

    render() {
        const { children, firstTime } = this.props;

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <ProfileHeader firstTime={firstTime} />
                <Box mt={2} p={2} style={{ flex: 1 }}>
                    {children}
                </Box>
            </div>
        );
    }
}

export default withNotification(MainLayout);

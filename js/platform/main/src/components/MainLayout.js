import React, { Component } from 'react';
import { Box, withStyles } from '@material-ui/core';
import ProfileHeader from './ProfileHeader/ProfileHeader';

export default class MainLayout extends Component {
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

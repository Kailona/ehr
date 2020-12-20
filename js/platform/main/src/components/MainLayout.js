import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import ProfileHeader from './ProfileHeader';

export default class MainLayout extends Component {
    render() {
        const { children } = this.props;

        return (
            <div style={{ padding: '15px' }}>
                <ProfileHeader />
                <Box mt={2}>{children}</Box>
            </div>
        );
    }
}

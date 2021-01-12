import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import ProfileHeader from './ProfileHeader';

export default class MainLayout extends Component {
    render() {
        const { children } = this.props;

        return (
            <div>
                <ProfileHeader />
                <Box mt={2} p={2}>
                    {children}
                </Box>
            </div>
        );
    }
}

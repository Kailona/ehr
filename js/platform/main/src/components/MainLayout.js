import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import ProfileHeader from './ProfileHeader/ProfileHeader';

export default class MainLayout extends Component {
    render() {
        const { children, firstTime } = this.props;

        return (
            <div>
                <ProfileHeader firstTime={firstTime} />
                <Box mt={2} p={2}>
                    {children}
                </Box>
            </div>
        );
    }
}

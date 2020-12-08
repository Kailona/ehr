import React, { Component } from 'react';
import ProfileHeader from './ProfileHeader';

export default class MainLayout extends Component {
    render() {
        const { children } = this.props;

        return (
            <>
                <ProfileHeader />
                {children}
            </>
        );
    }
}

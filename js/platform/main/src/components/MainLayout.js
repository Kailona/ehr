import React, { Component } from 'react';
import ProfileHeader from './ProfileHeader';

export default class MainLayout extends Component {
    render() {
        const { children } = this.props;

        return (
            <div style={{ padding: '15px' }}>
                <ProfileHeader />
                {children}
            </div>
        );
    }
}

import React, { Component } from 'react';
import { styled } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import IconButton from '@material-ui/core/IconButton';
import { Add } from '@material-ui/icons';
import HeaderTab from './HeaderTab';

import './ProfileHeader.styl';

const StyledTabs = styled(Tabs)({
    backgroundColor: '#fff',
    height: '44px',
});

export default class ProfileHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [
                {
                    id: 1,
                    name: 'Susana',
                    active: true,
                },
                {
                    id: 2,
                    name: 'Caetano',
                },
                {
                    id: 3,
                    name: 'Bebel',
                },
                {
                    id: 4,
                    name: 'Erykah',
                },
            ],
            selectedTab: 1,
        };
    }

    handleClick = newValue => {
        this.setState({
            selectedTab: newValue,
        });
    };

    render() {
        const { selectedTab } = this.state;
        return (
            <StyledTabs
                value={selectedTab}
                aria-label="profile tabs"
                TabIndicatorProps={{ style: { background: 'none' } }}
            >
                {this.state.users.map((user, index) => (
                    <HeaderTab
                        key={index}
                        label={user.name}
                        id={user.id}
                        value={user.id}
                        handleClick={this.handleClick}
                        active={selectedTab === user.id}
                    />
                ))}
                <div className="header-tab add-user" style={{ opacity: 1, fontWeight: 'bold' }}>
                    <IconButton disableRipple={true}>
                        <Add />
                    </IconButton>
                </div>
            </StyledTabs>
        );
    }
}

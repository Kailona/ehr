import React, { Component } from 'react';
import { styled, withTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import HeaderTab from './HeaderTab';

const StyledTabs = styled(withTheme(Tabs))(props => ({
    backgroundColor: props.theme.palette.whiteSmoke.main,
    padding: '0 15px',
    minHeight: '38px !important',
}));

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
            </StyledTabs>
        );
    }
}

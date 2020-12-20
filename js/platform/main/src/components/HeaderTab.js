import React, { Component } from 'react';
import { styled } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Avatar from '@material-ui/core/Avatar';
import { SentimentSatisfiedAlt } from '@material-ui/icons';
import ProfileMenu from './ProfileMenu';

const StyledTab = styled(Tab)({
    color: '#000',
    minWidth: 'auto',
    minHeight: '34px',
    padding: '0 6px',
});

const TabAvatar = styled(Avatar)({
    cursor: 'pointer',
    width: '24px',
    height: '24px',
});

export default class HeaderTab extends Component {
    render() {
        return (
            <div className={`header-tab ${this.props.active ? 'active' : ''}`}>
                <TabAvatar onClick={() => this.props.handleClick(this.props.value)}>
                    <SentimentSatisfiedAlt />
                </TabAvatar>
                <StyledTab
                    label={this.props.label}
                    id={this.props.id}
                    value={this.props.value}
                    disableRipple={true}
                    onClick={() => this.props.handleClick(this.props.value)}
                />
                <ProfileMenu />
            </div>
        );
    }
}

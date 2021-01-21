import React, { Component } from 'react';
import { styled, withTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import ProfileMenu from './ProfileMenu';

const StyledTab = styled(withTheme(Tab))(props => ({
    color: props.theme.palette.gray80.main,
    minWidth: 'auto',
}));

const styles = theme => ({
    headerTab: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '0 10px',
        padding: '0 10px',
        height: '40px',
        '&.active': {
            paddingRight: 0,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            '&  span': {
                color: `${theme.palette.primary.main}`,
            },
            '& > .profile-menu': {
                display: 'flex',
                marginLeft: '12px',
            },
        },
        '& > .profile-menu': {
            display: 'none',
        },
        '& button': {
            minHeight: '40px important',
            margin: 0,
            padding: 0,
            '&:active': {
                backgroundColor: 'transparent !important',
            },
        },
    },
    label: {
        textTransform: 'none',
    },
});

class HeaderTab extends Component {
    render() {
        const { classes, refreshUsers } = this.props;

        return (
            <div className={`${classes.headerTab} ${this.props.active ? 'active' : ''}`}>
                <StyledTab
                    label={this.props.label}
                    className={classes.label}
                    id={this.props.id}
                    value={this.props.value}
                    disableRipple={true}
                    onClick={() => this.props.handleClick(this.props.value)}
                />
                <ProfileMenu refreshUsers={refreshUsers} />
            </div>
        );
    }
}

export default withStyles(styles)(HeaderTab);

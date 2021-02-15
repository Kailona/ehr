import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { styled, withTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import { ProfileManager } from '@kailona/core';
import HeaderTab from './HeaderTab';
import { Box, IconButton } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { withModal } from '../../context/ModalContext';
import { withMain } from '../../context/MainContext';

const StyledTabs = styled(withTheme(Tabs))(props => ({
    backgroundColor: props.theme.palette.whiteSmoke.main,
    padding: '0 15px',
    height: '40px !important',
    '& .MuiTabs-flexContainer': {
        alignItems: 'flex-end',
    },
}));

class ProfileHeader extends Component {
    constructor(props) {
        super(props);

        const users = this.getUsers();
        this.state = {
            users,
            selectedTab: ProfileManager.activePatientId || 0,
        };

        this.props.setUserId(ProfileManager.activePatientId);
    }

    componentDidMount() {
        if (this.props.firstTime) {
            // Show profile update modal to let user update patient information first time
            this.props.toggleProfileEditModal(true, {
                profile: ProfileManager.activeProfile,
                firstTime: true,
                onUpdate: this.refreshUsers,
            });

            this.props.setUserId(ProfileManager.activeProfile);
        }
    }

    getUsers = () => {
        return ProfileManager.profiles.map(profile => ({
            id: profile.patientId,
            name: profile.patientFullName,
            active: profile.patientId === ProfileManager.activePatientId,
        }));
    };

    handleClick = newValue => {
        ProfileManager.activePatientId = newValue;
        this.props.setUserId(newValue);

        this.setState({
            selectedTab: newValue,
        });

        this.props.history.push('/');
    };

    refreshUsers = () => {
        const users = this.getUsers();
        this.setState({
            users,
            selectedTab: ProfileManager.activePatientId,
        });
    };

    handleNewClick = () => {
        this.props.toggleProfileEditModal(true, { onUpdate: this.refreshUsers });
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
                        refreshUsers={this.refreshUsers}
                    />
                ))}
                <Box>
                    <IconButton onClick={this.handleNewClick}>
                        <AddIcon />
                    </IconButton>
                </Box>
            </StyledTabs>
        );
    }
}

export default withRouter(withMain(withModal(ProfileHeader)));

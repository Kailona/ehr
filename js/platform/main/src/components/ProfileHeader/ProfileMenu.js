import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Box, Menu, MenuItem as MuiMenuItem, IconButton, Divider } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { styled } from '@material-ui/core/styles';
import { ModuleTypeEnum, PluginManager, getIcon, ProfileManager, ProviderManager } from '@kailona/core';
import { withModal } from '../../context/ModalContext';

const DropdownIcon = styled(IconButton)({
    padding: 0,
    borderRadius: 0,
    paddingLeft: '5px',
    '&:hover, &:focus': {
        backgroundColor: 'transparent',
        borderColor: '#c8c8c8 !important',
    },
});

const MenuItem = styled(MuiMenuItem)({
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '& > .menuItemIcon': {
        marginRight: '15px',
        width: '21px',
        height: '21px',
        cursor: 'pointer',

        '& > svg': {
            width: '21px',
            height: '21px',
        },
    },
    '& > .menuItemLabel': {
        cursor: 'pointer',
    },
});

class ProfileMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
        };
    }

    getMenuItems = () => {
        const menuItems = [];

        // Get menu modules from plugins
        PluginManager.plugins.forEach(plugin => {
            const { path, modules } = plugin;
            const menuModule = modules[ModuleTypeEnum.MenuModule];
            if (!menuModule) {
                return;
            }
            menuItems.push({
                path,
                ...menuModule,
            });
        });

        // Sort by priority (high priority comes first)
        menuItems.sort((mi1, mi2) => (mi1.priority < mi2.priority ? 1 : -1));

        return menuItems.map((menuItem, index) => {
            const menuItemIcon = getIcon(menuItem.icon);

            return (
                <MenuItem key={index} className="menuItem" onClick={() => this.onMenuItemClick(menuItem.path)}>
                    <span className="menuItemIcon">{menuItemIcon}</span>
                    <span className="menuItemLabel">{menuItem.name}</span>
                </MenuItem>
            );
        });
    };

    getProviderItem = () => {
        const providersEnabled = ProviderManager.providersEnabled();
        if (!providersEnabled) {
            return null;
        }

        const providerMainPage = {
            name: t('ehr', 'Providers'),
        };

        return (
            <MenuItem className="menuItem" onClick={() => this.onProvidersMenuItemClick()}>
                <span className="menuItemLabel">{providerMainPage.name}</span>
            </MenuItem>
        );
    };

    onMenuItemClick = path => {
        this.handleClose();

        if (path) {
            this.props.history.push(path);
        }
    };

    onImportDataMenuItemClick = () => {
        this.handleClose();

        this.props.toggleImportDataModal(true);
    };

    onProvidersMenuItemClick = () => {
        this.handleClose();

        this.props.toggleProvidersModal(true);
    };

    onPatientProfileMenuItemClick = () => {
        this.handleClose();

        const activePatientId = ProfileManager.activePatientId;
        const profile = ProfileManager.profiles.find(p => p.patientId === activePatientId);
        this.props.toggleProfileEditModal(true, { profile, onUpdate: this.props.refreshUsers });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleClick = () => {
        this.setState({ anchorEl: event.target });
    };

    render() {
        const menuItems = this.getMenuItems();
        const providerItem = this.getProviderItem();
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <div className="profile-menu">
                <DropdownIcon
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    disableRipple={true}
                    size="small"
                >
                    <ArrowDropDown />
                </DropdownIcon>
                <Menu
                    id="menu-items"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={this.handleClose}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    style={{ marginTop: '9px' }}
                >
                    {menuItems}
                    <Box m={1}>
                        <Divider />
                    </Box>
                    {providerItem}
                    <MenuItem className="menuItem" onClick={this.onImportDataMenuItemClick}>
                        <span className="menuItemIcon">{getIcon('CloudUploadOutlined')}</span>
                        <span className="menuItemLabel">{t('ehr', 'Import Data')}</span>
                    </MenuItem>
                    <MenuItem className="menuItem" onClick={this.onPatientProfileMenuItemClick}>
                        <span className="menuItemIcon">{getIcon('PersonOutline')}</span>
                        <span className="menuItemLabel">{t('ehr', 'Patient Profile')}</span>
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

export default withRouter(withModal(ProfileMenu));

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Menu, MenuItem as MuiMenuItem, IconButton } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { styled } from '@material-ui/core/styles';
import { ModuleTypeEnum, PluginManager, getIcon } from '@kailona/core';

const DropdownIcon = styled(IconButton)({
    padding: 0,
    borderLeft: '1px solid #000',
    borderRadius: 0,
    marginLeft: '10px',
    paddingLeft: '5px',
    '&:hover, &:focus': {
        backgroundColor: 'transparent',
        borderColor: '#000 !important',
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

    onMenuItemClick = path => {
        this.handleClose();
        this.props.history.push(path);
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleClick = () => {
        this.setState({ anchorEl: event.target });
    };

    render() {
        const menuItems = this.getMenuItems();
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
                </Menu>
            </div>
        );
    }
}

export default withRouter(ProfileMenu);

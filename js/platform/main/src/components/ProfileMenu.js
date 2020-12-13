import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import { MenuItem as MuiMenuItem } from '@material-ui/core';
import {
    ArrowDropDown,
    FolderShared,
    Grain,
    AssignmentTurnedIn,
    EnhancedEncryption,
    Cached,
    DirectionsRun,
    CallMerge,
    Layers,
    VerifiedUser,
    FavoriteBorder,
    List,
    Restaurant,
    Archive,
    CloudUpload,
    PermIdentity,
} from '@material-ui/icons';
import { styled } from '@material-ui/core/styles';

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
    '& > .menuItemIcon': {
        marginRight: '15px',
        width: '21px',
        height: '21px',

        '& > svg': {
            width: '21px',
            height: '21px',
        },
    },
});

export default class ProfileMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
        };

        this.options = [
            {
                label: 'Physical Data',
                icon: <FolderShared />,
            },
            {
                label: 'Allergies',
                icon: <Grain />,
            },
            {
                label: 'Blood Results',
                icon: <AssignmentTurnedIn />,
            },
            {
                label: 'Conditions',
                icon: <EnhancedEncryption />,
            },
            {
                label: 'Cycle',
                icon: <Cached />,
            },
            {
                label: 'Exercise',
                icon: <DirectionsRun />,
            },
            {
                label: 'Genomics',
                icon: <CallMerge />,
            },
            {
                label: 'Imaging',
                icon: <Layers />,
            },
            {
                label: 'Immunizations',
                icon: <VerifiedUser />,
            },
            {
                label: 'Medications',
                icon: <List />,
            },
            {
                label: 'Nutrition',
                icon: <Restaurant />,
            },
            {
                label: 'Vitals',
                icon: <FavoriteBorder />,
            },
            {
                label: 'Data Requests',
                icon: <Archive />,
            },
            {
                label: 'Import Data',
                icon: <CloudUpload />,
            },
            {
                label: 'Patient Profile',
                icon: <PermIdentity />,
            },
        ];

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.setState({ anchorEl: null });
    }

    handleClick() {
        this.setState({ anchorEl: event.target });
    }

    render() {
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
                    {this.options.map(option => (
                        <MenuItem onClick={this.handleClose} className="menuItem">
                            <span className="menuItemIcon">{option.icon}</span>
                            <span className="menuItemLabel">{option.label}</span>
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        );
    }
}

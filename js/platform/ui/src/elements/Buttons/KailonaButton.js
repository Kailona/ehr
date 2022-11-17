import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { styled, withStyles, withTheme } from '@material-ui/core/styles';
import { CircularProgress, IconButton as MuiIconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

const styles = theme => ({
    'kailona-button': {
        height: '40px',
        borderRadius: '4px',
        color: theme.palette.primary.main,
        backgroundColor: '#fff !important',
        border: '1px solid #9FA8DA !important',
        textAlign: 'center',
        fontFamily: 'Nunito Sans',
        fontStyle: 'normal',
        fontWeight: '800',
        fontSize: '15px',
        letterSpacing: '0.25px',
        textTransform: 'none',

        '&.disabled, &:disabled': {
            backgroundColor: '#fff !important',
            borderColor: `${theme.palette.gray30.main} !important`,
            color: `${theme.palette.gray30.main} !important`,
            pointerEvents: 'none',
        },
        '&.default': {
            color: theme.palette.gray60.main,
            backgroundColor: '#fff !important',
            border: `1px solid ${theme.palette.gray60.main} !important`,
            '&:hover': {
                backgroundColor: `${theme.palette.whiteSmoke.main} !important`,
            },
        },
        '&.primary': {
            color: `${theme.palette.primary.main} !important`,
            backgroundColor: '#fff !important',
            border: '1px solid #9FA8DA !important',

            '&:hover': {
                backgroundColor: '#E5E9FF !important',
                color: `${theme.palette.primary.main} !important`,
                borderColor: '#9FA8DA !important',
            },
            '&:active': {
                backgroundColor: `theme.palette.primary.light !important`,
                color: `${theme.palette.primary.main} !important`,
                border: `1px solid ${theme.palette.primary.main}`,
            },
        },
        '&.error': {
            backgroundColor: theme.palette.error.main,
            color: `${theme.palette.white.main} !important`,
            border: `1px solid ${theme.palette.error.main}`,

            '&:hover': {
                backgroundColor: `${theme.palette.error.dark} !important`,
                color: `${theme.palette.white.main} !important`,
                borderColor: `${theme.palette.error.dark} !important`,
            },
        },
    },
});

class KailonaButton extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Button
                className={`${classes['kailona-button']} ${this.props.class}`}
                variant={this.props.variant}
                color={this.props.color}
                style={this.props.style}
                onClick={this.props.onClick}
                disableRipple={true}
                disabled={this.props.disabled}
            >
                {this.props.title}
                {this.props.loading && <CircularProgress color="primary" size={20} style={{ marginLeft: '12px' }} />}
            </Button>
        );
    }
}

const IconButton = styled(withTheme(MuiIconButton))(props => ({
    backgroundColor: 'transparent !important',
    border: 'none !important',
}));

class KailonaCloseButton extends Component {
    render() {
        const { classes } = this.props;
        return (
            <IconButton
                onClick={this.props.onClose}
                disableRipple={true}
                style={{ paddingRight: '0', marginRight: '0' }}
            >
                <CloseIcon />
            </IconButton>
        );
    }
}

export default withStyles(styles)(KailonaButton);

export { KailonaCloseButton };

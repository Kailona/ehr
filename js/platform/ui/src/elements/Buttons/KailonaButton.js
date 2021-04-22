import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

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
            color: theme.palette.primary.main,
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

export default withStyles(styles)(KailonaButton);

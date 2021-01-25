import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    'kailona-button': {
        height: '40px',
        borderRadius: '4px',
        border: '1px solid #9FA8DA',
        backgroundColor: '#fff',
        textAlign: 'center',
        fontFamily: 'Nunito Sans',
        fontStyle: 'normal',
        fontWeight: '800',
        fontSize: '15px',
        letterSpacing: '0.25px',
        textTransform: 'none',
        color: theme.palette.primary.main,

        '&:hover': {
            backgroundColor: '#E5E9FF !important',
            color: `${theme.palette.primary.main} !important`,
            borderColor: '#9FA8DA !important',
        },
        '&:active': {
            backgroundColor: theme.palette.primary.light,
            color: `${theme.palette.primary.main} !important`,
            border: `1px solid ${theme.palette.primary.main}`,
        },
        '&.disabled': {
            backgroundColor: '#fff',
            borderColor: theme.palette.gray30.main,
            color: theme.palette.gray30.main,
            pointerEvents: 'none',
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
            </Button>
        );
    }
}

export default withStyles(styles)(KailonaButton);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Card as MuiCard,
    CardContent as MuiCardContent,
    Typography as MuiTypography,
    withStyles,
} from '@material-ui/core';
import { getIcon } from '@kailona/core';

const styles = theme => ({
    widget: {
        width: '110px',
        padding: '5px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const Card = withStyles({
    root: {
        width: '100px',
        height: '100px',
    },
})(props => <MuiCard {...props} />);

const CardContent = withStyles(theme => ({
    root: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.whiteSmoke.main,
        cursor: 'pointer !important',
    },
}))(props => <MuiCardContent {...props} />);

const Typography = withStyles(theme => ({
    root: {
        width: '100%',
        wordBreak: 'break-word',
        textAlign: 'center',
        padding: '10px 5px 5px !important',
        cursor: 'pointer !important',
    },
}))(props => <MuiCardContent {...props} />);

class DashboardWidget extends Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        name: PropTypes.string,
        children: PropTypes.object,
    };

    render() {
        const { icon, name, children } = this.props;
        const widgetIcon = icon && getIcon(icon, 80);
        const { classes } = this.props;

        return (
            <div className={classes.widget}>
                <Card onClick={this.props.onClick}>
                    <CardContent>{widgetIcon}</CardContent>
                </Card>
                <Typography variant="caption" onClick={this.props.onClick}>
                    {name}
                </Typography>
            </div>
        );
    }
}

export default withStyles(styles)(DashboardWidget);

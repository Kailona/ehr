import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Card as MuiCard,
    CardActionArea as MuiCardActionArea,
    CardContent as MuiCardContent,
    Typography,
    withStyles,
} from '@material-ui/core';
import { getIcon } from '@kailona/core';

const Card = withStyles({
    root: {
        display: 'inline-block',
        width: '120px',
        height: '120px',
    },
})(props => <MuiCard {...props} />);

const CardContent = withStyles({
    root: {
        height: '100%',
    },
})(props => <MuiCardContent {...props} />);

const CardActionArea = withStyles({
    root: {
        height: '100%',
    },
})(props => <MuiCardActionArea {...props} />);

export default class DashboardWidget extends Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        name: PropTypes.string,
        children: PropTypes.object,
    };

    render() {
        const { icon, name, children } = this.props;
        const widgetIcon = icon && getIcon(icon);

        return (
            <Card onClick={this.props.onClick}>
                <CardActionArea>
                    <CardContent
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            margin: '5px 0 5px 0',
                        }}
                    >
                        {widgetIcon && (
                            <>
                                {widgetIcon}
                                <Typography variant="body2" style={{ marginTop: '5px', textAlign: 'center' }}>
                                    {name}
                                </Typography>
                            </>
                        )}
                        {children}
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    }
}
